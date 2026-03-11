import { Database } from "bun:sqlite";
import { type SessionStatus, type SessionMessage, type OpenCodeEvent } from "./types";

// Simple EventEmitter implementation to avoid dependency issues in some environments
class EventEmitter {
  private events: { [key: string]: Function[] } = {};
  on(event: string, listener: Function) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener);
  }
  emit(event: string, ...args: any[]) {
    if (this.events[event]) {
      this.events[event].forEach(listener => listener(...args));
    }
  }
}

declare const process: {
  env: {
    OPENCODE_BASE_URL?: string;
    PROXY_URL?: string;
    OPENCODE_SERVER_USERNAME?: string;
    OPENCODE_SERVER_PASSWORD?: string;
  }
};

class SymphonyManager extends EventEmitter {
  private sessions: Map<string, SessionStatus> = new Map();
  private baseUrl: string = process.env.OPENCODE_BASE_URL ?? "http://127.0.0.1:2345";
  private proxyUrl: string = process.env.PROXY_URL ?? "http://127.0.0.1:4097";
  private sseConnected: boolean = false;
  private db: Database;
  
  private get authHeader() {
    const user = process.env.OPENCODE_SERVER_USERNAME ?? "opencode";
    const pass = process.env.OPENCODE_SERVER_PASSWORD ?? "123";
    return `Basic ${btoa(`${user}:${pass}`)}`;
  }

  constructor() {
    super();
    this.db = new Database("symphony.db");
    this.initDb();
    this.loadSessionsFromDb();

    // Start a single global SSE connection
    this.startGlobalSSE().catch(err => {
      console.error("❌ 全局 SSE 连接启动失败:", err.message);
    });
  }

