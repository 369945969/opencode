const HEARTBEAT_INTERVAL = 30000;
const HEARTBEAT_TIMEOUT = 60000;
export class SessionManager {
    sessions = new Map();
    masterSessionId = null;
    heartbeatTimers = new Map();
    listeners = new Set();
    constructor() { }
    createSession(options) {
        const id = this.generateId(options.type);
        let context = options.context;
        if (options.parentId && options.contextInheritance && options.contextInheritance !== "none") {
            context = this.inheritContext(options.parentId, options.contextInheritance, options.context);
        }
        const session = {
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
        };
        this.sessions.set(id, session);
        if (options.type === "Master") {
            this.masterSessionId = id;
        }
        if (options.parentId) {
            this.addChildToParent(options.parentId, session);
        }
        this.startHeartbeat(id);
        this.activateSession(id);
        this.notifyListeners();
        return session;
    }
    generateId(type) {
        const prefix = type.toLowerCase();
        const suffix = Math.random().toString(36).substring(2, 9);
        return `${prefix}-${suffix}`;
    }
    inheritContext(parentId, inheritance, additional) {
        const parent = this.sessions.get(parentId);
        if (!parent?.context)
            return additional || {};
        switch (inheritance) {
            case "full":
                return { ...parent.context, ...additional };
            case "partial":
                return {
                    projectStructure: parent.context.projectStructure,
                    baseConfig: parent.context.baseConfig,
                    ...additional,
                };
            case "minimal":
                return {
                    constraints: parent.context.constraints,
                    ...additional,
                };
            default:
                return additional || {};
        }
    }
    addChildToParent(parentId, child) {
        const parent = this.sessions.get(parentId);
        if (!parent)
            return;
        if (!parent.children)
            parent.children = [];
        parent.children.push(child);
    }
    startHeartbeat(sessionId) {
        if (this.heartbeatTimers.has(sessionId))
            return;
        const timer = setInterval(() => {
            const session = this.sessions.get(sessionId);
            if (!session) {
                this.stopHeartbeat(sessionId);
                return;
            }
            const elapsed = Date.now() - session.lastHeartbeat;
            if (elapsed > HEARTBEAT_TIMEOUT && session.status !== "COMPLETED" && session.status !== "FAILED") {
                this.updateSession(sessionId, { status: "BLOCKED" });
            }
        }, HEARTBEAT_INTERVAL);
        this.heartbeatTimers.set(sessionId, timer);
    }
    stopHeartbeat(sessionId) {
        const timer = this.heartbeatTimers.get(sessionId);
        if (timer) {
            clearInterval(timer);
            this.heartbeatTimers.delete(sessionId);
        }
    }
    activateSession(id) {
        const session = this.sessions.get(id);
        if (!session)
            return;
        session.status = session.type === "Master" ? "MANAGING" : "ACTIVE";
        session.lastHeartbeat = Date.now();
        session.updatedAt = Date.now();
        this.notifyListeners();
    }
    updateSession(id, updates) {
        const session = this.sessions.get(id);
        if (!session)
            return undefined;
        Object.assign(session, updates, {
            updatedAt: Date.now(),
            lastHeartbeat: Date.now(),
        });
        this.notifyListeners();
        return session;
    }
    updateProgress(id, progress, task) {
        this.updateSession(id, {
            progress: Math.min(100, Math.max(0, progress)),
            ...(task && { task }),
        });
    }
    completeSession(id, result) {
        this.stopHeartbeat(id);
        const session = this.updateSession(id, {
            status: "COMPLETED",
            progress: 100,
        });
        if (session?.parentId) {
            this.propagateCompletion(session.parentId, session);
        }
        return session;
    }
    failSession(id, error) {
        this.stopHeartbeat(id);
        return this.updateSession(id, {
            status: "FAILED",
            task: `${this.sessions.get(id)?.task || ""} - Error: ${error}`,
        });
    }
    propagateCompletion(parentId, completedChild) {
        const parent = this.sessions.get(parentId);
        if (!parent || parent.type !== "Master")
            return;
        const children = this.getForksForParent(parentId);
        const allComplete = children.every((c) => c.status === "COMPLETED" || c.status === "FAILED");
        if (allComplete) {
            const avgProgress = children.reduce((sum, c) => sum + c.progress, 0) / children.length;
            this.updateSession(parentId, { progress: avgProgress });
        }
    }
    getSessions() {
        return Array.from(this.sessions.values());
    }
    getSession(id) {
        return this.sessions.get(id);
    }
    getMasterSession() {
        if (!this.masterSessionId)
            return null;
        return this.sessions.get(this.masterSessionId) || null;
    }
    getForksForParent(parentId) {
        return this.getSessions().filter((s) => s.parentId === parentId && s.type === "Fork");
    }
    getSubsessionsForParent(parentId) {
        return this.getSessions().filter((s) => s.parentId === parentId && s.type === "Subsession");
    }
    getActiveSessions() {
        return this.getSessions().filter((s) => s.status === "ACTIVE" || s.status === "RUNNING" || s.status === "MANAGING");
    }
    getState() {
        const sessions = this.getSessions();
        return {
            totalSessions: sessions.length,
            activeForks: sessions.filter((s) => s.type === "Fork" && s.status === "ACTIVE").length,
            activeSubsessions: sessions.filter((s) => s.type === "Subsession" && s.status === "ACTIVE").length,
            masterSession: this.getMasterSession(),
        };
    }
    terminateSession(id) {
        const session = this.sessions.get(id);
        if (!session)
            return;
        if (session.children) {
            session.children.forEach((child) => this.terminateSession(child.id));
        }
        this.stopHeartbeat(id);
        this.sessions.delete(id);
        this.notifyListeners();
    }
    createFork(parentId, options) {
        return this.createSession({
            type: "Fork",
            title: options.task,
            parentId,
            contextInheritance: options.contextInheritance,
            context: {
                moduleName: options.contextFilter?.transform?.module_name,
                taskFocus: options.contextFilter?.transform?.task_focus,
            },
        });
    }
    createSubsession(parentId, options) {
        const session = this.createSession({
            type: "Subsession",
            title: options.task,
            parentId,
            contextInheritance: options.contextInheritance,
        });
        if (options.maxDuration) {
            setTimeout(() => {
                const s = this.sessions.get(session.id);
                if (s && s.status !== "COMPLETED") {
                    this.failSession(session.id, "Timeout");
                }
            }, options.maxDuration * 1000);
        }
        return session;
    }
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
    notifyListeners() {
        const sessions = this.getSessions();
        this.listeners.forEach((listener) => listener(sessions));
    }
    reset() {
        this.heartbeatTimers.forEach((timer) => clearInterval(timer));
        this.heartbeatTimers.clear();
        this.sessions.clear();
        this.masterSessionId = null;
        this.notifyListeners();
    }
}
export const sessionManager = new SessionManager();
