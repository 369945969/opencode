export class SessionManager {
    sessions = new Map();
    constructor() { }
    createSession(type, task, parentId, id) {
        const session = {
            id: id || `${type.toLowerCase()}-${Math.random().toString(36).substring(2, 7)}`,
            type,
            status: 'INIT',
            parentId,
            progress: 0,
            task,
            tokensUsed: 0,
            lastHeartbeat: Date.now()
        };
        // Auto-activate for now
        session.status = 'ACTIVE';
        this.sessions.set(session.id, session);
        return session;
    }
    updateSession(id, updates) {
        const session = this.sessions.get(id);
        if (session) {
            Object.assign(session, updates);
            session.lastHeartbeat = Date.now();
        }
    }
    getSessions() {
        return Array.from(this.sessions.values());
    }
    getSession(id) {
        return this.sessions.get(id);
    }
    getForksForParent(parentId) {
        return this.getSessions().filter(s => s.parentId === parentId && s.type === 'Fork');
    }
    terminateSession(id) {
        this.sessions.delete(id);
    }
}
