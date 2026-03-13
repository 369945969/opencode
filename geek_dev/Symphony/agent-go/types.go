package main

// AgentMessage 表示 Agent 会话中的单条消息
type AgentMessage struct {
	ID         string `json:"id,omitempty"`         // 消息唯一 ID（通常来自后端）
	Role       string `json:"role"`                 // 角色: "user" | "assistant" | "system"
	Content    string `json:"content"`              // 消息文本内容
	Thinking   string `json:"thinking,omitempty"`   // 思考过程内容
	IsInternal bool   `json:"isInternal,omitempty"` // 标记是否为系统内部指令
	TS         int64  `json:"ts"`                   // 毫秒级时间戳
	NodeID     int    `json:"node_id,omitempty"`    // 消息关联的策略节点 ID
}

// AgentStatus 表示 Agent 的状态和完整信息
type AgentStatus struct {
	ID         string         `json:"id"`                  // Agent 唯一 ID (UUID)
	ParentID   string         `json:"parent_id,omitempty"` // 父 Agent ID（如果有）
	Status     string         `json:"status"`              // Agent 状态: "idle" | "busy" | "error"
	Project    string         `json:"project"`             // 当前项目名称 (如 "TRIZ")
	Node       int            `json:"node"`                // 当前策略节点 ID
	NodeName   string         `json:"node_name"`           // 当前策略节点名称
	NodeStatus string         `json:"node_status"`         // 当前节点状态: "running" | "completed"
	Messages   []AgentMessage `json:"messages"`            // Agent 消息列表
	CreatedAt  int64          `json:"created_at"`          // 创建时间戳
	UpdatedAt  int64          `json:"updated_at"`          // 最后更新时间戳

	// 迭代分析相关的状态
	PendingDirections []string `json:"pending_directions"`      // 待处理的创新方向列表
	CurrentDirIndex   int      `json:"current_direction_index"` // 当前正在处理的创新方向索引
}

// CreateAgentRequest 创建 Agent 的请求结构
type CreateAgentRequest struct {
	ParentID      string `json:"parent_id,omitempty"`      // 父 Agent ID
	InitialPrompt string `json:"initial_prompt,omitempty"` // 初始 Prompt
}

// OpenCodeEvent 表示从后端接收到的 SSE 事件结构
type OpenCodeEvent struct {
	Type       string                 `json:"type"`                 // 事件类型
	Payload    map[string]interface{} `json:"payload,omitempty"`    // 事件载荷
	Properties map[string]interface{} `json:"properties,omitempty"` // 事件属性
	Delta      string                 `json:"delta,omitempty"`      // 增量文本内容
	AgentID    string                 `json:"agentID,omitempty"`    // Agent ID
	Part       *OpenCodeEventPart     `json:"part,omitempty"`       // 消息分片信息
}

// OpenCodeEventPart 表示事件中的具体分片信息
type OpenCodeEventPart struct {
	Type      string `json:"type"`                // 分片类型: "text" | "reasoning" | "delta"
	Text      string `json:"text,omitempty"`      // 分片文本内容
	MessageID string `json:"messageID,omitempty"` // 消息 ID
	AgentID   string `json:"agentID,omitempty"`   // Agent ID
}

// UpdateEvent 用于前端 SSE 订阅的更新事件
type UpdateEvent struct {
	Type     string       `json:"type"`                // 更新类型: "message" | "status" | "title" | "node_update" | "agent.cloned"
	AgentID  string       `json:"agentId"`             // Agent ID
	Message  AgentMessage `json:"message,omitempty"`   // 消息更新内容
	Status   string       `json:"status,omitempty"`    // 状态更新内容
	Title    string       `json:"title,omitempty"`     // 标题更新内容
	NodeID   int          `json:"node_id,omitempty"`   // 节点 ID
	NodeName string       `json:"node_name,omitempty"` // 节点名称更新内容
	Content  string       `json:"content,omitempty"`   // 节点详细内容
}
