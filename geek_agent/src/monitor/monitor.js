export class SystemMonitor {
    metricsHistory = [];
    alerts = [];
    startTime;
    maxHistoryLength = 100;
    listeners = new Set();
    constructor() {
        this.startTime = Date.now();
        this.startMonitoring();
    }
    startMonitoring() {
        setInterval(() => {
            this.collectMetrics();
        }, 5000);
    }
    collectMetrics() {
        const metrics = {
            timestamp: Date.now(),
            cpu: Math.random() * 30 + 10,
            memory: Math.random() * 40 + 30,
            sessions: 0,
            forks: 0,
            subsessions: 0,
            tokenUsage: 0,
            tokenLimit: 16000,
        };
        this.metricsHistory.push(metrics);
        if (this.metricsHistory.length > this.maxHistoryLength) {
            this.metricsHistory.shift();
        }
        this.notifyListeners(metrics);
        return metrics;
    }
    getLatestMetrics() {
        return this.metricsHistory[this.metricsHistory.length - 1] || null;
    }
    getMetricsHistory(count = 10) {
        return this.metricsHistory.slice(-count);
    }
    addAlert(level, source, message, metadata) {
        const alert = {
            level,
            source,
            message,
            timestamp: Date.now(),
            metadata,
        };
        this.alerts.push(alert);
        if (this.alerts.length > 50) {
            this.alerts.shift();
        }
    }
    getAlerts(level) {
        if (!level)
            return [...this.alerts];
        return this.alerts.filter((a) => a.level === level);
    }
    clearAlerts() {
        this.alerts = [];
    }
    checkHealth() {
        const latest = this.getLatestMetrics();
        const checks = {
            sessions: this.checkSessions(),
            memory: this.checkMemory(),
            resources: this.checkResources(),
        };
        const statuses = Object.values(checks).map((c) => c.status);
        let status = 'healthy';
        if (statuses.includes('unhealthy')) {
            status = 'unhealthy';
        }
        else if (statuses.includes('degraded')) {
            status = 'degraded';
        }
        return {
            status,
            checks,
            uptime: Date.now() - this.startTime,
            lastCheck: Date.now(),
        };
    }
    checkSessions() {
        const latest = this.getLatestMetrics();
        if (!latest)
            return { status: 'healthy', message: 'No data' };
        if (latest.sessions > 20) {
            return { status: 'unhealthy', message: 'Too many sessions' };
        }
        if (latest.sessions > 10) {
            return { status: 'degraded', message: 'High session count' };
        }
        return { status: 'healthy', message: `${latest.sessions} active` };
    }
    checkMemory() {
        const latest = this.getLatestMetrics();
        if (!latest)
            return { status: 'healthy', message: 'No data' };
        if (latest.memory > 90) {
            return { status: 'unhealthy', message: 'Critical memory usage' };
        }
        if (latest.memory > 70) {
            return { status: 'degraded', message: 'High memory usage' };
        }
        return { status: 'healthy', message: `${Math.round(latest.memory)}% used` };
    }
    checkResources() {
        const latest = this.getLatestMetrics();
        if (!latest)
            return { status: 'healthy', message: 'No data' };
        const usagePercent = (latest.tokenUsage / latest.tokenLimit) * 100;
        if (usagePercent > 95) {
            return { status: 'unhealthy', message: 'Token limit reached' };
        }
        if (usagePercent > 80) {
            return { status: 'degraded', message: 'High token usage' };
        }
        return { status: 'healthy', message: `${Math.round(usagePercent)}% used` };
    }
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
    notifyListeners(metrics) {
        this.listeners.forEach((listener) => listener(metrics));
    }
}
export const systemMonitor = new SystemMonitor();
