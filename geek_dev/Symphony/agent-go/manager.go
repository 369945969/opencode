package main

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/r3labs/sse/v2"
	_ "modernc.org/sqlite"
)

// PubSub 简单的发布订阅模式实现，用于处理 Agent 更新的广播
type PubSub struct {
	mu          sync.RWMutex
	subscribers map[string][]chan UpdateEvent
}

// NewPubSub 创建一个新的 PubSub 实例
func NewPubSub() *PubSub {
	return &PubSub{
		subscribers: make(map[string][]chan UpdateEvent),
	}
}

// Subscribe 订阅指定事件，返回一个接收事件的通道
func (ps *PubSub) Subscribe(event string) chan UpdateEvent {
	ps.mu.Lock()
	defer ps.mu.Unlock()
	ch := make(chan UpdateEvent, 10)
	ps.subscribers[event] = append(ps.subscribers[event], ch)
	return ch
}

// Unsubscribe 取消订阅指定事件，并关闭对应的通道
func (ps *PubSub) Unsubscribe(event string, ch chan UpdateEvent) {
	ps.mu.Lock()
	defer ps.mu.Unlock()
	subs := ps.subscribers[event]
	for i, sub := range subs {
		if sub == ch {
			ps.subscribers[event] = append(subs[:i], subs[i+1:]...)
			close(ch)
			break
		}
	}
}

// Emit 向所有订阅了指定事件的客户端推送数据
func (ps *PubSub) Emit(event string, data UpdateEvent) {
	ps.mu.RLock()
	defer ps.mu.RUnlock()

	count := len(ps.subscribers[event])
	log.Printf("📢 [PubSub] 事件: %s, 订阅数: %d, 类型: %s, Agent: %s",
		event, count, data.Type, data.AgentID[len(data.AgentID)-6:])

	for _, ch := range ps.subscribers[event] {
		select {
		case ch <- data:
		default:
			log.Printf("⚠️ [PubSub] 订阅者通道已满，跳过事件: %s", event)
		}
	}
}

// emitUpdate 同时向特定 Agent 和全局频道推送更新
func (m *SymphonyManager) emitUpdate(agentID string, event UpdateEvent) {
	m.pubsub.Emit("update:"+agentID, event)

	// 如果是关键结构性事件，增加一点延迟确保前端全局监听已就绪
	if event.Type == "node_update" || event.Type == "agent.cloned" {
		go func(e UpdateEvent) {
			time.Sleep(100 * time.Millisecond)
			m.pubsub.Emit("all_updates", e)
		}(event)
	} else {
		m.pubsub.Emit("all_updates", event)
	}
}

// SymphonyManager 核心管理器，负责 Agent 维护、数据库持久化以及与后端通信
type SymphonyManager struct {
	agents       map[string]*AgentStatus // 内存中的 Agent 映射表
	mu           sync.RWMutex            // 保护 agents 映射的读写锁
	config       *Config                 // 全局配置对象
	sseConnected bool                    // SSE 连接状态标记
	db           *sql.DB                 // SQLite 数据库连接
	pubsub       *PubSub                 // 事件发布订阅系统
	strategy     *StrategyManager        // 策略编排管理器
}

// NewSymphonyManager 创建并初始化 SymphonyManager
func NewSymphonyManager(cfg *Config) *SymphonyManager {
	m := &SymphonyManager{
		agents:   make(map[string]*AgentStatus),
		config:   cfg,
		pubsub:   NewPubSub(),
		strategy: NewStrategyManager(),
	}

	var err error
	m.db, err = sql.Open("sqlite", cfg.Database.File)
	if err != nil {
		log.Fatalf("无法打开数据库文件 %s: %v", cfg.Database.File, err)
	}

	m.initDb()
	m.loadAgentsFromDb()

	// 启动后台协程维持全局 SSE 连接
	go m.startGlobalSSE()

	return m
}

// getAuthHeader 生成 Basic Auth 认证头
func (m *SymphonyManager) getAuthHeader() string {
	auth := base64.StdEncoding.EncodeToString([]byte(m.config.Engines.OpenCode.Username + ":" + m.config.Engines.OpenCode.Password))
	return "Basic " + auth
}

