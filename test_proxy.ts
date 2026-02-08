
const baseUrl = "http://127.0.0.1:4097";

async function readEvents(res: Response) {
    const reader = res.body?.getReader();
    if (!reader) return;
    const decoder = new TextDecoder();
    let buffer = "";
    
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";
        
        for (const line of lines) {
            if (line.startsWith("data: ")) {
                const dataStr = line.slice(6);
                try {
                    const data = JSON.parse(dataStr);
                    if (data.type === "message.delta" && data.properties?.delta) {
                        process.stdout.write(data.properties.delta);
                    }
                    if (data.type === "message.completed") {
                        console.log("\nMessage completed.");
                        process.exit(0);
                    }
                } catch (e) {}
            }
        }
    }
}

async function test() {
  console.log("Creating session...");
  const createRes = await fetch(`${baseUrl}/apps`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ appName: "TestSession" })
  });
  
  if (!createRes.ok) {
    console.error("Failed to create session:", await createRes.text());
    return;
  }
  
  const app = await createRes.json();
  console.log("Session created:", app.sessionId);
  
  // Connect to events
  console.log("Connecting to events...");
  const eventRes = await fetch(`${baseUrl}/events`, {
      headers: { "Accept": "text/event-stream" }
  });
  
  // Start reading events in background
  readEvents(eventRes);

  // Give it a moment to connect
  await new Promise(r => setTimeout(r, 1000));

  console.log("Sending message 'hi'...");
  const msgRes = await fetch(`${baseUrl}/session/${app.sessionId}/prompt_async`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      parts: [{ type: "text", text: "hi" }]
    })
  });
  
  if (!msgRes.ok) {
    console.error("Failed to send message:", await msgRes.text());
  } else {
    console.log("Message sent (204). Waiting for response...");
  }
}

test();
