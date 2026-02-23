import { ApiConfig, defaultConfig, createAuthHeader } from "./config"
import type {
  Session,
  CreateSessionOptions,
  ForkSessionOptions,
  SubsessionOptions,
  PromptRequest,
  EventPayload,
} from "./types"

export class OpenCodeClient {
  private config: ApiConfig
  private authHeader: string
  private eventSource: EventSource | null = null
  private eventListeners: Map<string, Set<(data: EventPayload) => void>> = new Map()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 10
  private reconnectDelay = 2000
  private connected = false

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
    this.authHeader = createAuthHeader(this.config.username, this.config.password)
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }
    if (this.authHeader) {
      headers["Authorization"] = this.authHeader
    }
    return headers
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.config.baseUrl}${path}`
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "")
      throw new Error(`API Error ${response.status}: ${errorText}`)
    }

    const contentType = response.headers.get("content-type")
    if (contentType?.includes("application/json")) {
      return response.json()
    }
    return response.text() as Promise<T>
  }

  async createSession(options: CreateSessionOptions): Promise<Session> {
    const body = {
      title: options.title,
      permission: options.permissions || [
        { permission: "edit", pattern: "*", action: "allow" },
        { permission: "bash", pattern: "*", action: "allow" },
        { permission: "read", pattern: "*", action: "allow" },
      ],
      systemPrompt: options.systemPrompt,
    }

    const data = await this.request<{ id: string }>("/session", {
      method: "POST",
      body: JSON.stringify(body),
    })

    return {
      id: data.id,
      type: options.type,
      status: "INIT",
      parentId: options.parentId,
      title: options.title,
      progress: 0,
      task: options.title,
      tokensUsed: 0,
      lastHeartbeat: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  }

  async createFork(parentId: string, options: ForkSessionOptions): Promise<Session> {
    return this.createSession({
      type: "Fork",
      title: options.taskAssignment.description,
      parentId,
      permissions: undefined,
    })
  }

  async createSubsession(parentId: string, options: SubsessionOptions): Promise<Session> {
    return this.createSession({
      type: "Subsession",
      title: options.researchTopic || "Subsession Task",
      parentId,
      permissions: undefined,
    })
  }

  async getSession(sessionId: string): Promise<Session> {
    return this.request(`/session/${sessionId}`)
  }

  async ping(): Promise<void> {
    await this.request("/doc")
  }

  async terminateSession(sessionId: string): Promise<void> {
    await this.request(`/session/${sessionId}`, { method: "DELETE" })
  }

  async sendPrompt(sessionId: string, request: PromptRequest): Promise<Response> {
    const body = {
      ...request,
      model: request.model || {
        providerID: this.config.defaultProviderId,
        modelID: this.config.defaultModelId,
      },
    }

    const url = `${this.config.baseUrl}/session/${sessionId}/prompt_async`
    return fetch(url, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    })
  }

  async abortSession(sessionId: string): Promise<void> {
    await this.request(`/session/${sessionId}/abort`, { method: "POST" })
  }

  connectEvents(): void {
    if (this.eventSource) {
      this.eventSource.close()
    }

    const url = new URL("/event", this.config.baseUrl)
    this.eventSource = new EventSource(url.toString())

    this.eventSource.onopen = () => {
      this.connected = true
      this.reconnectAttempts = 0
      this.emit("connection", { type: "proxy.status", connected: true } as EventPayload)
    }

    this.eventSource.onerror = () => {
      this.connected = false
      this.emit("connection", { type: "proxy.status", connected: false } as EventPayload)
      this.scheduleReconnect()
    }

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as EventPayload
        this.emit(data.type || "unknown", data)
        this.emit("*", data)
      } catch {
        // Ignore parse errors
      }
    }
  }

  disconnectEvents(): void {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
      this.connected = false
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1)

    setTimeout(() => {
      this.connectEvents()
    }, delay)
  }

  on(event: string, callback: (data: EventPayload) => void): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set())
    }
    this.eventListeners.get(event)!.add(callback)

    return () => {
      this.eventListeners.get(event)?.delete(callback)
    }
  }

  private emit(event: string, data: EventPayload): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach((callback) => callback(data))
    }
  }

  isConnected(): boolean {
    return this.connected
  }

  getConfig(): ApiConfig {
    return { ...this.config }
  }
}

export const createClient = (config?: Partial<ApiConfig>): OpenCodeClient => {
  return new OpenCodeClient(config)
}
