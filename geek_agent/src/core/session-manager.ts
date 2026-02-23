export type SessionType = 'Master' | 'Fork' | 'Subsession';
export type SessionStatus = 'INIT' | 'ACTIVE' | 'MANAGING' | 'COMPLETED' | 'FAILED' | 'BLOCKED';

export interface Session {
    id: string;
    type: SessionType;
    status: SessionStatus;
    parentId?: string;
    progress: number;
    task: string;
    tokensUsed: number;
    lastHeartbeat: number;
}

export class SessionManager {
    private sessions: Map<string, Session> = new Map();

    constructor() { }

    createSession(type: SessionType, task: string, parentId?: string, id?: string): Session {
        const session: Session = {
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

    updateSession(id: string, updates: Partial<Session>) {
        const session = this.sessions.get(id);
        if (session) {
            Object.assign(session, updates);
            session.lastHeartbeat = Date.now();
        }
    }

    getSessions(): Session[] {
        return Array.from(this.sessions.values());
    }

    getSession(id: string): Session | undefined {
        return this.sessions.get(id);
    }

    getForksForParent(parentId: string): Session[] {
        return this.getSessions().filter(s => s.parentId === parentId && s.type === 'Fork');
    }

    terminateSession(id: string) {
        this.sessions.delete(id);
    }
}
