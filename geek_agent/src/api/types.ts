// OpenCode API Types

// ============== Session Types ==============
export type SessionType = "Master" | "Fork" | "Subsession" | "NEW"
export type SessionStatus = "INIT" | "ACTIVE" | "MANAGING" | "RUNNING" | "COMPLETED" | "FAILED" | "BLOCKED" | "STANDBY"

export interface SessionPermission {
  permission: "edit" | "bash" | "read"
  pattern: string
  action: "allow" | "deny"
}

export interface SessionContext {
  projectStructure?: string[]
  baseConfig?: Record<string, unknown>
  sharedUtils?: string[]
  constraints?: string[]
}

export interface CreateSessionOptions {
  type: SessionType
  title: string
  parentId?: string
  contextInheritance?: "full" | "partial" | "minimal"
  contextFilter?: {
    include?: string[]
    exclude?: string[]
  }
  permissions?: SessionPermission[]
  systemPrompt?: string
  initialContext?: SessionContext
}

export interface ForkSessionOptions {
  forkId: string
  contextInheritance: "full" | "partial" | "minimal"
  contextFilter?: {
    include: string[]
    exclude?: string[]
    transform?: Record<string, string>
  }
  modeActivation?: string
  taskAssignment: {
    description: string
    requirements?: string[]
    constraints?: string[]
    outputSchema?: Record<string, unknown>
  }
  reporting: {
    to: string
    heartbeatInterval: number
    progressInterval: number
    events: string[]
  }
  resourceLimits?: {
    maxTokens: number
    timeoutSeconds: number
  }
}

export interface SubsessionOptions {
  subsessionType: "research" | "validation" | "tool" | "query"
  contextInheritance: "minimal" | "partial"
  contextFilter?: {
    include: string[]
    maxContextTokens: number
  }
  researchTopic?: string
  expectedOutput?: {
    format: string
    sections: string[]
    maxLength: string
  }
  lifecycle: {
    autoDestroyOnComplete: boolean
    maxDurationSeconds: number
    resultCallback: string
  }
}

export interface Session {
  id: string
  type: SessionType
  status: SessionStatus
  parentId?: string
  title: string
  progress: number
  task: string
  tokensUsed: number
  lastHeartbeat: number
  context?: SessionContext
  createdAt: number
  updatedAt: number
}

// ============== Message Types ==============
export type MessageRole = "user" | "assistant" | "system"
export type MessageStatus = "pending" | "running" | "success" | "failed" | "aborted"

export interface MessagePart {
  type: "text" | "tool" | "reasoning" | "image" | "file"
  text?: string
  tool?: string
  callID?: string
  id?: string
  state?: {
    status?: MessageStatus
    input?: unknown
    output?: unknown
  }
  time?: {
    start?: number
    end?: number
  }
}

export interface Message {
  id: string
  sessionId: string
  role: MessageRole
  parts: MessagePart[]
  status: MessageStatus
  createdAt: number
  completedAt?: number
}

export interface PromptRequest {
  parts: MessagePart[]
  agent?: "build" | "plan"
  model?: {
    providerID: string
    modelID: string
  }
}

export interface PromptResponse {
  messageId: string
  status: "streaming" | "completed" | "error"
}

// ============== Event Types ==============
export type EventType =
  | "session.created"
  | "session.updated"
  | "session.deleted"
  | "session.error"
  | "session.status"
  | "message.created"
  | "message.updated"
  | "message.part.updated"
  | "file.edited"
  | "question.asked"
  | "proxy.status"

export interface EventPayload {
  type: EventType
  sessionID?: string
  messageID?: string
  info?: {
    id?: string
    role?: MessageRole
    sessionID?: string
    time?: {
      created?: number
      completed?: number
    }
  }
  properties?: {
    info?: EventPayload["info"]
    part?: MessagePart & { sessionID?: string; messageID?: string }
    delta?: string
    file?: string
    connected?: boolean
    status?: {
      type?: string
      message?: string
      attempt?: number
      next?: number
    }
    sessionID?: string
    error?: {
      message?: string
      name?: string
    }
    questions?: QuestionItem[]
  }
  part?: MessagePart & { sessionID?: string; messageID?: string }
  delta?: string
  connected?: boolean
  error?: {
    message?: string
    name?: string
  }
  questions?: QuestionItem[]
}

export interface QuestionOption {
  label: string
  description?: string
}

export interface QuestionItem {
  question: string
  header?: string
  options: QuestionOption[]
  multiple?: boolean
}

// ============== Communication Types ==============
export type MessageType =
  | "status_report"
  | "progress"
  | "completed"
  | "failed"
  | "blocked"
  | "collaboration_request"
  | "exception"
  | "heartbeat"

export interface AgentMessage {
  to: string
  messageType: MessageType
  payload: {
    stepId?: string
    status?: string
    progressPercent?: number
    result?: {
      codeFiles?: Array<{ path: string; contentHash: string; lines: number }>
      testCoverage?: number
      documentationSummary?: string
    }
    exception?: {
      errorType: string
      errorCode: string
      recoverable: boolean
      suggestion: string
      details?: unknown
    }
    contextUpdate?: {
      newDependencies?: string[]
      schemaChanges?: string[]
      learnedPatterns?: string[]
    }
    collaborationRequest?: {
      requestType: string
      targetModule: string
      urgency: "low" | "normal" | "high" | "critical"
    }
  }
  traceId: string
  requireReply: boolean
  priority: "low" | "normal" | "high" | "critical"
}
