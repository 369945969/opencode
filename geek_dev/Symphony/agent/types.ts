export interface SessionMessage {
  role: "user" | "assistant" | "system";
  content: string;
  thinking?: string;
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
