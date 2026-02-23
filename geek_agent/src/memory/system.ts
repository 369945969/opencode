import type { MemoryItem, MemoryTier, LongTermMemoryType, LongTermMemory, MemoryStats, MemoryHealth } from "./types"

const WORKING_MEMORY_CAPACITY = 7

export class MemorySystem {
  private sensory: Map<string, MemoryItem> = new Map()
  private working: Map<string, MemoryItem> = new Map()
  private shortTerm: Map<string, MemoryItem> = new Map()
  private longTerm: Map<string, LongTermMemory> = new Map()
  private consolidationQueue: MemoryItem[] = []
  private listeners: Set<(stats: MemoryStats) => void> = new Set()

  constructor() {}

  addToSensory(content: string, tags: string[] = []): MemoryItem {
    const item: MemoryItem = {
      id: `sensory-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      content,
      timestamp: Date.now(),
      tags,
      tier: "sensory",
    }
    this.sensory.set(item.id, item)
    this.promoteToWorking(item)
    this.notifyListeners()
    return item
  }

  private promoteToWorking(item: MemoryItem): void {
    if (this.working.size >= WORKING_MEMORY_CAPACITY) {
      const oldest = this.working.values().next().value
      if (oldest) {
        this.working.delete(oldest.id)
        this.consolidateToShortTerm(oldest)
      }
    }
    const workingItem = { ...item, tier: "working" as MemoryTier }
    this.working.set(workingItem.id, workingItem)
    this.sensory.delete(item.id)
  }

  private consolidateToShortTerm(item: MemoryItem): void {
    const stItem = { ...item, tier: "short-term" as MemoryTier }
    this.shortTerm.set(stItem.id, stItem)
  }

  consolidateToLongTerm(itemId: string, type: LongTermMemoryType): LongTermMemory | null {
    const stItem = this.shortTerm.get(itemId)
    if (!stItem) return null

    const ltItem: LongTermMemory = {
      ...stItem,
      tier: "long-term",
      longTermType: type,
    } as LongTermMemory

    this.longTerm.set(ltItem.id, ltItem)
    this.shortTerm.delete(itemId)
    this.notifyListeners()
    return ltItem
  }

  addToWorking(content: string, tags: string[], metadata?: Record<string, unknown>): MemoryItem {
    if (this.working.size >= WORKING_MEMORY_CAPACITY) {
      const oldest = this.working.values().next().value
      if (oldest) {
        this.working.delete(oldest.id)
        this.consolidateToShortTerm(oldest)
      }
    }

    const item: MemoryItem = {
      id: `working-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      content,
      timestamp: Date.now(),
      tags,
      metadata,
      tier: "working",
    }
    this.working.set(item.id, item)
    this.notifyListeners()
    return item
  }

  searchByContent(query: string): MemoryItem[] {
    const results: MemoryItem[] = []
    const lowerQuery = query.toLowerCase()

    const searchIn = (items: Map<string, MemoryItem | LongTermMemory>) => {
      items.forEach((item) => {
        if (item.content.toLowerCase().includes(lowerQuery)) {
          results.push(item as MemoryItem)
        }
      })
    }

    searchIn(this.working)
    searchIn(this.shortTerm)
    searchIn(this.longTerm)

    return results
  }

  searchByTags(tags: string[]): MemoryItem[] {
    const results: MemoryItem[] = []

    const searchIn = (items: Map<string, MemoryItem | LongTermMemory>) => {
      items.forEach((item) => {
        if (tags.some((tag) => item.tags.includes(tag))) {
          results.push(item as MemoryItem)
        }
      })
    }

    searchIn(this.working)
    searchIn(this.shortTerm)
    searchIn(this.longTerm)

    return results
  }

  searchByAssociation(associationId: string): MemoryItem[] {
    const results: MemoryItem[] = []

    this.longTerm.forEach((item) => {
      if (item.associations?.includes(associationId)) {
        results.push(item as MemoryItem)
      }
    })

    return results
  }

  retrieveRelated(itemId: string): MemoryItem[] {
    const item = this.longTerm.get(itemId)
    if (!item?.associations) return []

    return item.associations
      .map((assocId) => this.longTerm.get(assocId))
      .filter(Boolean)
      .map((i) => i as MemoryItem)
  }

  getStats(): MemoryStats {
    const longTermByType = {
      episodic: 0,
      semantic: 0,
      procedural: 0,
      metacognitive: 0,
    }

    this.longTerm.forEach((item) => {
      if (item.longTermType) {
        longTermByType[item.longTermType]++
      }
    })

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
    }
  }

  getHealth(): MemoryHealth {
    const workingLoadPercent = (this.working.size / WORKING_MEMORY_CAPACITY) * 100
    const recommendations: string[] = []

    if (workingLoadPercent >= 90) {
      recommendations.push("Working memory nearly full - consider consolidating items")
    }

    if (this.consolidationQueue.length > 10) {
      recommendations.push("High consolidation backlog - process pending items")
    }

    let status: "healthy" | "warning" | "critical" = "healthy"
    if (workingLoadPercent >= 90 || this.consolidationQueue.length > 10) {
      status = "warning"
    }
    if (workingLoadPercent >= 100) {
      status = "critical"
    }

    return {
      status,
      workingLoadPercent,
      consolidationBacklog: this.consolidationQueue.length,
      recommendations,
    }
  }

  forget(itemId: string, tier: MemoryTier): boolean {
    switch (tier) {
      case "sensory":
        return this.sensory.delete(itemId)
      case "working":
        return this.working.delete(itemId)
      case "short-term":
        return this.shortTerm.delete(itemId)
      case "long-term":
        return this.longTerm.delete(itemId)
      default:
        return false
    }
  }

  subscribe(listener: (stats: MemoryStats) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notifyListeners(): void {
    const stats = this.getStats()
    this.listeners.forEach((listener) => listener(stats))
  }
}

export const memorySystem = new MemorySystem()
