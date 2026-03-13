package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
)

// StartServer 启动 HTTP 服务器
func StartServer(cfg *Config) {
	mux := http.NewServeMux()

	// 业务接口
	mux.HandleFunc("/get-title", handleGetTitle)    // 根据描述生成标题
	mux.HandleFunc("/agents", handleAgents)         // Agent 列表及创建 Agent
	mux.HandleFunc("/agents/", handleAgentSpecific) // 特定 Agent 详情、消息发送及事件流

	// 应用 CORS 中间件并启动服务
	handler := corsMiddleware(mux)

	log.Printf("Symphony server running on http://localhost%s", cfg.Server.Port)
	if err := http.ListenAndServe(cfg.Server.Port, handler); err != nil {
		log.Fatal(err)
	}
}

// corsMiddleware 跨域资源共享中间件
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// 处理预检请求
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// handleGetTitle 处理获取标题的 POST 请求
func handleGetTitle(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "仅支持 POST 方法", http.StatusMethodNotAllowed)
		return
	}

	var body struct {
		Description string `json:"description"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Description == "" {
		http.Error(w, "请求体中必须包含 description 字段", http.StatusBadRequest)
		return
	}

	title, agentID, err := manager.GetTitle(body.Description)
	if err != nil {
		log.Printf("❌ 获取标题失败: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"title":   title,
		"agentId": agentID,
	})
}

// handleAgents 处理 Agent 列表查询(GET)和新 Agent 创建(POST)
func handleAgents(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// 创建新 Agent
	if r.Method == http.MethodPost {
		var body struct {
			ParentID      string `json:"parent_id"`
			InitialPrompt string `json:"initial_prompt"`
		}
		json.NewDecoder(r.Body).Decode(&body)

		id, err := manager.CreateAgent(body.ParentID, body.InitialPrompt)
		if err != nil {
			log.Printf("❌ 创建 Agent 失败: %v", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"id": id})
		return
	}

	// 查询所有 Agent 列表
	if r.Method == http.MethodGet {
		json.NewEncoder(w).Encode(manager.GetAllAgents())
		return
	}

	http.Error(w, "方法不允许", http.StatusMethodNotAllowed)
}

// handleAgentSpecific 分发针对特定 Agent 的请求 (/agents/{id}/...)
func handleAgentSpecific(w http.ResponseWriter, r *http.Request) {
	pathParts := strings.Split(strings.TrimPrefix(r.URL.Path, "/agents/"), "/")
	if len(pathParts) < 1 {
		http.Error(w, "未找到路径", http.StatusNotFound)
		return
	}

	id := pathParts[0]
	subPath := ""
	if len(pathParts) > 1 {
		subPath = pathParts[1]
	}

	// SSE 事件流订阅
	if subPath == "events" && r.Method == http.MethodGet {
		handleAgentEvents(w, r, id)
		return
	}

	// 获取 Agent 路径历史记录
	if subPath == "history" && r.Method == http.MethodGet {
		includeAncestors := r.URL.Query().Get("include_ancestors") == "true"
		messages, err := manager.GetAgentPathHistory(id, includeAncestors)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"agent_id": id,
			"messages": messages,
		})
		return
	}

	// 获取非内部消息日志
	if subPath == "logs" && r.Method == http.MethodGet {
		status := manager.GetAgentStatus(id)
		if status == nil {
			http.Error(w, "Agent 不存在", http.StatusNotFound)
			return
		}
		publicMessages := make([]AgentMessage, 0)
		for _, m := range status.Messages {
			if !m.IsInternal || m.Role == "user" || m.Role == "system" {
				publicMessages = append(publicMessages, m)
			}
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"messages": publicMessages,
			"status":   status.Status,
		})
		return
	}

	// 发送新消息
	if subPath == "message" && r.Method == http.MethodPost {
		var body struct {
			Text string `json:"text"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Text == "" {
			http.Error(w, "消息内容不能为空", http.StatusBadRequest)
			return
		}
		if err := manager.SendMessage(id, body.Text, false); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]bool{"success": true})
		return
	}

	// 获取 Agent 详情
	if subPath == "" && r.Method == http.MethodGet {
		status := manager.GetAgentStatus(id)
		if status == nil {
			http.Error(w, "Agent 不存在", http.StatusNotFound)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(status)
		return
	}

	http.Error(w, "未找到路径", http.StatusNotFound)
}

// handleAgentEvents 处理 SSE 订阅请求，实时推送 Agent 更新
func handleAgentEvents(w http.ResponseWriter, r *http.Request, id string) {
	// 设置 SSE 必要的 HTTP 头
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "当前连接不支持流式输出", http.StatusInternalServerError)
		return
	}

	// 1. 发送初始数据 (仅针对特定 Agent)
	if id != "all" {
		agent := manager.GetAgentStatus(id)
		if agent == nil {
			http.Error(w, "Agent 不存在", http.StatusNotFound)
			return
		}
		publicMessages := make([]AgentMessage, 0)
		for _, m := range agent.Messages {
			if !m.IsInternal || m.Role == "user" || m.Role == "system" {
				publicMessages = append(publicMessages, m)
			}
		}
		initialData, _ := json.Marshal(map[string]interface{}{
			"type":     "history",
			"messages": publicMessages,
			"status":   agent.Status,
		})
		fmt.Fprintf(w, "data: %s\n\n", initialData)
		flusher.Flush()
	}

	// 2. 订阅后续实时更新
	topic := "update:" + id
	if id == "all" {
		topic = "all_updates"
	}
	ch := manager.pubsub.Subscribe(topic)
	defer manager.pubsub.Unsubscribe(topic, ch)

	ctx := r.Context()
	for {
		select {
		case event := <-ch:
			data, _ := json.Marshal(event)
			fmt.Fprintf(w, "data: %s\n\n", data)
			flusher.Flush()
		case <-ctx.Done():
			log.Printf("🔌 SSE 连接已断开: %s", id)
			return
		}
	}
}