  private initDb() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        parent_id TEXT,
        status TEXT,
        created_at INTEGER,
        updated_at INTEGER
      )
    `);
    this.db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message_id TEXT, -- 来自后端的 messageID
        session_id TEXT,
        role TEXT,
        content TEXT,
        thinking TEXT,
        is_internal INTEGER,
        ts INTEGER,
        FOREIGN KEY(session_id) REFERENCES sessions(id)
      )
    `);
  }

  private loadSessionsFromDb() {
    const sessions = this.db.query("SELECT * FROM sessions").all() as any[];
    for (const s of sessions) {
      const messages = this.db.query("SELECT * FROM messages WHERE session_id = ? ORDER BY ts ASC").all(s.id) as any[];
      const sessionStatus: SessionStatus = {
        id: s.id,
        parent_id: s.parent_id,
        status: s.status,
        created_at: s.created_at,
        updated_at: s.updated_at,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
          thinking: m.thinking,
          isInternal: m.is_internal === 1,
          ts: m.ts,
          id: m.message_id
        }))
      };
      this.sessions.set(s.id, sessionStatus);
    }
    console.log(`📂 已从数据库加载 ${this.sessions.size} 个会话`);
  }

  private saveSession(session: SessionStatus) {
    this.db.run(
      "INSERT OR REPLACE INTO sessions (id, parent_id, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
      [session.id, session.parent_id || null, session.status, session.created_at, session.updated_at]
    );
  }

  private saveMessage(sessionId: string, message: SessionMessage & { id?: string }) {
    this.db.run(
      "INSERT INTO messages (message_id, session_id, role, content, thinking, is_internal, ts) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [message.id || null, sessionId, message.role, message.content, message.thinking || "", message.isInternal ? 1 : 0, message.ts]
    );
  }

  private updateMessage(sessionId: string, message: SessionMessage & { id?: string }) {
    if (message.id) {
      this.db.run(
        "UPDATE messages SET content = ?, thinking = ? WHERE session_id = ? AND message_id = ?",
        [message.content, message.thinking || "", sessionId, message.id]
      );
    }
  }

  private async startGlobalSSE() {
    const url = `${this.baseUrl}/event`;
    // Reduce noise: only log connection attempts once or on status change
    if (!this.sseConnected) {
      console.log(`📡 正在建立全局 SSE 连接: ${url}`);
    }
    
    try {
      const response = await fetch(url, {
        headers: { 
          "Accept": "text/event-stream",
          "Authorization": this.authHeader
        },
      });

      if (!response.body) {
        this.sseConnected = false;
        setTimeout(() => this.startGlobalSSE(), 5000);
        return;
      }

      this.sseConnected = true;
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          this.sseConnected = false;
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;
          
          try {
            const data: OpenCodeEvent = JSON.parse(trimmed.slice(6));
            this.handleGlobalEvent(data);
          } catch (e) {
            // Skip invalid JSON silently unless it's a major issue
          }
        }
      }
    } catch (err: any) {
      if (this.sseConnected) {
        console.error("❌ SSE 连接意外断开:", err.message);
      }
      this.sseConnected = false;
    }

    // Reconnect after a delay
    setTimeout(() => this.startGlobalSSE(), 5000);
  }

  private handleGlobalEvent(event: OpenCodeEvent) {
    const type = event.type || (event as any).payload?.type;
    const payload = event.payload || event.properties || event;
    const part = payload.part || payload;
    
    // Multi-level sessionID extraction
    const sessionId = part.sessionID || payload.sessionID || event.sessionID || (event as any).info?.sessionID;
    if (!sessionId) return;

    const session = this.sessions.get(sessionId);
    if (!session) return;

    if (type === "message.part.updated") {
      if (part.type === "text" || part.type === "delta") {
        const messageId = part.messageID;
        let msg = session.messages.find(m => (m as any).id === messageId);
        if (!msg) {
          msg = { role: "assistant", content: "", thinking: "", ts: Date.now() };
          (msg as any).id = messageId;
          session.messages.push(msg);
          this.saveMessage(sessionId, msg as any);
        }
        
        const chunk = part.text || event.delta || "";
        if (chunk) {
          msg.content += chunk;
          session.updated_at = Date.now();
          this.updateMessage(sessionId, msg as any);
          this.saveSession(session);
          this.emit(`update:${sessionId}`, { type: "message", sessionId, message: msg });
        }
      } else if (part.type === "reasoning") {
        const messageId = part.messageID;
        let msg = session.messages.find(m => (m as any).id === messageId);
        if (!msg) {
          msg = { role: "assistant", content: "", thinking: "", ts: Date.now() };
          (msg as any).id = messageId;
          session.messages.push(msg);
          this.saveMessage(sessionId, msg as any);
        }
        
        const chunk = part.text || "";
        if (chunk) {
          msg.thinking += chunk;
          session.updated_at = Date.now();
          this.updateMessage(sessionId, msg as any);
          this.saveSession(session);
          this.emit(`update:${sessionId}`, { type: "message", sessionId, message: msg });
        }
      }
    } else if (type === "session.status.updated") {
       const newStatus = payload.status || (payload as any).state?.status;
       if (newStatus === "busy" || newStatus === "idle") {
         session.status = newStatus as "busy" | "idle";
         session.updated_at = Date.now();
         this.saveSession(session);
         this.emit(`update:${sessionId}`, { type: "status", sessionId, status: newStatus });
         
         if (newStatus === "idle") {
           console.log(`✅ 会话 ${sessionId.slice(-6)} 已就绪 (Idle)`);
         }
       }
    }
  }

  public async createSession(parentId?: string, initialPrompt?: string): Promise<string> {
    const res = await fetch(`${this.baseUrl}/session`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": this.authHeader
      },
      body: JSON.stringify({}),
    }).catch(err => {
      console.error(`❌ 连接后端失败 (${this.baseUrl}):`, err.message);
      throw new Error(`无法连接到 OpenCode 后端: ${err.message}`);
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ 后端返回错误状态码 ${res.status}:`, errorText);
      throw new Error(`后端返回错误: ${res.status} ${errorText}`);
    }

    const responseText = await res.text();
    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("❌ 无法解析后端返回的 JSON:", responseText);
      throw new Error("后端返回了无效的 JSON 格式");
    }

    const sessionId = data.id;
    if (!sessionId) {
      throw new Error("后端返回的会话数据中缺少 ID");
    }

    const messages: SessionMessage[] = [];
    if (parentId) {
      const parent = this.sessions.get(parentId);
      if (parent) {
        // 继承上下文：深度拷贝之前的对话
        messages.push(...JSON.parse(JSON.stringify(parent.messages)));
      }
    }

    const session: SessionStatus = {
      id: sessionId,
      parent_id: parentId,
      status: "idle",
      messages,
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    this.sessions.set(sessionId, session);
    this.saveSession(session);
    // 如果继承了消息，也需要把消息存入数据库
    for (const msg of messages) {
      this.saveMessage(sessionId, msg);
    }

    if (initialPrompt) {
      await this.sendMessage(sessionId, initialPrompt, true);
    }

    return sessionId;
  }

  public async sendMessage(sessionId: string, text: string, isInternal: boolean = false) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error("Session not found");

    const newMessage: SessionMessage = { 
      role: "user", 
      content: text, 
      isInternal, 
      ts: Date.now() 
    };
    
    session.messages.push(newMessage);
    session.status = "busy";
    session.updated_at = Date.now();

    this.saveMessage(sessionId, newMessage);
    this.saveSession(session);

    // Prepare parts including history for context inheritance
    const parts = session.messages.map(m => ({
      type: "text",
      text: m.content
    }));

    await fetch(`${this.baseUrl}/session/${sessionId}/prompt_async`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": this.authHeader
      },
      body: JSON.stringify({
        parts: parts,
      }),
    });
  }

  public getSessionStatus(sessionId: string): SessionStatus | undefined {
    return this.sessions.get(sessionId);
  }

  public getAllSessions(): SessionStatus[] {
    return Array.from(this.sessions.values());
  }

  public async getTitle(description: string): Promise<{ title: string, sessionId: string }> {
    const sessionId = await this.createSession();
    
    const prompt = `请根据以下任务描述，生成一个简洁的标题（限制20个字以内）。直接返回标题内容，不要包含任何其他文字、标点符号或解释：\n\n${description}`;
    
    await this.sendMessage(sessionId, prompt, true);

    // 等待标题生成完成 (轮询等待状态变为 idle)
    let title = "";
    let thinking = "";
    const maxRetries = 30; // 30秒超时
    for (let i = 0; i < maxRetries; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const status = this.getSessionStatus(sessionId);
      if (status && status.status === "idle") {
        const lastMsg = status.messages.filter(m => m.role === "assistant").pop();
        if (lastMsg) {
          title = lastMsg.content.trim().replace(/^"|"$/g, ''); // 移除可能的引号
          thinking = lastMsg.thinking || "";
          break;
        }
      }
    }

    if (!title) {
      title = description.slice(0, 20) + (description.length > 20 ? "..." : "");
    }

    // 修复：生成标题后，重置该 session 的消息历史
    const session = this.sessions.get(sessionId);
    if (session) {
      // 第一条：用户的原始描述
      const firstMessage: SessionMessage = { role: "user", content: description, ts: Date.now() };
      // 第二条：Agent 的回答（包含标题和思考过程），作为业务的第一步输出
      const assistantMessage: SessionMessage = { 
        role: "assistant", 
        content: `已为您生成任务标题：${title}`, 
        thinking: thinking,
        ts: Date.now() + 1,
        id: `msg_title_${Date.now()}` 
      };

      session.messages = [firstMessage, assistantMessage];
      session.updated_at = Date.now();
      
      // 更新数据库中的消息历史
      this.db.run("DELETE FROM messages WHERE session_id = ?", [sessionId]);
      this.saveMessage(sessionId, firstMessage);
      this.saveMessage(sessionId, assistantMessage);
      this.saveSession(session);

      // 触发 SSE 更新，让前端感知到消息的变化
      this.emit(`update:${sessionId}`, { type: "message", sessionId, message: assistantMessage });
    }

    return { title, sessionId };
  }
}

const manager = new SymphonyManager();

// @ts-ignore
export default {
  port: 4098,
  // @ts-ignore
  async fetch(req: Request) {
    const url = new URL(req.url);
    const path = url.pathname;

    // CORS headers
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (req.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    if (path === "/get-title" && req.method === "POST") {
      try {
        const body = await req.json().catch(() => ({}));
        if (!body.description) {
          return Response.json({ error: "Description required" }, { status: 400, headers });
        }
        const result = await manager.getTitle(body.description);
        return Response.json(result, { headers });
      } catch (e: any) {
        console.error("❌ 获取标题失败:", e.message);
        return Response.json({ error: e.message }, { status: 500, headers });
      }
    }

    if (path === "/sessions" && req.method === "POST") {
      try {
        const body = await req.json().catch(() => ({}));
        const id = await manager.createSession(body.parent_id, body.initial_prompt);
        return Response.json({ id }, { headers });
      } catch (e: any) {
        console.error("❌ 创建会话失败:", e.message);
        return Response.json({ error: e.message }, { status: 500, headers });
      }
    }

    if (path === "/sessions" && req.method === "GET") {
      return Response.json(manager.getAllSessions(), { headers });
    }

    if (path.startsWith("/sessions/") && req.method === "GET") {
      const id = path.split("/")[2];
      const subPath = path.split("/")[3];

      if (subPath === "events") {
        const session = manager.getSessionStatus(id);
        if (!session) {
          return new Response("Session not found", { status: 404, headers });
        }

        const stream = new ReadableStream({
          start(controller) {
            // 1. 发送所有历史非内部消息
            const publicMessages = session.messages.filter(m => !m.isInternal);
            const initialData = JSON.stringify({ 
              type: "history", 
              messages: publicMessages,
              status: session.status 
            });
            controller.enqueue(`data: ${initialData}\n\n`);

            // 2. 订阅后续更新
            const listener = (event: any) => {
              const data = JSON.stringify(event);
              controller.enqueue(`data: ${data}\n\n`);
            };

            manager.on(`update:${id}`, listener);

            // 处理连接关闭
            req.signal.addEventListener("abort", () => {
              // 注意：Bun 的 EventEmitter 需要移除监听器的实现
              // 这里简化处理，实际生产环境建议完善移除逻辑
              console.log(`🔌 SSE 连接已断开: ${id}`);
            });
          }
        });

        return new Response(stream, {
          headers: {
            ...headers,
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
          },
        });
      }

      if (subPath === "logs") {
        const status = manager.getSessionStatus(id);
        if (!status) {
          return Response.json({ error: "Session not found" }, { status: 404, headers });
        }
        // 返回所有非内部消息，前端根据消息数量或 ID 进行增量同步
        const publicMessages = status.messages.filter(m => !m.isInternal);
        return Response.json({ 
          messages: publicMessages,
          status: status.status
        }, { headers });
      }

      const status = manager.getSessionStatus(id);
      if (!status) {
        return Response.json({ error: "Session not found" }, { status: 404, headers });
      }
      return Response.json(status, { headers });
    }

    if (path.startsWith("/sessions/") && path.endsWith("/message") && req.method === "POST") {
      const id = path.split("/")[2];
      const body = await req.json().catch(() => ({}));
      if (!body.text) return new Response("Text required", { status: 400, headers });
      await manager.sendMessage(id, body.text);
      return Response.json({ success: true }, { headers });
    }

    return new Response("Not Found", { status: 404, headers });
  },
};

console.log("Symphony server running on http://localhost:4098");

