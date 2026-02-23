export type ResourceType = "token" | "memory" | "session" | "fork" | "subsession"
export type TaskComplexity = "trivial" | "simple" | "medium" | "complex" | "very-complex"
export type Priority = "critical" | "high" | "normal" | "low"
export type SessionStrategy = "Fork" | "Subsession" | "NEW" | "Master"

export interface ResourceLimits {
  maxTokens: number
  maxForks: number
  maxSubsessions: number
  maxMemoryMB: number
}

export interface ResourceUsage {
  tokensUsed: number
  forksActive: number
  subsessionsActive: number
  memoryUsedMB: number
}

export interface ResourceAllocation {
  sessionId: string
  tokens: number
  forks: number
  subsessions: number
}

export interface SchedulingDecision {
  action: "allocate" | "wait" | "queue" | "reject"
  reason: string
  resources: ResourceAllocation
  estimatedDuration?: number
}

export interface Task {
  id: string
  description: string
  complexity: TaskComplexity
  priority: Priority
  estimatedTokens?: number
  estimatedDuration?: number
  canParallelize?: boolean
}

export const DEFAULT_LIMITS: ResourceLimits = {
  maxTokens: 16000,
  maxForks: 5,
  maxSubsessions: 10,
  maxMemoryMB: 512,
}

export const COMPLEXITY_FORK_MAP: Record<TaskComplexity, number> = {
  trivial: 1,
  simple: 1,
  medium: 2,
  complex: 3,
  "very-complex": 5,
}

export const COMPLEXITY_TOKEN_ESTIMATE: Record<TaskComplexity, number> = {
  trivial: 1000,
  simple: 2000,
  medium: 4000,
  complex: 8000,
  "very-complex": 14000,
}
