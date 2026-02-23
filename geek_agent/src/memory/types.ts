export type MemoryTier = "sensory" | "working" | "short-term" | "long-term"
export type LongTermMemoryType = "episodic" | "semantic" | "procedural" | "metacognitive"

export interface MemoryItem {
  id: string
  content: string
  timestamp: number
  tags: string[]
  metadata?: Record<string, unknown>
  tier: MemoryTier
  longTermType?: LongTermMemoryType
  associations?: string[]
  importance?: number
  accessCount?: number
  lastAccessed?: number
}

export interface EpisodicMemory extends MemoryItem {
  longTermType: "episodic"
  projectName?: string
  outcome?: "success" | "failure" | "partial"
  lessonsLearned?: string[]
  stakeholders?: string[]
  duration?: number
}

export interface SemanticMemory extends MemoryItem {
  longTermType: "semantic"
  domain?: string
  concepts?: string[]
  relations?: Array<{ target: string; relation: string }>
  confidence?: number
}

export interface ProceduralMemory extends MemoryItem {
  longTermType: "procedural"
  skillCategory?: string
  steps?: string[]
  prerequisites?: string[]
  outcomes?: string[]
  difficulty?: "beginner" | "intermediate" | "advanced" | "expert"
}

export interface MetacognitiveMemory extends MemoryItem {
  longTermType: "metacognitive"
  selfAssessment?: string
  abilityBounds?: {
    strengths: string[]
    weaknesses: string[]
    maxParallelForks: number
    preferredComplexity: string
  }
  learningInsights?: string[]
  improvementGoals?: string[]
}

export type LongTermMemory = EpisodicMemory | SemanticMemory | ProceduralMemory | MetacognitiveMemory

export interface MemoryStats {
  sensory: number
  working: number
  workingCapacity: number
  shortTerm: number
  longTerm: {
    total: number
    episodic: number
    semantic: number
    procedural: number
    metacognitive: number
  }
  consolidationQueue: number
}

export interface MemoryHealth {
  status: "healthy" | "warning" | "critical"
  workingLoadPercent: number
  consolidationBacklog: number
  oldestPendingItem?: number
  recommendations: string[]
}
