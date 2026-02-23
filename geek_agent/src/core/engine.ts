import { MemorySystem } from "./memory-system"
import { MetaCognition, CognitiveMode } from "./meta-cognition"
import { SessionManager, SessionStatus } from "./session-manager"
import { OpenCodeClient } from "../api/client"
import type { PromptRequest, EventPayload } from "../api/types"

export type SessionLogItem = {
  timestamp: number
  role: string
  content: string
}

export class CognitiveEngine {
  public memory: MemorySystem
  public meta: MetaCognition
  public sessions: SessionManager
  public client: OpenCodeClient
  public connectionStatus: { connected: boolean; latency: number }
  private remoteSessionId: string | null
  private logs: Map<string, SessionLogItem[]>

  constructor() {
    this.memory = new MemorySystem()
    this.meta = new MetaCognition(this.memory)
    this.sessions = new SessionManager()
    this.client = new OpenCodeClient()
    this.connectionStatus = { connected: false, latency: 0 }
    this.remoteSessionId = null
    this.logs = new Map()
    this.sessions.createSession("Master", "System Orchestration")
  }

  connect() {
    this.client.connectEvents()

    this.client.on("connection", (data: any) => {
      if (data.connected !== undefined) {
        this.connectionStatus.connected = data.connected
      }
    })

    this.client.on("*", (event: EventPayload) => {
      this.handleEvent(event)
    })

    // Measure latency
    this.measureLatency()
  }

  private async measureLatency() {
    setInterval(async () => {
      const start = Date.now()
      try {
        await this.client.ping()
        this.connectionStatus.latency = Date.now() - start
        this.connectionStatus.connected = true
      } catch {
        this.connectionStatus.latency = 0
        this.connectionStatus.connected = false
      }
    }, 5000)
  }

  processObjective(objective: string) {
    const recommendedMode = this.meta.analyzeIntent(objective)
    this.meta.setMode(recommendedMode)

    this.memory.encode(`New Objective Received: ${objective}`, "working", ["objective"])

    if (recommendedMode === "Craftsman") {
      this.sessions.createSession("Fork", `Implement: ${objective}`, "master-001")
    }

    void this.runRemoteObjective(objective)
  }

  private async ensureRemoteSession() {
    if (this.remoteSessionId) return this.remoteSessionId
    const session = await this.client.createSession({
      type: "Master",
      title: "Geek Agent Orchestration",
    })
    this.remoteSessionId = session.id
    return session.id
  }

  private async runRemoteObjective(objective: string) {
    const sessionId = await this.ensureRemoteSession()
    const request: PromptRequest = {
      agent: "plan",
      parts: [
        {
          type: "text",
          text: objective,
        },
      ],
    }
    await this.client.sendPrompt(sessionId, request)
    this.addLog(sessionId, "user", objective)
  }

  private handleEvent(event: EventPayload) {
    if (event.type === "message.part.updated") {
      const text = event.part?.text ?? event.properties?.delta
      if (text) {
        this.memory.encode(text, "sensory", ["assistant"])
        const id =
          event.part?.sessionID ??
          event.properties?.part?.sessionID ??
          event.sessionID ??
          event.properties?.sessionID ??
          event.info?.sessionID ??
          event.properties?.info?.sessionID
        if (id) {
          this.addLog(id, "assistant", text)
        }
      }
      return
    }

    if (event.type === "message.updated") {
      const info = (event.properties as any)?.info ?? event.info
      const id = info?.sessionID ?? event.sessionID ?? event.properties?.sessionID
      if (!id || !info) return
      const tokens = (info as any).tokens
      if (tokens) {
        const total =
          typeof tokens.total === "number"
            ? tokens.total
            : (tokens.input ?? 0) + (tokens.output ?? 0) + (tokens.reasoning ?? 0)
        if (total > 0) {
          const used = Math.max(1, Math.round(total / 1000))
          this.sessions.updateSession(id, { tokensUsed: used })
        }
      }
      return
    }

    if (
      event.type === "session.created" ||
      event.type === "session.updated" ||
      event.type === "session.status" ||
      event.type === "session.deleted"
    ) {
      const id =
        event.sessionID ??
        event.properties?.sessionID ??
        event.info?.sessionID ??
        event.properties?.info?.sessionID
      if (!id) return

      if (event.type === "session.deleted") {
        this.sessions.terminateSession(id)
        return
      }

      const existing = this.sessions.getSession(id)
      const status = this.mapStatus(event.properties?.status?.type)
      const taskTitle = event.properties?.status?.message
      const s = event.properties?.status
      let progress: number | undefined
      if (event.type === "session.status" && s) {
        if (s.type === "busy") {
          progress = Math.max(existing?.progress ?? 0, 10)
        }
        if (s.type === "idle") {
          progress = 100
        }
        if (s.type === "retry") {
          progress = existing?.progress ?? 0
        }
      }

      if (!existing) {
        const created = this.sessions.createSession("Master", taskTitle || "Remote Session", undefined, id)
        if (typeof progress === "number") {
          this.sessions.updateSession(created.id, { progress })
        }
        return
      }

      const updates: Partial<{ status: SessionStatus; task: string; progress: number }> = {}
      if (status) updates.status = status
      if (taskTitle) updates.task = taskTitle
      if (typeof progress === "number") updates.progress = progress
      if (updates.status || updates.task || typeof updates.progress === "number") {
        this.sessions.updateSession(id, updates)
      }
    }
  }

  private mapStatus(type?: string): SessionStatus | undefined {
    if (!type) return
    const t = type.toLowerCase()
    if (t === "running" || t === "active") return "ACTIVE"
    if (t === "completed" || t === "success") return "COMPLETED"
    if (t === "failed" || t === "error") return "FAILED"
    if (t === "blocked") return "BLOCKED"
    if (t === "managing") return "MANAGING"
    return
  }

  private addLog(id: string, role: string, content: string) {
    if (!content.trim()) return
    const entry: SessionLogItem = {
      timestamp: Date.now(),
      role,
      content,
    }
    const list = this.logs.get(id) ?? []
    list.push(entry)
    if (list.length > 200) {
      list.shift()
    }
    this.logs.set(id, list)
  }

  getSessionLog(id: string): SessionLogItem[] {
    return this.logs.get(id) ?? []
  }

  getHeartbeat() {
    return {
      mode: this.meta.getCurrentMode(),
      sessions: this.sessions.getSessions(),
      memoryCounts: {
        working: this.memory.getMemories("working").length,
        short: this.memory.getMemories("short-term").length,
        long: this.memory.getMemories("long-term").length,
      },
    }
  }
}

export const engine = new CognitiveEngine()
