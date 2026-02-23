import type {
  Session,
  SessionType,
  SessionStatus,
  CreateSessionOptions,
  ForkOptions,
  SubsessionOptions,
  SessionState,
  ContextInheritance,
} from "./types"

const HEARTBEAT_INTERVAL = 30000
const HEARTBEAT_TIMEOUT = 60000

export class SessionManager {
  private sessions: Map<string, Session> = new Map()
  private masterSessionId: string | null = null
  private heartbeatTimers: Map<string, ReturnType<typeof setInterval>> = new Map()
  private listeners: Set<(sessions: Session[]) => void> = new Set()

  constructor() {}

  createSession(options: CreateSessionOptions): Session {
    const id = this.generateId(options.type)

    let context = options.context
    if (options.parentId && options.contextInheritance && options.contextInheritance !== "none") {
      context = this.inheritContext(options.parentId, options.contextInheritance, options.context)
    }

    const session: Session = {
      id,
      type: options.type,
      status: "INIT",
      parentId: options.parentId,
      title: options.title,
      progress: 0,
      task: options.title,
      tokensUsed: 0,
      lastHeartbeat: Date.now(),
      context,
      contextInheritance: options.contextInheritance,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    this.sessions.set(id, session)

    if (options.type === "Master") {
      this.masterSessionId = id
    }

    if (options.parentId) {
      this.addChildToParent(options.parentId, session)
    }

    this.startHeartbeat(id)
    this.activateSession(id)
    this.notifyListeners()

    return session
  }

  private generateId(type: SessionType): string {
    const prefix = type.toLowerCase()
    const suffix = Math.random().toString(36).substring(2, 9)
    return `${prefix}-${suffix}`
  }

  private inheritContext(
    parentId: string,
    inheritance: ContextInheritance,
    additional?: Session["context"],
  ): Session["context"] {
    const parent = this.sessions.get(parentId)
    if (!parent?.context) return additional || {}

    switch (inheritance) {
      case "full":
        return { ...parent.context, ...additional }
      case "partial":
        return {
          projectStructure: parent.context.projectStructure,
          baseConfig: parent.context.baseConfig,
          ...additional,
        }
      case "minimal":
        return {
          constraints: parent.context.constraints,
          ...additional,
        }
      default:
        return additional || {}
    }
  }

  private addChildToParent(parentId: string, child: Session): void {
    const parent = this.sessions.get(parentId)
    if (!parent) return
    if (!parent.children) parent.children = []
    parent.children.push(child)
  }

  private startHeartbeat(sessionId: string): void {
    if (this.heartbeatTimers.has(sessionId)) return

    const timer = setInterval(() => {
      const session = this.sessions.get(sessionId)
      if (!session) {
        this.stopHeartbeat(sessionId)
        return
      }

      const elapsed = Date.now() - session.lastHeartbeat
      if (elapsed > HEARTBEAT_TIMEOUT && session.status !== "COMPLETED" && session.status !== "FAILED") {
        this.updateSession(sessionId, { status: "BLOCKED" })
      }
    }, HEARTBEAT_INTERVAL)

    this.heartbeatTimers.set(sessionId, timer)
  }

  private stopHeartbeat(sessionId: string): void {
    const timer = this.heartbeatTimers.get(sessionId)
    if (timer) {
      clearInterval(timer)
      this.heartbeatTimers.delete(sessionId)
    }
  }

  activateSession(id: string): void {
    const session = this.sessions.get(id)
    if (!session) return

    session.status = session.type === "Master" ? "MANAGING" : "ACTIVE"
    session.lastHeartbeat = Date.now()
    session.updatedAt = Date.now()
    this.notifyListeners()
  }

  updateSession(id: string, updates: Partial<Session>): Session | undefined {
    const session = this.sessions.get(id)
    if (!session) return undefined

    Object.assign(session, updates, {
      updatedAt: Date.now(),
      lastHeartbeat: Date.now(),
    })
    this.notifyListeners()
    return session
  }

  updateProgress(id: string, progress: number, task?: string): void {
    this.updateSession(id, {
      progress: Math.min(100, Math.max(0, progress)),
      ...(task && { task }),
    })
  }

  completeSession(id: string, result?: unknown): Session | undefined {
    this.stopHeartbeat(id)
    const session = this.updateSession(id, {
      status: "COMPLETED",
      progress: 100,
    })

    if (session?.parentId) {
      this.propagateCompletion(session.parentId, session)
    }

    return session
  }

  failSession(id: string, error: string): Session | undefined {
    this.stopHeartbeat(id)
    return this.updateSession(id, {
      status: "FAILED",
      task: `${this.sessions.get(id)?.task || ""} - Error: ${error}`,
    })
  }

  private propagateCompletion(parentId: string, completedChild: Session): void {
    const parent = this.sessions.get(parentId)
    if (!parent || parent.type !== "Master") return

    const children = this.getForksForParent(parentId)
    const allComplete = children.every((c) => c.status === "COMPLETED" || c.status === "FAILED")

    if (allComplete) {
      const avgProgress = children.reduce((sum, c) => sum + c.progress, 0) / children.length
      this.updateSession(parentId, { progress: avgProgress })
    }
  }

  getSessions(): Session[] {
    return Array.from(this.sessions.values())
  }

  getSession(id: string): Session | undefined {
    return this.sessions.get(id)
  }

  getMasterSession(): Session | null {
    if (!this.masterSessionId) return null
    return this.sessions.get(this.masterSessionId) || null
  }

  getForksForParent(parentId: string): Session[] {
    return this.getSessions().filter((s) => s.parentId === parentId && s.type === "Fork")
  }

  getSubsessionsForParent(parentId: string): Session[] {
    return this.getSessions().filter((s) => s.parentId === parentId && s.type === "Subsession")
  }

  getActiveSessions(): Session[] {
    return this.getSessions().filter((s) => s.status === "ACTIVE" || s.status === "RUNNING" || s.status === "MANAGING")
  }

  getState(): SessionState {
    const sessions = this.getSessions()
    return {
      totalSessions: sessions.length,
      activeForks: sessions.filter((s) => s.type === "Fork" && s.status === "ACTIVE").length,
      activeSubsessions: sessions.filter((s) => s.type === "Subsession" && s.status === "ACTIVE").length,
      masterSession: this.getMasterSession(),
    }
  }

  terminateSession(id: string): void {
    const session = this.sessions.get(id)
    if (!session) return

    if (session.children) {
      session.children.forEach((child) => this.terminateSession(child.id))
    }

    this.stopHeartbeat(id)
    this.sessions.delete(id)
    this.notifyListeners()
  }

  createFork(parentId: string, options: ForkOptions): Session {
    return this.createSession({
      type: "Fork",
      title: options.task,
      parentId,
      contextInheritance: options.contextInheritance,
      context: {
        moduleName: options.contextFilter?.transform?.module_name,
        taskFocus: options.contextFilter?.transform?.task_focus,
      },
    })
  }

  createSubsession(parentId: string, options: SubsessionOptions): Session {
    const session = this.createSession({
      type: "Subsession",
      title: options.task,
      parentId,
      contextInheritance: options.contextInheritance,
    })

    if (options.maxDuration) {
      setTimeout(() => {
        const s = this.sessions.get(session.id)
        if (s && s.status !== "COMPLETED") {
          this.failSession(session.id, "Timeout")
        }
      }, options.maxDuration * 1000)
    }

    return session
  }

  subscribe(listener: (sessions: Session[]) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notifyListeners(): void {
    const sessions = this.getSessions()
    this.listeners.forEach((listener) => listener(sessions))
  }

  reset(): void {
    this.heartbeatTimers.forEach((timer) => clearInterval(timer))
    this.heartbeatTimers.clear()
    this.sessions.clear()
    this.masterSessionId = null
    this.notifyListeners()
  }
}

export const sessionManager = new SessionManager()
