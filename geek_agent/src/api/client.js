import { defaultConfig, createAuthHeader } from "./config";
export class OpenCodeClient {
    config;
    authHeader;
    eventSource = null;
    eventListeners = new Map();
    reconnectAttempts = 0;
    maxReconnectAttempts = 10;
    reconnectDelay = 2000;
    connected = false;
    constructor(config = {}) {
        this.config = { ...defaultConfig, ...config };
        this.authHeader = createAuthHeader(this.config.username, this.config.password);
    }
    getHeaders() {
        const headers = {
            "Content-Type": "application/json",
        };
        if (this.authHeader) {
            headers["Authorization"] = this.authHeader;
        }
        return headers;
    }
    async request(path, options = {}) {
        const url = `${this.config.baseUrl}${path}`;
        const response = await fetch(url, {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers,
            },
        });
        if (!response.ok) {
            const errorText = await response.text().catch(() => "");
            throw new Error(`API Error ${response.status}: ${errorText}`);
        }
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
            return response.json();
        }
        return response.text();
    }
    async createSession(options) {
        const body = {
            title: options.title,
            permission: options.permissions || [
                { permission: "edit", pattern: "*", action: "allow" },
                { permission: "bash", pattern: "*", action: "allow" },
                { permission: "read", pattern: "*", action: "allow" },
            ],
            systemPrompt: options.systemPrompt,
        };
        const data = await this.request("/session", {
            method: "POST",
            body: JSON.stringify(body),
        });
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
        };
    }
    async createFork(parentId, options) {
        return this.createSession({
            type: "Fork",
            title: options.taskAssignment.description,
            parentId,
            permissions: undefined,
        });
    }
    async createSubsession(parentId, options) {
        return this.createSession({
            type: "Subsession",
            title: options.researchTopic || "Subsession Task",
            parentId,
            permissions: undefined,
        });
    }
    async getSession(sessionId) {
        return this.request(`/session/${sessionId}`);
    }
    async ping() {
        await this.request("/doc");
    }
    async terminateSession(sessionId) {
        await this.request(`/session/${sessionId}`, { method: "DELETE" });
    }
    async sendPrompt(sessionId, request) {
        const body = {
            ...request,
            model: request.model || {
                providerID: this.config.defaultProviderId,
                modelID: this.config.defaultModelId,
            },
        };
        const url = `${this.config.baseUrl}/session/${sessionId}/prompt_async`;
        return fetch(url, {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify(body),
        });
    }
    async abortSession(sessionId) {
        await this.request(`/session/${sessionId}/abort`, { method: "POST" });
    }
    connectEvents() {
        if (this.eventSource) {
            this.eventSource.close();
        }
        const url = new URL("/event", this.config.baseUrl);
        this.eventSource = new EventSource(url.toString());
        this.eventSource.onopen = () => {
            this.connected = true;
            this.reconnectAttempts = 0;
            this.emit("connection", { type: "proxy.status", connected: true });
        };
        this.eventSource.onerror = () => {
            this.connected = false;
            this.emit("connection", { type: "proxy.status", connected: false });
            this.scheduleReconnect();
        };
        this.eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.emit(data.type || "unknown", data);
                this.emit("*", data);
            }
            catch {
                // Ignore parse errors
            }
        };
    }
    disconnectEvents() {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
            this.connected = false;
        }
    }
    scheduleReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts)
            return;
        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1);
        setTimeout(() => {
            this.connectEvents();
        }, delay);
    }
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, new Set());
        }
        this.eventListeners.get(event).add(callback);
        return () => {
            this.eventListeners.get(event)?.delete(callback);
        };
    }
    emit(event, data) {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.forEach((callback) => callback(data));
        }
    }
    isConnected() {
        return this.connected;
    }
    getConfig() {
        return { ...this.config };
    }
}
export const createClient = (config) => {
    return new OpenCodeClient(config);
};
