import { DEFAULT_LIMITS, COMPLEXITY_FORK_MAP, COMPLEXITY_TOKEN_ESTIMATE } from "./types";
export class ResourceScheduler {
    limits;
    allocated = new Map();
    queue = [];
    listeners = new Set();
    constructor(limits = {}) {
        this.limits = { ...DEFAULT_LIMITS, ...limits };
    }
    getCurrentUsage() {
        let totalTokens = 0;
        let totalForks = 0;
        let totalSubsessions = 0;
        this.allocated.forEach((alloc) => {
            totalTokens += alloc.tokens;
            totalForks += alloc.forks;
            totalSubsessions += alloc.subsessions;
        });
        return {
            tokensUsed: totalTokens,
            forksActive: totalForks,
            subsessionsActive: totalSubsessions,
            memoryUsedMB: Math.floor(totalTokens / 100),
        };
    }
    canAllocate(tokens, forks = 0, subsessions = 0) {
        const usage = this.getCurrentUsage();
        return (usage.tokensUsed + tokens <= this.limits.maxTokens &&
            usage.forksActive + forks <= this.limits.maxForks &&
            usage.subsessionsActive + subsessions <= this.limits.maxSubsessions);
    }
    allocate(sessionId, tokens, forks = 0, subsessions = 0) {
        if (!this.canAllocate(tokens, forks, subsessions)) {
            return false;
        }
        this.allocated.set(sessionId, {
            sessionId,
            tokens,
            forks,
            subsessions,
        });
        this.notifyListeners();
        return true;
    }
    release(sessionId) {
        const result = this.allocated.delete(sessionId);
        if (result) {
            this.notifyListeners();
            this.processQueue();
        }
        return result;
    }
    getStressLevel() {
        const usage = this.getCurrentUsage();
        const tokenStress = (usage.tokensUsed / this.limits.maxTokens) * 50;
        const forkStress = (usage.forksActive / this.limits.maxForks) * 30;
        const subStress = (usage.subsessionsActive / this.limits.maxSubsessions) * 20;
        return Math.min(100, Math.floor(tokenStress + forkStress + subStress));
    }
    decideParallelization(complexity) {
        const availableForks = this.limits.maxForks - this.getCurrentUsage().forksActive;
        const recommended = COMPLEXITY_FORK_MAP[complexity];
        return Math.min(recommended, Math.max(1, availableForks));
    }
    recommendStrategy(task) {
        if (task.complexity === "trivial" || task.complexity === "simple") {
            return "NEW";
        }
        if (task.canParallelize && this.decideParallelization(task.complexity) > 1) {
            return "Fork";
        }
        if (task.complexity === "very-complex") {
            return "Fork";
        }
        return "Subsession";
    }
    getRecommendedForkCount(complexity) {
        return COMPLEXITY_FORK_MAP[complexity];
    }
    estimateTokens(complexity) {
        return COMPLEXITY_TOKEN_ESTIMATE[complexity];
    }
    schedule(task) {
        const estimatedTokens = task.estimatedTokens || this.estimateTokens(task.complexity);
        const estimatedForks = task.canParallelize ? this.decideParallelization(task.complexity) : 0;
        if (this.canAllocate(estimatedTokens, estimatedForks)) {
            return {
                action: "allocate",
                reason: "Resources available",
                resources: {
                    sessionId: task.id,
                    tokens: estimatedTokens,
                    forks: estimatedForks,
                    subsessions: 0,
                },
                estimatedDuration: task.estimatedDuration,
            };
        }
        if (task.priority === "critical" || task.priority === "high") {
            return {
                action: "queue",
                reason: "High priority task queued",
                resources: {
                    sessionId: task.id,
                    tokens: estimatedTokens,
                    forks: estimatedForks,
                    subsessions: 0,
                },
            };
        }
        return {
            action: "reject",
            reason: "Insufficient resources",
            resources: {
                sessionId: task.id,
                tokens: estimatedTokens,
                forks: estimatedForks,
                subsessions: 0,
            },
        };
    }
    processQueue() {
        if (this.queue.length === 0)
            return;
        const nextTask = this.queue.shift();
        if (nextTask) {
            this.schedule(nextTask);
        }
    }
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
    notifyListeners() {
        const usage = this.getCurrentUsage();
        this.listeners.forEach((listener) => listener(usage));
    }
}
export const resourceScheduler = new ResourceScheduler();
