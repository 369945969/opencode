export type MemoryTier = 'sensory' | 'working' | 'short-term' | 'long-term';

export interface MemoryItem {
    id: string;
    content: string;
    timestamp: number;
    tags: string[];
    metadata?: any;
}

export class MemorySystem {
    private sensory: MemoryItem[] = [];
    private working: MemoryItem[] = [];
    private shortTerm: MemoryItem[] = [];
    private longTerm: MemoryItem[] = [];

    private getTier(tier: MemoryTier): MemoryItem[] {
        switch (tier) {
            case 'sensory': return this.sensory;
            case 'working': return this.working;
            case 'short-term': return this.shortTerm;
            case 'long-term': return this.longTerm;
        }
    }

    private setTier(tier: MemoryTier, items: MemoryItem[]) {
        switch (tier) {
            case 'sensory': this.sensory = items; break;
            case 'working': this.working = items; break;
            case 'short-term': this.shortTerm = items; break;
            case 'long-term': this.longTerm = items; break;
        }
    }

    private readonly WORKING_MEMORY_LIMIT = 7;

    constructor() { }

    encode(content: string, tier: MemoryTier, tags: string[] = [], metadata: any = {}): MemoryItem {
        const item: MemoryItem = {
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
                    if (removed) this.consolidate(removed, 'short-term');
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

    private forget(id: string, tier: MemoryTier) {
        this.setTier(tier, this.getTier(tier).filter((item: MemoryItem) => item.id !== id));
    }

    private consolidate(item: MemoryItem, toTier: MemoryTier) {
        console.log(`Consolidating memory ${item.id} to ${toTier}`);
        this.encode(item.content, toTier, item.tags, item.metadata);
    }

    getMemories(tier: MemoryTier): MemoryItem[] {
        return [...this.getTier(tier)];
    }

    search(query: string): MemoryItem[] {
        // Basic similarity placeholder
        const all = [...this.working, ...this.shortTerm, ...this.longTerm];
        return all.filter(item =>
            item.content.toLowerCase().includes(query.toLowerCase()) ||
            item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
    }
}