// initDb 初始化数据库表结构
func (m *SymphonyManager) initDb() {
	_, err := m.db.Exec(`
		CREATE TABLE IF NOT EXISTS agents (
			id TEXT PRIMARY KEY,
			parent_id TEXT,
			status TEXT,
			project TEXT,
			node INTEGER,
			node_name TEXT,
			node_status TEXT,
			pending_directions TEXT,
			current_direction_index INTEGER,
			created_at INTEGER,
			updated_at INTEGER
		)
	`)
	if err != nil {
		log.Fatalf("初始化 agents 表失败: %v", err)
	}
	_, err = m.db.Exec(`
		CREATE TABLE IF NOT EXISTS messages (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			message_id TEXT,
			agent_id TEXT,
			role TEXT,
			content TEXT,
			thinking TEXT,
			is_internal INTEGER,
			ts INTEGER,
			FOREIGN KEY(agent_id) REFERENCES agents(id)
		)
	`)
	if err != nil {
		log.Fatalf("初始化 messages 表失败: %v", err)
	}
}

// loadAgentsFromDb 从数据库加载所有历史 Agent 到内存
func (m *SymphonyManager) loadAgentsFromDb() {
	rows, err := m.db.Query("SELECT id, parent_id, status, project, node, node_name, node_status, pending_directions, current_direction_index, created_at, updated_at FROM agents")
	if err != nil {
		log.Printf("加载 Agent 记录失败: %v", err)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var a AgentStatus
		var parentID sql.NullString
		var project sql.NullString
		var nodeName sql.NullString
		var nodeStatus sql.NullString
		var pendingDirs sql.NullString
		err := rows.Scan(&a.ID, &parentID, &a.Status, &project, &a.Node, &nodeName, &nodeStatus, &pendingDirs, &a.CurrentDirIndex, &a.CreatedAt, &a.UpdatedAt)
		if err != nil {
			log.Printf("解析 Agent 记录失败: %v", err)
			continue
		}
		if parentID.Valid {
			a.ParentID = parentID.String
		}
		if project.Valid {
			a.Project = project.String
		}
		if nodeName.Valid {
			a.NodeName = nodeName.String
		}
		if nodeStatus.Valid {
			a.NodeStatus = nodeStatus.String
		}
		if pendingDirs.Valid && pendingDirs.String != "" {
			json.Unmarshal([]byte(pendingDirs.String), &a.PendingDirections)
		}

		m.mu.Lock()
		m.agents[a.ID] = &a
		m.mu.Unlock()
	}

	// 第二步：为每个加载的 Agent 还原完整的内存消息上下文 (Messages 列表)
	// 这确保了 callDirectLLM 在系统重启后依然拥有全路径历史
	m.mu.RLock()
	for _, a := range m.agents {
		history, _ := m.GetAgentPathHistory(a.ID, true)
		a.Messages = history
	}
	m.mu.RUnlock()

	m.mu.RLock()
	log.Printf("📂 已从数据库加载 %d 个 Agent", len(m.agents))
	m.mu.RUnlock()
}

// saveAgent 将 Agent 状态持久化到数据库
func (m *SymphonyManager) saveAgent(agent *AgentStatus) {
	pendingDirsJson, _ := json.Marshal(agent.PendingDirections)
	_, err := m.db.Exec(
		"INSERT OR REPLACE INTO agents (id, parent_id, status, project, node, node_name, node_status, pending_directions, current_direction_index, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		agent.ID, agent.ParentID, agent.Status, agent.Project, agent.Node, agent.NodeName, agent.NodeStatus, string(pendingDirsJson), agent.CurrentDirIndex, agent.CreatedAt, agent.UpdatedAt,
	)
	if err != nil {
		log.Printf("保存 Agent 记录失败: %v", err)
	}
}

// saveMessage 将消息持久化到数据库
func (m *SymphonyManager) saveMessage(agentID string, message AgentMessage) {
	isInternal := 0
	if message.IsInternal {
		isInternal = 1
	}
	_, err := m.db.Exec(
		"INSERT INTO messages (message_id, agent_id, role, content, thinking, is_internal, ts) VALUES (?, ?, ?, ?, ?, ?, ?)",
		message.ID, agentID, message.Role, message.Content, message.Thinking, isInternal, message.TS,
	)
	if err != nil {
		log.Printf("保存消息记录失败: %v", err)
	}
}

// updateMessage 更新数据库中已存在的消息内容（如增量更新文本或思考过程）
func (m *SymphonyManager) updateMessage(agentID string, message AgentMessage) {
	if message.ID != "" {
		_, err := m.db.Exec(
			"UPDATE messages SET content = ?, thinking = ? WHERE agent_id = ? AND message_id = ?",
			message.Content, message.Thinking, agentID, message.ID,
		)
		if err != nil {
			log.Printf("更新消息记录失败: %v", err)
		}
	}
}

