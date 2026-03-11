export interface SessionMessage {
  id?: string; // 消息唯一 ID（通常来自后端）
  role: "user" | "assistant" | "system";
  content: string;
  thinking?: string;
  isInternal?: boolean; // 标记是否为系统内部指令
  ts: number;
}

export interface SessionStatus {
  id: string;
  parent_id?: string;
  status: "idle" | "busy" | "error";
  messages: SessionMessage[];
  created_at: number;
  updated_at: number;
}

export interface CreateSessionRequest {
  parent_id?: string;
  initial_prompt?: string;
}

export interface OpenCodeEvent {
  type: string;
  payload?: any;
  properties?: any;
  delta?: string;
  sessionID?: string;
  part?: {
    type: string;
    text?: string;
    messageID?: string;
    sessionID?: string;
  };
}
