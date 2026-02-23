export interface ApiConfig {
  baseUrl: string
  username: string
  password: string
  defaultProviderId: string
  defaultModelId: string
  timeout: number
}

export const defaultConfig: ApiConfig = {
  baseUrl: import.meta.env.VITE_OPENCODE_BASE_URL ?? "http://127.0.0.1:2345",
  username: import.meta.env.VITE_OPENCODE_USERNAME ?? "opencode",
  password: import.meta.env.VITE_OPENCODE_PASSWORD ?? "123",
  defaultProviderId: import.meta.env.VITE_OPENCODE_PROVIDER_ID ?? "geek_code",
  defaultModelId: import.meta.env.VITE_OPENCODE_MODEL_ID ?? "agent",
  timeout: 600000,
}

export const createAuthHeader = (username: string, password: string): string => {
  if (!username || !password) return ""
  return `Basic ${btoa(`${username}:${password}`)}`
}
