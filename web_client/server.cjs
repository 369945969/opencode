const http = require('http');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');
const { PassThrough } = require('stream');

// Configuration
const TARGET_PORT = 4096;
const TARGET_HOST = '127.0.0.1';
const PROXY_PORT = 4097;
const AUTH_USER = process.env.OPENCODE_SERVER_USERNAME || 'opencode';
const AUTH_PASS = process.env.OPENCODE_SERVER_PASSWORD || '123';

const clients = new Set();

// Function to connect to Backend SSE and forward events
function connectToBackendSSE() {
  const options = {
    hostname: TARGET_HOST,
    port: TARGET_PORT,
    path: '/event',
    method: 'GET',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${AUTH_USER}:${AUTH_PASS}`).toString('base64'),
      'Accept': 'text/event-stream'
    }
  };

  console.log(`Connecting to Backend SSE at http://${TARGET_HOST}:${TARGET_PORT}/event...`);

  const req = http.request(options, (res) => {
    if (res.statusCode !== 200) {
      console.error(`Backend SSE Connection failed with status: ${res.statusCode}`);
      res.resume(); // Consume response to free memory

      // Do not retry on Auth errors
      if (res.statusCode === 401 || res.statusCode === 403) {
        console.error("Authentication failed. Please check OPENCODE_SERVER_USERNAME and OPENCODE_SERVER_PASSWORD.");
        return;
      }

      setTimeout(connectToBackendSSE, 3000); // Retry
      return;
    }

    console.log('Connected to Backend SSE stream!');

    res.on('data', (chunk) => {
      // Forward chunk to all connected clients
      const chunkStr = chunk.toString();
      // Simple logging of event type if possible
      if (chunkStr.includes('payload')) {
        try {
          // Extract JSON from data: ...
          const match = chunkStr.match(/data: ({.*})/);
          if (match) {
            const data = JSON.parse(match[1]);
            console.log('<<< BACKEND EVENT:', data.payload?.type || 'unknown');
          }
        } catch (e) { }
      }

      for (const client of clients) {
        client.write(chunk);
      }
    });

    res.on('end', () => {
      console.log('Backend SSE stream ended. Reconnecting...');
      setTimeout(connectToBackendSSE, 1000);
    });
  });

  req.on('error', (e) => {
    console.error('Backend SSE Connection error:', e.message);
    setTimeout(connectToBackendSSE, 3000);
  });

  req.end();
}

// Start backend SSE connection
connectToBackendSSE();

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Use WHATWG URL API to avoid deprecation warning
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);

  // Handle favicon.ico to prevent it from hitting the protected backend
  if (reqUrl.pathname === '/favicon.ico') {
    res.writeHead(204); // No Content
    res.end();
    return;
  }

  // Serve index.html at /monitor
  if (reqUrl.pathname === '/monitor') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
    return;
  }

  // SSE Endpoint for web_client
  if (reqUrl.pathname === '/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    const keepAlive = setInterval(() => {
      res.write(':\n\n'); // Heartbeat
    }, 15000);

    res.write('data: ' + JSON.stringify({ type: 'connected' }) + '\n\n');
    clients.add(res);
    console.log('Client connected to SSE');

    req.on('close', () => {
      clearInterval(keepAlive);
      clients.delete(res);
      console.log('Client disconnected');
    });
    return;
  }

  // Prepare Proxy Request
  const options = {
    hostname: TARGET_HOST,
    port: TARGET_PORT,
    path: req.url,
    method: req.method,
    headers: { ...req.headers }
  };

  // Clean headers that might cause issues
  delete options.headers.host;
  delete options.headers.connection;

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);

    // Intercept logic for POST Messages Response
    if (req.method === 'POST' && req.url.includes('/message')) {
      const spyStream = new PassThrough();
      const responseChunks = [];

      spyStream.on('data', (chunk) => {
        responseChunks.push(chunk);
      });

      spyStream.on('end', () => {
        try {
          const bodyStr = Buffer.concat(responseChunks).toString();
          try {
            const jsonBody = JSON.parse(bodyStr);
            console.log("<<< AI RESPONSE:", JSON.stringify(jsonBody, null, 2));

            // Broadcast AI response to web clients
            const eventData = JSON.stringify({
              type: 'ai.response',
              timestamp: new Date().toISOString(),
              data: jsonBody
            });

            for (const client of clients) {
              client.write(`data: ${eventData}\n\n`);
            }
          } catch (e) {
            console.log("<<< AI RESPONSE (Raw):", bodyStr.substring(0, 500) + (bodyStr.length > 500 ? "..." : ""));
          }
        } catch (e) {
          console.error("Error logging response:", e);
        }
      });

      // Pipe to both spy and response
      proxyRes.pipe(spyStream);
      proxyRes.pipe(res, { end: true });
    } else {
      proxyRes.pipe(res, { end: true });
    }
  });

  proxyReq.on('error', (e) => {
    console.error('Proxy Error:', e.message);
    if (!res.headersSent) {
      res.writeHead(502);
      res.end('Bad Gateway: ' + e.message);
    }
  });

  // Intercept Logic for POST Messages
  if (req.method === 'POST' && req.url.includes('/message')) {
    let bodyChunks = [];

    req.on('data', (chunk) => {
      bodyChunks.push(chunk);
      proxyReq.write(chunk); // Forward data to real backend
    });

    req.on('end', () => {
      // Log the intercepted request body
      try {
        const bodyStr = Buffer.concat(bodyChunks).toString();
        const jsonBody = JSON.parse(bodyStr);
        console.log("\n>>> INTERCEPTED MESSAGE (Request):");
        // Print only key info to avoid log spam, or full body if needed
        if (jsonBody.messages) {
          const lastMsg = jsonBody.messages[jsonBody.messages.length - 1];
          console.log(`Last Message Role: ${lastMsg.role}`);
          console.log(`Content Preview: ${lastMsg.content.substring(0, 100)}...`);
        } else {
          console.log("Structure:", Object.keys(jsonBody));
        }

        // Broadcast to all connected web clients
        const eventData = JSON.stringify({
          type: 'session.message',
          timestamp: new Date().toISOString(),
          data: jsonBody
        });

        for (const client of clients) {
          client.write(`data: ${eventData}\n\n`);
        }
      } catch (e) {
        console.log(">>> INTERCEPTED MESSAGE (Raw):", Buffer.concat(bodyChunks).toString().substring(0, 100));
      }

      proxyReq.end(); // Finish sending to backend
    });
  } else {
    // For non-intercepted requests, just pipe directly
    req.pipe(proxyReq, { end: true });
  }
});

server.listen(PROXY_PORT, () => {
  console.log(`\n=== Integrated Proxy Server Running ===`);
  console.log(`- OpenCode App (Use this!): http://localhost:${PROXY_PORT}`);
  console.log(`- Monitor Page: http://localhost:${PROXY_PORT}/monitor`);
  console.log(`- Proxy Target: http://${TARGET_HOST}:${TARGET_PORT}`);
  console.log(`\nWaiting for requests...\n`);
});
