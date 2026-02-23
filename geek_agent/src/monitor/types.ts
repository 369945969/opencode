export type HealthStatus = "healthy" | "degraded" | "unhealthy"
export type AlertLevel = "info" | "warning" | "critical"

export interface SystemMetrics {
  timestamp: number
  cpu: number
  memory: number
  sessions: number
  forks: number
  subsessions: number
  tokenUsage: number
  tokenLimit: number
}

export interface AlertConfig {
  level: AlertLevel
  message: string
  timestamp: number
  source: string
  metadata?: Record<string, unknown>
}

export interface HealthCheck {
  status: HealthStatus
  checks: {
    sessions: { status: HealthStatus; message: string }
    memory: { status: HealthStatus; message: string }
    resources: { status: HealthStatus; message: string }
  }
  uptime: number
  lastCheck: number
}
