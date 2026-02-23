export class MessageBus {
    subscribers = new Map();
    allHandlers = new Set();
    sessionHandlers = new Map();
    subscribe(type, handler) {
        if (!this.subscribers.has(type)) {
            this.subscribers.set(type, new Set());
        }
        this.subscribers.get(type).add(handler);
        return () => this.subscribers.get(type)?.delete(handler);
    }
    subscribeAll(handler) {
        this.allHandlers.add(handler);
        return () => this.allHandlers.delete(handler);
    }
    subscribeToSession(sessionId, handler) {
        if (!this.sessionHandlers.has(sessionId)) {
            this.sessionHandlers.set(sessionId, new Set());
        }
        this.sessionHandlers.get(sessionId).add(handler);
        return () => this.sessionHandlers.get(sessionId)?.delete(handler);
    }
    publish(message) {
        const typeHandlers = this.subscribers.get(message.type);
        if (typeHandlers) {
            typeHandlers.forEach((handler) => handler(message));
        }
        this.allHandlers.forEach((handler) => handler(message));
        const sessionHandlers = this.sessionHandlers.get(message.sessionId);
        if (sessionHandlers) {
            sessionHandlers.forEach((handler) => handler(message));
        }
    }
    sendToSession(sessionId, type, payload) {
        const message = {
            id: this.generateId(),
            type,
            sessionId,
            timestamp: Date.now(),
            payload,
        };
        this.publish(message);
    }
    sendStatusReport(sessionId, status, details) {
        this.sendToSession(sessionId, "status_report", { status, details });
    }
    sendProgress(sessionId, progress, task) {
        this.sendToSession(sessionId, "progress", { progress, task });
    }
    sendCompleted(sessionId, result, summary) {
        this.sendToSession(sessionId, "completed", { result, summary });
    }
    sendFailed(sessionId, error, reason) {
        this.sendToSession(sessionId, "failed", { error, reason });
    }
    sendBlocked(sessionId, reason, waitingOn) {
        this.sendToSession(sessionId, "blocked", { reason, waitingOn });
    }
    sendCollaborationRequest(sessionId, targetSessionId, requestType, data) {
        this.sendToSession(sessionId, "collaboration_request", { targetSessionId, requestType, data });
    }
    sendHeartbeat(sessionId) {
        this.sendToSession(sessionId, "heartbeat", { alive: true });
    }
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
}
export const messageBus = new MessageBus();
