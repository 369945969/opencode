const WORKING_MEMORY_CAPACITY = 7;
export class MemorySystem {
    sensory = new Map();
    working = new Map();
    shortTerm = new Map();
    longTerm = new Map();
    consolidationQueue = [];
    listeners = new Set();
    constructor() { }
    addToSensory(content, tags = []) {
        const item = {
            id: `sensory-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            content,
            timestamp: Date.now(),
            tags,
            tier: "sensory",
        };
        this.sensory.set(item.id, item);
        this.promoteToWorking(item);
        this.notifyListeners();
        return item;
    }
    promoteToWorking(item) {
        if (this.working.size >= WORKING_MEMORY_CAPACITY) {
            const oldest = this.working.values().next().value;
            if (oldest) {
                this.working.delete(oldest.id);
                this.consolidateToShortTerm(oldest);
            }
        }
        const workingItem = { ...item, tier: "working" };
        this.working.set(workingItem.id, workingItem);
        this.sensory.delete(item.id);
    }
    consolidateToShortTerm(item) {
        const stItem = { ...item, tier: "short-term" };
        this.shortTerm.set(stItem.id, stItem);
    }
    consolidateToLongTerm(itemId, type) {
        const stItem = this.shortTerm.get(itemId);
        if (!stItem)
            return null;
        const ltItem = {
            ...stItem,
            tier: "long-term",
            longTermType: type,
        };
        this.longTerm.set(ltItem.id, ltItem);
        this.shortTerm.delete(itemId);
        this.notifyListeners();
        return ltItem;
    }
    addToWorking(content, tags, metadata) {
        if (this.working.size >= WORKING_MEMORY_CAPACITY) {
            const oldest = this.working.values().next().value;
            if (oldest) {
                this.working.delete(oldest.id);
                this.consolidateToShortTerm(oldest);
            }
        }
        const item = {
            id: `working-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            content,
            timestamp: Date.now(),
            tags,
            metadata,
            tier: "working",
        };
        this.working.set(item.id, item);
        this.notifyListeners();
        return item;
    }
    searchByContent(query) {
        const results = [];
        const lowerQuery = query.toLowerCase();
        const searchIn = (items) => {
            items.forEach((item) => {
                if (item.content.toLowerCase().includes(lowerQuery)) {
                    results.push(item);
                }
            });
        };
        searchIn(this.working);
        searchIn(this.shortTerm);
        searchIn(this.longTerm);
        return results;
    }
    searchByTags(tags) {
        const results = [];
        const searchIn = (items) => {
            items.forEach((item) => {
                if (tags.some((tag) => item.tags.includes(tag))) {
                    results.push(item);
                }
            });
        };
        searchIn(this.working);
        searchIn(this.shortTerm);
        searchIn(this.longTerm);
        return results;
    }
    searchByAssociation(associationId) {
        const results = [];
        this.longTerm.forEach((item) => {
            if (item.associations?.includes(associationId)) {
                results.push(item);
            }
        });
        return results;
    }
    retrieveRelated(itemId) {
        const item = this.longTerm.get(itemId);
        if (!item?.associations)
            return [];
        return item.associations
            .map((assocId) => this.longTerm.get(assocId))
            .filter(Boolean)
            .map((i) => i);
    }
    getStats() {
        const longTermByType = {
            episodic: 0,
            semantic: 0,
            procedural: 0,
            metacognitive: 0,
        };
        this.longTerm.forEach((item) => {
            if (item.longTermType) {
                longTermByType[item.longTermType]++;
            }
        });
        return {
            sensory: this.sensory.size,
            working: this.working.size,
            workingCapacity: WORKING_MEMORY_CAPACITY,
            shortTerm: this.shortTerm.size,
            longTerm: {
                total: this.longTerm.size,
                ...longTermByType,
            },
            consolidationQueue: this.consolidationQueue.length,
        };
    }
    getHealth() {
        const workingLoadPercent = (this.working.size / WORKING_MEMORY_CAPACITY) * 100;
        const recommendations = [];
        if (workingLoadPercent >= 90) {
            recommendations.push("Working memory nearly full - consider consolidating items");
        }
        if (this.consolidationQueue.length > 10) {
            recommendations.push("High consolidation backlog - process pending items");
        }
        let status = "healthy";
        if (workingLoadPercent >= 90 || this.consolidationQueue.length > 10) {
            status = "warning";
        }
        if (workingLoadPercent >= 100) {
            status = "critical";
        }
        return {
            status,
            workingLoadPercent,
            consolidationBacklog: this.consolidationQueue.length,
            recommendations,
        };
    }
    forget(itemId, tier) {
        switch (tier) {
            case "sensory":
                return this.sensory.delete(itemId);
            case "working":
                return this.working.delete(itemId);
            case "short-term":
                return this.shortTerm.delete(itemId);
            case "long-term":
                return this.longTerm.delete(itemId);
            default:
                return false;
        }
    }
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
    notifyListeners() {
        const stats = this.getStats();
        this.listeners.forEach((listener) => listener(stats));
    }
}
export const memorySystem = new MemorySystem();
