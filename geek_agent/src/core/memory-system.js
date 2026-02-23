export class MemorySystem {
    sensory = [];
    working = [];
    shortTerm = [];
    longTerm = [];
    getTier(tier) {
        switch (tier) {
            case 'sensory': return this.sensory;
            case 'working': return this.working;
            case 'short-term': return this.shortTerm;
            case 'long-term': return this.longTerm;
        }
    }
    setTier(tier, items) {
        switch (tier) {
            case 'sensory':
                this.sensory = items;
                break;
            case 'working':
                this.working = items;
                break;
            case 'short-term':
                this.shortTerm = items;
                break;
            case 'long-term':
                this.longTerm = items;
                break;
        }
    }
    WORKING_MEMORY_LIMIT = 7;
    constructor() { }
    encode(content, tier, tags = [], metadata = {}) {
        const item = {
            id: Math.random().toString(36).substring(2, 11),
            content,
            timestamp: Date.now(),
            tags,
            metadata
        };
        switch (tier) {
            case 'sensory':
                this.sensory.push(item);
                // Sensory memory is very transient
                setTimeout(() => this.forget(item.id, 'sensory'), 1000);
                break;
            case 'working':
                this.working.push(item);
                if (this.working.length > this.WORKING_MEMORY_LIMIT) {
                    const removed = this.working.shift();
                    if (removed)
                        this.consolidate(removed, 'short-term');
                }
                break;
            case 'short-term':
                this.shortTerm.push(item);
                break;
            case 'long-term':
                this.longTerm.push(item);
                break;
        }
        return item;
    }
    forget(id, tier) {
        this.setTier(tier, this.getTier(tier).filter((item) => item.id !== id));
    }
    consolidate(item, toTier) {
        console.log(`Consolidating memory ${item.id} to ${toTier}`);
        this.encode(item.content, toTier, item.tags, item.metadata);
    }
    getMemories(tier) {
        return [...this.getTier(tier)];
    }
    search(query) {
        // Basic similarity placeholder
        const all = [...this.working, ...this.shortTerm, ...this.longTerm];
        return all.filter(item => item.content.toLowerCase().includes(query.toLowerCase()) ||
            item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())));
    }
}
