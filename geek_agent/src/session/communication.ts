export type MessageType =
  | "status_report"
  | "progress"
  | "completed"
  | "failed"
  | "blocked"
  | "collaboration_request"
  | "heartbeat"

export interface AgentMessage {
  id: string
  type: MessageType
  sessionId: string
  timestamp: number
  payload:
    | StatusReportPayload
    | ProgressPayload
    | CompletedPayload
    | FailedPayload
    | BlockedPayload
    | CollaborationRequestPayload
    | HeartbeatPayload
}

export interface StatusReportPayload {
  status: string
  details?: string
}

export interface ProgressPayload {
  progress: number
  task?: string
}

export interface CompletedPayload {
  result?: unknown
  summary?: string
}

export interface FailedPayload {
  error: string
  reason?: string
}

export interface BlockedPayload {
  reason: string
  waitingOn?: string
}

export interface CollaborationRequestPayload {
  targetSessionId: string
  requestType: "share_context" | "delegate_task" | "merge_results"
  data?: Record<string, unknown>
}

export interface HeartbeatPayload {
  alive: boolean
}

type MessageHandler = (message: AgentMessage) => void

export class MessageBus {
  private subscribers: Map<MessageType, Set<MessageHandler>> = new Map()
  private allHandlers: Set<MessageHandler> = new Set()
  private sessionHandlers: Map<string, Set<MessageHandler>> = new Map()

  subscribe(type: MessageType, handler: MessageHandler): () => void {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, new Set())
    }
    this.subscribers.get(type)!.add(handler)
    return () => this.subscribers.get(type)?.delete(handler)
  }

  subscribeAll(handler: MessageHandler): () => void {
    this.allHandlers.add(handler)
    return () => this.allHandlers.delete(handler)
  }

  subscribeToSession(sessionId: string, handler: MessageHandler): () => void {
    if (!this.sessionHandlers.has(sessionId)) {
      this.sessionHandlers.set(sessionId, new Set())
    }
    this.sessionHandlers.get(sessionId)!.add(handler)
    return () => this.sessionHandlers.get(sessionId)?.delete(handler)
  }

  publish(message: AgentMessage): void {
    const typeHandlers = this.subscribers.get(message.type)
    if (typeHandlers) {
      typeHandlers.forEach((handler) => handler(message))
    }

    this.allHandlers.forEach((handler) => handler(message))

    const sessionHandlers = this.sessionHandlers.get(message.sessionId)
    if (sessionHandlers) {
      sessionHandlers.forEach((handler) => handler(message))
    }
  }

  sendToSession(sessionId: string, type: MessageType, payload: AgentMessage["payload"]): void {
    const message: AgentMessage = {
      id: this.generateId(),
      type,
      sessionId,
      timestamp: Date.now(),
      payload,
    }
    this.publish(message)
  }

  sendStatusReport(sessionId: string, status: string, details?: string): void {
    this.sendToSession(sessionId, "status_report", { status, details })
  }

  sendProgress(sessionId: string, progress: number, task?: string): void {
    this.sendToSession(sessionId, "progress", { progress, task })
  }

  sendCompleted(sessionId: string, result?: unknown, summary?: string): void {
    this.sendToSession(sessionId, "completed", { result, summary })
  }

  sendFailed(sessionId: string, error: string, reason?: string): void {
    this.sendToSession(sessionId, "failed", { error, reason })
  }

  sendBlocked(sessionId: string, reason: string, waitingOn?: string): void {
    this.sendToSession(sessionId, "blocked", { reason, waitingOn })
  }

  sendCollaborationRequest(
    sessionId: string,
    targetSessionId: string,
    requestType: "share_context" | "delegate_task" | "merge_results",
    data?: Record<string, unknown>,
  ): void {
    this.sendToSession(sessionId, "collaboration_request", { targetSessionId, requestType, data })
  }

  sendHeartbeat(sessionId: string): void {
    this.sendToSession(sessionId, "heartbeat", { alive: true })
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  }
}

export const messageBus = new MessageBus()
