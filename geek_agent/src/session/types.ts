export type SessionType = "Master" | "Fork" | "Subsession" | "NEW"
export type SessionStatus = "INIT" | "ACTIVE" | "MANAGING" | "RUNNING" | "COMPLETED" | "FAILED" | "BLOCKED" | "STANDBY"

export type ContextInheritance = "full" | "partial" | "minimal" | "none"

export interface SessionContext {
  projectStructure?: string[]
  baseConfig?: Record<string, unknown>
  sharedUtils?: string[]
  constraints?: string[]
  taskFocus?: string
  moduleName?: string
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
  contextInheritance?: ContextInheritance
  createdAt: number
  updatedAt: number
  children?: Session[]
  heartbeatInterval?: ReturnType<typeof setInterval>
}

export interface CreateSessionOptions {
  type: SessionType
  title: string
  parentId?: string
  contextInheritance?: ContextInheritance
  context?: SessionContext
  systemPrompt?: string
}

export interface ForkOptions {
  forkId: string
  task: string
  contextInheritance: ContextInheritance
  contextFilter?: {
    include?: string[]
    exclude?: string[]
    transform?: Record<string, string>
  }
}

export interface SubsessionOptions {
  subsessionType: "research" | "validation" | "tool" | "query"
  task: string
  contextInheritance: "minimal" | "partial"
  autoDestroy?: boolean
  maxDuration?: number
}

export interface SessionState {
  totalSessions: number
  activeForks: number
  activeSubsessions: number
  masterSession: Session | null
}