// startGlobalSSE 建立并维持与 OpenCode 后端的全局 SSE 连接，用于接收实时更新
func (m *SymphonyManager) startGlobalSSE() {
	if m.config.Engine != "opencode" {
		log.Printf("ℹ️ 当前引擎为 %s，跳过 OpenCode SSE 连接", m.config.Engine)
		return
	}

	url := fmt.Sprintf("%s/event", m.config.Engines.OpenCode.BaseURL)
	log.Printf("📡 正在建立全局 SSE 连接: %s", url)

	client := sse.NewClient(url)
	client.Headers["Authorization"] = m.getAuthHeader()

	err := client.SubscribeWithContext(context.Background(), "", func(msg *sse.Event) {
		m.sseConnected = true
		var event OpenCodeEvent
		if err := json.Unmarshal(msg.Data, &event); err != nil {
			return
		}
		m.handleGlobalEvent(event)
	})

	if err != nil {
		log.Printf("❌ SSE 连接意外断开: %v", err)
		m.sseConnected = false
		time.Sleep(5 * time.Second)
		go m.startGlobalSSE()
	}
}

// handleGlobalEvent 处理从 SSE 接收到的全局事件，并分发到对应的 Agent
func (m *SymphonyManager) handleGlobalEvent(event OpenCodeEvent) {
	payload := event.Payload
	if payload == nil {
		payload = event.Properties
	}
	if payload == nil {
		payload = make(map[string]interface{})
		data, _ := json.Marshal(event)
		json.Unmarshal(data, &payload)
	}

	var part *OpenCodeEventPart
	if p, ok := payload["part"].(map[string]interface{}); ok {
		part = &OpenCodeEventPart{
			Type:      getString(p, "type"),
			Text:      getString(p, "text"),
			MessageID: getString(p, "messageID"),
			AgentID:   getString(p, "agentID"),
		}
	} else if event.Part != nil {
		part = event.Part
	} else {
		part = &OpenCodeEventPart{
			Type:      getString(payload, "type"),
			Text:      getString(payload, "text"),
			MessageID: getString(payload, "messageID"),
			AgentID:   getString(payload, "agentID"),
		}
	}

	agentID := part.AgentID
	if agentID == "" {
		agentID = getString(payload, "agentID")
	}
	if agentID == "" {
		agentID = event.AgentID
	}
	if agentID == "" {
		if info, ok := payload["info"].(map[string]interface{}); ok {
			agentID = getString(info, "agentID")
		}
	}

	if agentID == "" {
		return
	}

	m.mu.Lock()
	agent, ok := m.agents[agentID]
	m.mu.Unlock()

	if !ok {
		return
	}

	eventType := event.Type
	if eventType == "" {
		eventType = getString(payload, "type")
	}

	if eventType == "message.part.updated" {
		if part.Type == "text" || part.Type == "delta" {
			messageID := part.MessageID
			var msg *AgentMessage
			m.mu.Lock()
			for i := range agent.Messages {
				if agent.Messages[i].ID == messageID {
					msg = &agent.Messages[i]
					break
				}
			}
			if msg == nil {
				newMsg := AgentMessage{
					ID:   messageID,
					Role: "assistant",
					TS:   time.Now().UnixMilli(),
				}
				agent.Messages = append(agent.Messages, newMsg)
				msg = &agent.Messages[len(agent.Messages)-1]
				m.saveMessage(agentID, *msg)
			}

			chunk := part.Text
			if chunk == "" {
				chunk = event.Delta
			}

			if chunk != "" {
				msg.Content += chunk
				agent.UpdatedAt = time.Now().UnixMilli()
				m.updateMessage(agentID, *msg)
				m.saveAgent(agent)
				m.mu.Unlock()
				m.emitUpdate(agentID, UpdateEvent{
					Type:    "message",
					AgentID: agentID,
					Message: *msg,
				})
			} else {
				m.mu.Unlock()
			}
		} else if part.Type == "reasoning" {
			messageID := part.MessageID
			var msg *AgentMessage
			m.mu.Lock()
			for i := range agent.Messages {
				if agent.Messages[i].ID == messageID {
					msg = &agent.Messages[i]
					break
				}
			}
			if msg == nil {
				newMsg := AgentMessage{
					ID:   messageID,
					Role: "assistant",
					TS:   time.Now().UnixMilli(),
				}
				agent.Messages = append(agent.Messages, newMsg)
				msg = &agent.Messages[len(agent.Messages)-1]
				m.saveMessage(agentID, *msg)
			}

			chunk := part.Text
			if chunk != "" {
				msg.Thinking += chunk
				agent.UpdatedAt = time.Now().UnixMilli()
				m.updateMessage(agentID, *msg)
				m.saveAgent(agent)
				m.mu.Unlock()
				m.emitUpdate(agentID, UpdateEvent{
					Type:    "message",
					AgentID: agentID,
					Message: *msg,
				})
			} else {
				m.mu.Unlock()
			}
		}
	} else if eventType == "session.status.updated" {
		newStatus := getString(payload, "status")
		if newStatus == "" {
			if state, ok := payload["state"].(map[string]interface{}); ok {
				newStatus = getString(state, "status")
			}
		}

		if newStatus == "busy" || newStatus == "idle" {
			m.mu.Lock()
			agent.Status = newStatus
			if newStatus == "idle" {
				agent.NodeStatus = "completed" // 状态变为 idle 时，标记当前节点完成
			}
			agent.UpdatedAt = time.Now().UnixMilli()
			m.saveAgent(agent)
			m.mu.Unlock()
			m.emitUpdate(agentID, UpdateEvent{
				Type:    "status",
				AgentID: agentID,
				Status:  newStatus,
			})
			if newStatus == "idle" {
				log.Printf("✅ Agent %s 已就绪 (Idle)", agentID[len(agentID)-6:])
			}
		}
	}
}

// getString 从 map 中安全地获取字符串值
func getString(m map[string]interface{}, key string) string {
	if v, ok := m[key]; ok {
		if s, ok := v.(string); ok {
			return s
		}
	}
	return ""
}

// CreateAgent 在后端创建一个新 Agent，并可选地继承父 Agent 或发送初始 Prompt
func (m *SymphonyManager) CreateAgent(parentID string, initialPrompt string) (string, error) {
	var agentID string

	// 无论什么引擎，我们都本地生成 UUID 作为 AgentID
	agentID = uuid.New().String()

	if m.config.Engine == "opencode" {
		// 如果是 opencode，可能还需要在后端同步创建一个 session
		// 这里暂且保持原有逻辑，但主 ID 使用本地 UUID
		req, _ := http.NewRequest("POST", fmt.Sprintf("%s/session", m.config.Engines.OpenCode.BaseURL), strings.NewReader("{}"))
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", m.getAuthHeader())
		resp, err := http.DefaultClient.Do(req)
		if err == nil {
			defer resp.Body.Close()
			var data struct {
				ID string `json:"id"`
			}
			if err := json.NewDecoder(resp.Body).Decode(&data); err == nil && data.ID != "" {
				// 如果 OpenCode 返回了 ID，我们可以将其映射或记录，但这里为了统一，我们依然以本地 UUID 为主
				// log.Printf("OpenCode session created: %s", data.ID)
			}
		}
	}

	var messages []AgentMessage
	if parentID != "" {
		m.mu.RLock()
		if parent, ok := m.agents[parentID]; ok {
			// 深度拷贝历史消息
			msgData, _ := json.Marshal(parent.Messages)
			json.Unmarshal(msgData, &messages)
		}
		m.mu.RUnlock()
	}

	agent := &AgentStatus{
		ID:         agentID,
		ParentID:   parentID,
		Status:     "idle",
		Project:    "TRIZ",
		Node:       0,
		NodeName:   "用户提问",
		NodeStatus: "running", // 初始节点设为运行中
		Messages:   messages,
		CreatedAt:  time.Now().UnixMilli(),
		UpdatedAt:  time.Now().UnixMilli(),
	}

	if parentID != "" {
		m.mu.RLock()
		if parent, ok := m.agents[parentID]; ok {
			agent.Project = parent.Project
			agent.Node = parent.Node
			agent.NodeName = parent.NodeName
		}
		m.mu.RUnlock()
	}

	m.mu.Lock()
	m.agents[agentID] = agent
	m.saveAgent(agent)
	// 修正：克隆时不需要把父消息重新存入数据库的 messages 表，避免冗余
	// 数据库中每个 Agent 只存储它自己产生的消息，路径回溯通过 parent_id 实现
	m.mu.Unlock()

	if initialPrompt != "" {
		err := m.SendMessage(agentID, initialPrompt, true)
		if err != nil {
			log.Printf("发送初始 Prompt 失败: %v", err)
		}
	}

	return agentID, nil
}

// SendMessage 向指定 Agent 发送消息
func (m *SymphonyManager) SendMessage(agentID string, text string, isInternal bool) error {
	m.mu.Lock()
	agent, ok := m.agents[agentID]
	if !ok {
		m.mu.Unlock()
		return fmt.Errorf("未找到 Agent %s", agentID)
	}

	// 1. 调用策略编排模块决定下一步
	strategy, err := m.strategy.DecideNext(text, agent)
	if err != nil {
		m.mu.Unlock()
		return fmt.Errorf("策略决策失败: %v", err)
	}

	// 2. 更新 Agent 状态（节点流转）
	agent.Node = strategy.Node
	agent.NodeName = strategy.NodeName
	agent.NodeStatus = "running" // 新节点开始执行，设为运行中
	log.Printf("🔄 [Agent %s] 策略流转 -> 节点 %d (%s) [运行中]", agent.ID[len(agent.ID)-6:], agent.Node, agent.NodeName)
	m.saveAgent(agent)

	// 触发节点更新事件推送
	content := "正在进行分析中..."
	if agent.Node == NodeTitleGen {
		content = "正在启动任务并生成标题..."
	}
	event := UpdateEvent{
		Type:     "node_update",
		AgentID:  agentID,
		NodeID:   agent.Node,
		NodeName: agent.NodeName,
		Content:  content,
		Status:   "running",
	}
	m.emitUpdate(agentID, event)

	// 3. 构造并保存用户消息
	newMessage := AgentMessage{
		Role:       "user",
		Content:    text,
		IsInternal: isInternal,
		TS:         time.Now().UnixMilli(),
	}
	agent.Messages = append(agent.Messages, newMessage)
	agent.Status = "busy"
	agent.UpdatedAt = time.Now().UnixMilli()

	m.saveMessage(agentID, newMessage)

	// 4. 发送经过策略模块处理后的 Prompt 到后端引擎
	actualPrompt := strategy.Prompt

	if m.config.Engine == "llm" || m.config.Engine == "deepseek" {
		if actualPrompt != text {
			strategyMsg := AgentMessage{
				Role:       "system",
				Content:    fmt.Sprintf("[策略引导]: %s", actualPrompt),
				IsInternal: true,
				TS:         time.Now().UnixMilli(),
			}
			agent.Messages = append(agent.Messages, strategyMsg)
			m.saveMessage(agentID, strategyMsg)
		}
		m.saveAgent(agent)
		go m.callDirectLLM(agentID)
		m.mu.Unlock()
		return nil
	}

	// 默认使用 opencode 协议逻辑
	m.saveAgent(agent)
	parts := make([]map[string]string, 0)
	if m.config.Engines.OpenCode.HasMemory {
		parts = append(parts, map[string]string{
			"type": "text",
			"text": actualPrompt,
		})
	} else {
		for _, msg := range agent.Messages {
			parts = append(parts, map[string]string{
				"type": "text",
				"text": msg.Content,
			})
		}
		if actualPrompt != text {
			parts = append(parts, map[string]string{
				"type": "text",
				"text": actualPrompt,
			})
		}
	}
	m.mu.Unlock()

	body, _ := json.Marshal(map[string]interface{}{
		"parts": parts,
	})

	req, _ := http.NewRequest("POST", fmt.Sprintf("%s/session/%s/prompt_async", m.config.Engines.OpenCode.BaseURL, agentID), bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", m.getAuthHeader())

	_, err = http.DefaultClient.Do(req)
	return err
}

// callDirectLLM 直接调用 LLM 获取回答并保存
func (m *SymphonyManager) callDirectLLM(agentID string) {
	m.mu.RLock()
	agent, ok := m.agents[agentID]
	if !ok {
		m.mu.RUnlock()
		return
	}

	messages := make([]map[string]string, 0)
	if m.config.Engines.LLM.HasMemory {
		lastMsg := agent.Messages[len(agent.Messages)-1]
		messages = append(messages, map[string]string{
			"role":    lastMsg.Role,
			"content": lastMsg.Content,
		})
	} else {
		for _, msg := range agent.Messages {
			if msg.IsInternal && msg.Role != "system" && msg.Role != "user" {
				continue
			}
			messages = append(messages, map[string]string{
				"role":    msg.Role,
				"content": msg.Content,
			})
		}
	}
	m.mu.RUnlock()

	requestBody, _ := json.Marshal(map[string]interface{}{
		"model":    m.config.Engines.LLM.Model,
		"messages": messages,
		"stream":   false,
	})

	req, _ := http.NewRequest("POST", m.config.Engines.LLM.BaseURL+"/chat/completions", bytes.NewBuffer(requestBody))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+m.config.Engines.LLM.APIKey)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Printf("❌ LLM 调用失败: %v", err)
		m.mu.Lock()
		agent.Status = "idle"
		m.mu.Unlock()
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		log.Printf("❌ LLM 返回错误状态 %d: %s", resp.StatusCode, string(body))
		m.mu.Lock()
		agent.Status = "idle"
		m.mu.Unlock()
		return
	}

	var result struct {
		Choices []struct {
			Message struct {
				Content          string `json:"content"`
				ReasoningContent string `json:"reasoning_content"`
			} `json:"message"`
		} `json:"choices"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		log.Printf("❌ 无法解析 LLM 响应: %v", err)
		m.mu.Lock()
		agent.Status = "idle"
		m.mu.Unlock()
		return
	}

	if len(result.Choices) > 0 {
		content := result.Choices[0].Message.Content
		thinking := result.Choices[0].Message.ReasoningContent
		assistantMsg := AgentMessage{
			ID:       uuid.New().String(),
			Role:     "assistant",
			Content:  content,
			Thinking: thinking,
			TS:       time.Now().UnixMilli(),
		}

		m.mu.Lock()
		agent.Messages = append(agent.Messages, assistantMsg)
		agent.Status = "idle"
		agent.NodeStatus = "completed" // 助手回复完成，当前节点标记为完成
		agent.UpdatedAt = time.Now().UnixMilli()
		m.saveMessage(agentID, assistantMsg)
		m.saveAgent(agent)
		m.mu.Unlock()

		m.emitUpdate(agentID, UpdateEvent{
			Type:    "message",
			AgentID: agentID,
			Message: assistantMsg,
		})
		m.emitUpdate(agentID, UpdateEvent{
			Type:    "status",
			AgentID: agentID,
			Status:  "idle",
		})

		m.handleAgentLoop(agentID, content)
	} else {
		m.mu.Lock()
		agent.Status = "idle"
		m.mu.Unlock()
	}
}

// handleAgentLoop 处理基于策略图的自动化闭环逻辑
func (m *SymphonyManager) handleAgentLoop(agentID string, lastResponse string) {
	m.mu.RLock()
	agent, ok := m.agents[agentID]
	m.mu.RUnlock()
	if !ok || agent.Project != "TRIZ" {
		return
	}

	switch agent.Node {
	case NodeTitleGen: // 标题生成完成
		// 标题生成现在是纯文本，不再是 JSON
		title := strings.TrimSpace(lastResponse)
		if title != "" {
			log.Printf("🏷 [Agent %s] 标题生成成功: %s", agentID[len(agentID)-6:], title)

			// 更新 Agent 的节点名称并推送
			m.mu.Lock()
			agent.NodeName = title
			m.saveAgent(agent)
			m.mu.Unlock()
			m.emitUpdate(agentID, UpdateEvent{
				Type:     "node_update",
				AgentID:  agentID,
				NodeID:   NodeTitleGen,
				NodeName: title,
				Content:  title,
				Status:   "completed",
			})

			// 广播全局标题更新
			m.emitUpdate(agentID, UpdateEvent{
				Type:    "title",
				AgentID: agentID,
				Title:   title,
			})

			// 延迟流转到 RCA
			time.Sleep(500 * time.Millisecond)
			m.SendMessage(agentID, "开始根因分析", true)
		}

	case NodeRCA:
		var result map[string]interface{}
		if m.extractJSON(lastResponse, &result) {
			rcaDetails := ""
			if val, ok := result["root_cause_analysis"].(string); ok {
				rcaDetails = val
			}

			// 更新当前节点的详细内容
			updateEvent := UpdateEvent{
				Type:     "node_update",
				AgentID:  agentID,
				NodeID:   NodeRCA,
				NodeName: "根因分析",
				Content:  rcaDetails,
				Status:   "completed",
			}
			m.emitUpdate(agentID, updateEvent)

			if directions, ok := result["innovation_directions"].([]interface{}); ok && len(directions) > 0 {
				log.Printf("🎯 [Agent %s] 识别到 %d 个创新方向，正在裂变新 Agent 并行分析...", agentID[len(agentID)-6:], len(directions))

				// 先预留第一个方向给主 Agent，但不立即 SendMessage，避免竞争
				dir0 := ""
				if item, ok := directions[0].(map[string]interface{}); ok {
					dir0, _ = item["innovation_direction"].(string)
				}

				// 处理其他裂变方向
				for i := 1; i < len(directions); i++ {
					item, ok := directions[i].(map[string]interface{})
					if !ok {
						continue
					}
					dirStr, _ := item["innovation_direction"].(string)

					go func(index int, direction string) {
						newAgentID, err := m.CreateAgent(agentID, "")
						if err != nil {
							log.Printf("❌ 裂变 Agent 失败: %v", err)
							return
						}

						// 1. 发送裂变事件（明确关联到主 Agent 的 RCA 节点）
						cloneEvent := UpdateEvent{
							Type:    "agent.cloned",
							AgentID: agentID,
							NodeID:  NodeRCA, // 明确告知父节点是 RCA
							Status:  newAgentID,
						}
						m.emitUpdate(agentID, cloneEvent)

						// 2. 推送该 Agent 的创新方向节点内容
						dirNodeEvent := UpdateEvent{
							Type:     "node_update",
							AgentID:  newAgentID,
							NodeID:   NodeInnovationDir,
							NodeName: direction,
							Content:  direction,
							Status:   "completed",
						}
						m.emitUpdate(newAgentID, dirNodeEvent)

						m.mu.Lock()
						newAgent, _ := m.agents[newAgentID]
						newAgent.PendingDirections = []string{direction}
						newAgent.CurrentDirIndex = 0
						m.saveAgent(newAgent)
						m.mu.Unlock()

						log.Printf("🌿 [裂变 Agent %s] 开始处理方向 %d: %s", newAgentID[len(newAgentID)-6:], index+1, direction)
						m.SendMessage(newAgentID, direction, true)
					}(i, dirStr)
				}

				// 最后处理主 Agent 的方向，确保它不会在裂变完成前更新 lastNodeId
				if dir0 != "" {
					m.mu.Lock()
					agent.PendingDirections = []string{dir0}
					agent.CurrentDirIndex = 0
					m.saveAgent(agent)
					m.mu.Unlock()

					dirNodeEvent := UpdateEvent{
						Type:     "node_update",
						AgentID:  agentID,
						NodeID:   NodeInnovationDir,
						NodeName: dir0,
						Content:  dir0,
						Status:   "completed",
					}
					m.emitUpdate(agentID, dirNodeEvent)

					log.Printf("🧵 [主 Agent %s] 处理方向 1: %s", agentID[len(agentID)-6:], dir0)
					go m.SendMessage(agentID, dir0, true)
				}
			}
		}

	case NodeToolRec:
		var result map[string]interface{}
		toolName := "工具推荐"
		reason := ""
		if m.extractJSON(lastResponse, &result) {
			if tool, ok := result["recommended_tool"].(string); ok && tool != "" {
				toolName = tool
			}
			if r, ok := result["reason"].(string); ok {
				reason = r
			}
		}

		m.emitUpdate(agentID, UpdateEvent{
			Type:     "node_update",
			AgentID:  agentID,
			NodeID:   NodeToolRec,
			NodeName: toolName,
			Content:  reason,
			Status:   "completed",
		})

		log.Printf("🛠 [Agent %s] 工具推荐完成: %s，准备执行具体分析...", agentID[len(agentID)-6:], toolName)
		time.Sleep(500 * time.Millisecond)
		go m.SendMessage(agentID, "执行推荐工具", true)

	case NodeToolExec:
		var result map[string]interface{}
		displayName := "矛盾矩阵分析"
		content := ""
		if m.extractJSON(lastResponse, &result) {
			if solutions, ok := result["innovation_solutions"].([]interface{}); ok && len(solutions) > 0 {
				displayName = "方案已生成"
				data, _ := json.MarshalIndent(solutions, "", "  ")
				content = string(data)
			}
		}

		m.emitUpdate(agentID, UpdateEvent{
			Type:     "node_update",
			AgentID:  agentID,
			NodeID:   NodeToolExec,
			NodeName: displayName,
			Content:  content,
			Status:   "completed",
		})

		log.Printf("🏁 [Agent %s] 该方向分析已完成: %s", agentID[len(agentID)-6:], displayName)
		go m.SendMessage(agentID, "生成创新点子", true)

	case NodeSummary:
		log.Printf("🏁 [Agent %s] 分析总结完成", agentID[len(agentID)-6:])

		m.emitUpdate(agentID, UpdateEvent{
			Type:     "node_update",
			AgentID:  agentID,
			NodeID:   NodeSummary,
			NodeName: "生成点子",       // 节点名称固定为“生成点子”
			Content:  lastResponse, // 鼠标悬停显示完整的 JSON 内容
			Status:   "completed",
		})

		m.mu.Lock()
		agent.Status = "idle"
		m.saveAgent(agent)
		m.mu.Unlock()

		m.emitUpdate(agentID, UpdateEvent{
			Type:    "status",
			AgentID: agentID,
			Status:  "idle",
		})
	}
}

// extractJSON 从文本中提取并解析 JSON
func (m *SymphonyManager) extractJSON(text string, v interface{}) bool {
	jsonStart := strings.Index(text, "{")
	jsonEnd := strings.LastIndex(text, "}")
	if jsonStart >= 0 && jsonEnd > jsonStart {
		jsonStr := text[jsonStart : jsonEnd+1]
		return json.Unmarshal([]byte(jsonStr), v) == nil
	}
	return false
}

// GetAgentStatus 获取指定 Agent 的当前状态
func (m *SymphonyManager) GetAgentStatus(agentID string) *AgentStatus {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return m.agents[agentID]
}

// GetAgentPathHistory 获取 Agent 的路径历史记录
func (m *SymphonyManager) GetAgentPathHistory(agentID string, includeAncestors bool) ([]AgentMessage, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	var allMessages []AgentMessage
	currentID := agentID

	for currentID != "" {
		// 直接从数据库查询该 Agent 产生的消息
		msgRows, err := m.db.Query("SELECT message_id, role, content, thinking, is_internal, ts FROM messages WHERE agent_id = ? ORDER BY ts ASC", currentID)
		if err != nil {
			return nil, err
		}

		var currentAgentMessages []AgentMessage
		for msgRows.Next() {
			var msg AgentMessage
			var messageID sql.NullString
			var isInternal int
			err := msgRows.Scan(&messageID, &msg.Role, &msg.Content, &msg.Thinking, &isInternal, &msg.TS)
			if err != nil {
				msgRows.Close()
				return nil, err
			}
			if messageID.Valid {
				msg.ID = messageID.String
			}
			msg.IsInternal = isInternal == 1
			currentAgentMessages = append(currentAgentMessages, msg)
		}
		msgRows.Close()

		// 将当前 Agent 的消息拼接到整体历史的前面（因为是溯源）
		allMessages = append(currentAgentMessages, allMessages...)

		if !includeAncestors {
			break
		}

		// 查找父 Agent ID
		agent, ok := m.agents[currentID]
		if !ok {
			break
		}
		currentID = agent.ParentID
	}

	return allMessages, nil
}

// GetAllAgents 获取所有 Agent 列表
func (m *SymphonyManager) GetAllAgents() []*AgentStatus {
	m.mu.RLock()
	defer m.mu.RUnlock()
	agents := make([]*AgentStatus, 0, len(m.agents))
	for _, a := range m.agents {
		agents = append(agents, a)
	}
	return agents
}

// GetTitle 根据任务描述生成一个简洁的标题
func (m *SymphonyManager) GetTitle(description string) (string, string, error) {
	agentID, err := m.CreateAgent("", "")
	if err != nil {
		return "", "", err
	}

	prompt := fmt.Sprintf("请根据以下任务描述，生成一个简洁的标题（限制20个字以内）。直接返回标题内容，不要包含任何其他文字、标点符号或解释：\n\n%s", description)

	err = m.SendMessage(agentID, prompt, true)
	if err != nil {
		return "", "", err
	}

	var title string
	var thinking string
	maxRetries := 30
	for i := 0; i < maxRetries; i++ {
		time.Sleep(1 * time.Second)
		status := m.GetAgentStatus(agentID)
		if status != nil && status.Status == "idle" {
			for i := len(status.Messages) - 1; i >= 0; i-- {
				if status.Messages[i].Role == "assistant" {
					title = strings.Trim(status.Messages[i].Content, " \"")
					thinking = status.Messages[i].Thinking
					break
				}
			}
			if title != "" {
				break
			}
		}
	}

	if title == "" {
		if len(description) > 20 {
			title = description[:20] + "..."
		} else {
			title = description
		}
	}

	m.mu.Lock()
	agent := m.agents[agentID]
	if agent != nil {
		firstMessage := AgentMessage{Role: "user", Content: description, TS: time.Now().UnixMilli()}
		assistantMessage := AgentMessage{
			Role:     "assistant",
			Content:  fmt.Sprintf("已为您生成任务标题：%s", title),
			Thinking: thinking,
			TS:       time.Now().UnixMilli() + 1,
			ID:       uuid.New().String(),
		}

		agent.Messages = []AgentMessage{firstMessage, assistantMessage}
		agent.UpdatedAt = time.Now().UnixMilli()

		m.db.Exec("DELETE FROM messages WHERE agent_id = ?", agentID)
		m.saveMessage(agentID, firstMessage)
		m.saveMessage(agentID, assistantMessage)
		m.saveAgent(agent)

		m.emitUpdate(agentID, UpdateEvent{
			Type:    "message",
			AgentID: agentID,
			Message: assistantMessage,
		})
	}
	m.mu.Unlock()

	return title, agentID, nil
}
