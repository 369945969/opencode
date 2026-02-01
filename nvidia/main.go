package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"
)

type Config struct {
	Provider struct {
		Nvidia struct {
			Options struct {
				BaseURL string `json:"baseURL"`
				APIKey  string `json:"apiKey"`
			} `json:"options"`
			Models map[string]struct {
				ID   string `json:"id"`
				Name string `json:"name"`
			} `json:"models"`
		} `json:"nvidia"`
	} `json:"provider"`
	Proxy struct {
		Port    string `json:"port"`
		LogFile string `json:"logFile"`
	} `json:"proxy"`
}

var currentLogFile = "app.log"

func loadConfig() (*Config, error) {
	data, err := os.ReadFile("opencode.json")
	if err != nil {
		return nil, err
	}
	var cfg Config
	if err := json.Unmarshal(data, &cfg); err != nil {
		return nil, err
	}
	// Use defaults if not provided
	if cfg.Proxy.Port == "" {
		cfg.Proxy.Port = "7070"
	}
	if cfg.Proxy.LogFile == "" {
		cfg.Proxy.LogFile = "app.log"
	}
	currentLogFile = cfg.Proxy.LogFile
	return &cfg, nil
}

func main() {
	cfg, err := loadConfig()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	target, err := url.Parse(cfg.Provider.Nvidia.Options.BaseURL)
	if err != nil {
		log.Fatal(err)
	}

	modelMap := make(map[string]string)
	for reqID, m := range cfg.Provider.Nvidia.Models {
		modelMap[reqID] = m.ID
	}
	defaultModel := "z-ai/glm4.7"
	transport := http.DefaultTransport.(*http.Transport).Clone()
	transport.DisableCompression = true
	transport.ForceAttemptHTTP2 = true

	proxy := &httputil.ReverseProxy{
		Transport:     transport,
		FlushInterval: 100 * time.Millisecond,
		Director: func(req *http.Request) {
			req.URL.Scheme = target.Scheme
			req.URL.Host = target.Host

			// Custom path joining logic to avoid duplication (e.g., /v1/v1/...)
			targetPath := strings.TrimSuffix(target.Path, "/")
			requestPath := req.URL.Path
			if !strings.HasPrefix(requestPath, "/") {
				requestPath = "/" + requestPath
			}

			if targetPath != "" && (strings.HasPrefix(requestPath, targetPath+"/") || requestPath == targetPath) {
				// Path already has the prefix, don't double it
				req.URL.Path = requestPath
			} else {
				// Prepend target path
				req.URL.Path = targetPath + requestPath
			}

			// Inject API Key
			req.Header.Set("Authorization", "Bearer "+cfg.Provider.Nvidia.Options.APIKey)
			// NVIDIA requires Host header to match target
			req.Host = target.Host
		},
		ModifyResponse: func(res *http.Response) error {
			path := ""
			if res.Request != nil {
				path = res.Request.URL.Path
			}
			if res.Request != nil && res.Request.Header.Get("X-Stream") == "1" {
				res.Header.Set("Content-Type", "text/event-stream")
				res.Header.Set("Cache-Control", "no-cache")
				res.Header.Set("Connection", "keep-alive")
				res.Header.Set("X-Accel-Buffering", "no")
				res.Header.Del("Content-Length")
			}
			if res.Request != nil && res.Request.Header.Get("X-Anthropic-Compat") == "1" {
				res.Body = wrapAnthropicSSE(res.Body)
			}

			res.Body = &responseWrapper{
				ReadCloser: res.Body,
				body:       &bytes.Buffer{},
				path:       path,
			}
			return nil
		},
		ErrorHandler: func(w http.ResponseWriter, r *http.Request, err error) {
			msg, _ := json.Marshal(map[string]interface{}{
				"error": err.Error(),
				"path":  r.URL.Path,
			})
			go logToAppLog("ERROR", msg, r.URL.Path)

			if r.Header.Get("X-Stream") == "1" {
				w.Header().Set("Content-Type", "text/event-stream")
				w.Header().Set("Cache-Control", "no-cache")
				w.Header().Set("Connection", "keep-alive")
				w.Header().Set("X-Accel-Buffering", "no")
				w.WriteHeader(http.StatusOK)
				fmt.Fprintf(w, "event: error\n")
				fmt.Fprintf(w, "data: %s\n\n", msg)
				return
			}

			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadGateway)
			w.Write(msg)
		},
	}

	// Custom handler to intercept and log messages
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		originalPath := r.URL.Path

		// Apply path aliasing (prefix based)
		if strings.HasPrefix(r.URL.Path, "/v1/messages") {
			r.URL.Path = strings.Replace(r.URL.Path, "/v1/messages", "/v1/chat/completions", 1)
		} else if strings.HasPrefix(r.URL.Path, "/messages") {
			r.URL.Path = "/v1/chat/completions" + strings.TrimPrefix(r.URL.Path, "/messages")
		}

		if r.URL.Path != originalPath {
			log.Printf("Path Alias applied: %s -> %s\n", originalPath, r.URL.Path)
		}

		// Handle count_tokens endpoint which NVIDIA doesn't support
		if strings.HasSuffix(r.URL.Path, "/count_tokens") {
			log.Printf("Intercepting count_tokens request: %s", r.URL.Path)
			w.Header().Set("Content-Type", "application/json")
			// Return a dummy count
			json.NewEncoder(w).Encode(map[string]interface{}{
				"count":        100,
				"input_tokens": 100,
			})
			return
		}

		// Strip query parameters that might cause 404/400 on some providers
		if r.URL.RawQuery != "" {
			log.Printf("Stripping query params: %s\n", r.URL.RawQuery)
			r.URL.RawQuery = ""
		}

		// Log request info and forwarding target to console
		var finalURL string
		tPath := strings.TrimSuffix(target.Path, "/")
		if tPath != "" && (strings.HasPrefix(r.URL.Path, tPath+"/") || r.URL.Path == tPath) {
			finalURL = fmt.Sprintf("%s://%s%s", target.Scheme, target.Host, r.URL.Path)
		} else {
			finalURL = fmt.Sprintf("%s://%s%s%s", target.Scheme, target.Host, tPath, r.URL.Path)
		}

		logMsg := fmt.Sprintf("Incoming: %s %s %s -> Forwarding to: %s", r.RemoteAddr, r.Method, r.URL.RequestURI(), finalURL)
		fmt.Println(logMsg)

		if r.Method == http.MethodPost {
			body, err := io.ReadAll(r.Body)
			if err == nil {
				anthropic := isAnthropic(body)
				if anthropic {
					body = mapAnthropicMessages(body)
				}
				body = mapModel(body, modelMap, defaultModel)
				body = mapTools(body)
				body = mapToolChoice(body)
				if isStream(body) {
					r.Header.Set("Accept", "text/event-stream")
					r.Header.Set("Accept-Encoding", "identity")
					r.Header.Set("X-Stream", "1")
				}
				if anthropic {
					r.Header.Set("X-Anthropic-Compat", "1")
				}
				r.Body = io.NopCloser(bytes.NewBuffer(body))
				r.ContentLength = int64(len(body))
				r.Header.Set("Content-Length", strconv.Itoa(len(body)))

				// Log request to app.log
				go logToAppLog("REQUEST", body, r.URL.Path)
			}
		} else {
			// Still log the visit for non-POST requests
			go logToAppLog("VISIT", nil, r.URL.Path)
		}

		proxy.ServeHTTP(w, r)
	})

	port := cfg.Proxy.Port
	fmt.Printf("NVIDIA Proxy is running on :%s\n", port)
	fmt.Printf("Forwarding requests to %s\n", target)
	fmt.Printf("Logging requests and responses to %s\n", currentLogFile)

	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func logToAppLog(label string, body []byte, path string) {
	// Open or create the log file
	f, err := os.OpenFile(currentLogFile, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return
	}
	defer f.Close()

	timestamp := time.Now().Format("2006-01-02 15:04:05")

	if body == nil {
		fmt.Fprintf(f, "[%s] %s: %s\n", timestamp, label, path)
		return
	}

	// Try to format as JSON if possible
	var jsonObj interface{}
	if err := json.Unmarshal(body, &jsonObj); err == nil {
		logData, _ := json.Marshal(struct {
			Timestamp string      `json:"timestamp"`
			Label     string      `json:"label"`
			Path      string      `json:"path"`
			Data      interface{} `json:"data"`
		}{
			Timestamp: timestamp,
			Label:     label,
			Path:      path,
			Data:      jsonObj,
		})
		fmt.Fprintf(f, "%s\n", logData)
	} else {
		// Fallback to raw string
		fmt.Fprintf(f, "[%s] %s: %s | Body: %s\n", timestamp, label, path, string(body))
	}
}

func mapModel(body []byte, modelMap map[string]string, defaultModel string) []byte {
	var bodyMap map[string]interface{}
	if err := json.Unmarshal(body, &bodyMap); err != nil {
		return body
	}

	model, ok := bodyMap["model"].(string)
	if ok {
		mapped, ok := modelMap[model]
		if ok {
			bodyMap["model"] = mapped
		}
		if !ok {
			bodyMap["model"] = defaultModel
		}
	}
	if !ok {
		bodyMap["model"] = defaultModel
	}

	newBody, err := json.Marshal(bodyMap)
	if err != nil {
		return body
	}
	return newBody
}

func mapTools(body []byte) []byte {
	var bodyMap map[string]interface{}
	if err := json.Unmarshal(body, &bodyMap); err != nil {
		return body
	}

	raw, ok := bodyMap["tools"].([]interface{})
	if !ok {
		return body
	}

	newTools := make([]interface{}, 0, len(raw))
	for _, item := range raw {
		m, ok := item.(map[string]interface{})
		if !ok {
			newTools = append(newTools, item)
			continue
		}

		fn, ok := m["function"]
		if ok {
			newTools = append(newTools, map[string]interface{}{
				"type":     "function",
				"function": fn,
			})
			continue
		}

		schema, ok := m["input_schema"]
		if ok {
			newTools = append(newTools, map[string]interface{}{
				"type": "function",
				"function": map[string]interface{}{
					"name":        m["name"],
					"description": m["description"],
					"parameters":  schema,
				},
			})
			continue
		}

		newTools = append(newTools, item)
	}

	bodyMap["tools"] = newTools
	newBody, err := json.Marshal(bodyMap)
	if err != nil {
		return body
	}
	return newBody
}

func mapAnthropicMessages(body []byte) []byte {
	var data map[string]interface{}
	if err := json.Unmarshal(body, &data); err != nil {
		return body
	}

	raw, ok := data["messages"].([]interface{})
	if !ok {
		return body
	}

	out := make([]interface{}, 0, len(raw)+1)

	sys, ok := data["system"].([]interface{})
	if ok {
		var b strings.Builder
		for _, item := range sys {
			m, ok := item.(map[string]interface{})
			if !ok {
				continue
			}
			t, ok := m["text"].(string)
			if !ok || t == "" {
				continue
			}
			if b.Len() > 0 {
				b.WriteString("\n")
			}
			b.WriteString(t)
		}
		if b.Len() > 0 {
			out = append(out, map[string]interface{}{
				"role":    "system",
				"content": b.String(),
			})
			delete(data, "system")
		}
	}

	for _, item := range raw {
		m, ok := item.(map[string]interface{})
		if !ok {
			continue
		}
		role, _ := m["role"].(string)
		if role == "user" {
			content := m["content"]
			if s, ok := content.(string); ok {
				if strings.TrimSpace(s) != "" {
					out = append(out, map[string]interface{}{
						"role":    "user",
						"content": s,
					})
				}
				continue
			}
			blocks, ok := content.([]interface{})
			if !ok {
				out = append(out, m)
				continue
			}
			var b strings.Builder
			for _, part := range blocks {
				pm, ok := part.(map[string]interface{})
				if !ok {
					continue
				}
				t, _ := pm["type"].(string)
				if t == "text" {
					text, _ := pm["text"].(string)
					if text == "" {
						continue
					}
					if b.Len() > 0 {
						b.WriteString("\n")
					}
					b.WriteString(text)
					continue
				}
				if t != "tool_result" {
					continue
				}
				id, _ := pm["tool_use_id"].(string)
				if id == "" {
					continue
				}
				content := pm["content"]
				result := ""
				if s, ok := content.(string); ok {
					result = s
				}
				if arr, ok := content.([]interface{}); ok {
					var rb strings.Builder
					for _, p := range arr {
						rm, ok := p.(map[string]interface{})
						if !ok {
							continue
						}
						tt, _ := rm["type"].(string)
						if tt != "text" {
							continue
						}
						text, _ := rm["text"].(string)
						if text == "" {
							continue
						}
						if rb.Len() > 0 {
							rb.WriteString("\n")
						}
						rb.WriteString(text)
					}
					result = rb.String()
				}
				if result == "" {
					raw, err := json.Marshal(content)
					if err == nil {
						result = string(raw)
					}
				}
				out = append(out, map[string]interface{}{
					"role":         "tool",
					"tool_call_id": id,
					"content":      result,
				})
			}
			if b.Len() > 0 {
				out = append(out, map[string]interface{}{
					"role":    "user",
					"content": b.String(),
				})
			}
			continue
		}
		if role == "assistant" {
			blocks, ok := m["content"].([]interface{})
			if !ok {
				out = append(out, m)
				continue
			}
			var b strings.Builder
			calls := []interface{}{}
			for _, part := range blocks {
				pm, ok := part.(map[string]interface{})
				if !ok {
					continue
				}
				t, _ := pm["type"].(string)
				if t == "text" {
					text, _ := pm["text"].(string)
					if text == "" {
						continue
					}
					if b.Len() > 0 {
						b.WriteString("\n")
					}
					b.WriteString(text)
					continue
				}
				if t != "tool_use" {
					continue
				}
				id, _ := pm["id"].(string)
				name, _ := pm["name"].(string)
				args := pm["input"]
				jsonArgs := "{}"
				if s, ok := args.(string); ok {
					if s != "" {
						jsonArgs = s
					}
					if s == "" {
						jsonArgs = "{}"
					}
				}
				if _, ok := args.(string); !ok {
					raw, err := json.Marshal(args)
					if err == nil {
						jsonArgs = string(raw)
					}
				}
				calls = append(calls, map[string]interface{}{
					"id":   id,
					"type": "function",
					"function": map[string]interface{}{
						"name":      name,
						"arguments": jsonArgs,
					},
				})
			}
			msg := map[string]interface{}{
				"role": "assistant",
			}
			if b.Len() > 0 {
				msg["content"] = b.String()
			}
			if b.Len() == 0 {
				msg["content"] = ""
			}
			if len(calls) > 0 {
				msg["tool_calls"] = calls
			}
			out = append(out, msg)
			continue
		}
		out = append(out, m)
	}

	data["messages"] = out
	newBody, err := json.Marshal(data)
	if err != nil {
		return body
	}
	return newBody
}

func mapToolChoice(body []byte) []byte {
	var bodyMap map[string]interface{}
	if err := json.Unmarshal(body, &bodyMap); err != nil {
		return body
	}

	raw, ok := bodyMap["tool_choice"]
	if !ok {
		return body
	}

	if v, ok := raw.(string); ok {
		if v == "auto" || v == "none" || v == "required" {
			return body
		}
	}

	m, ok := raw.(map[string]interface{})
	if !ok {
		return body
	}

	t, _ := m["type"].(string)
	if t == "auto" || t == "none" || t == "required" {
		bodyMap["tool_choice"] = t
	}

	if t == "tool" {
		name, _ := m["name"].(string)
		if name != "" {
			bodyMap["tool_choice"] = map[string]interface{}{
				"type": "function",
				"function": map[string]interface{}{
					"name": name,
				},
			}
		}
	}

	newBody, err := json.Marshal(bodyMap)
	if err != nil {
		return body
	}
	return newBody
}

func isAnthropic(body []byte) bool {
	var bodyMap map[string]interface{}
	if err := json.Unmarshal(body, &bodyMap); err != nil {
		return false
	}

	system, ok := bodyMap["system"].([]interface{})
	if !ok {
		return false
	}

	for _, item := range system {
		m, ok := item.(map[string]interface{})
		if !ok {
			continue
		}
		_, ok = m["text"].(string)
		if ok {
			return true
		}
	}

	return false
}

func isStream(body []byte) bool {
	var bodyMap map[string]interface{}
	if err := json.Unmarshal(body, &bodyMap); err != nil {
		return false
	}
	stream, ok := bodyMap["stream"].(bool)
	return ok && stream
}

func wrapAnthropicSSE(body io.ReadCloser) io.ReadCloser {
	reader, writer := io.Pipe()

	go func() {
		defer body.Close()
		defer writer.Close()

		send := func(event string, payload string) {
			fmt.Fprintf(writer, "event: %s\n", event)
			fmt.Fprintf(writer, "data: %s\n\n", payload)
		}

		const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
		b := make([]byte, 22)
		for i := range b {
			b[i] = charset[time.Now().UnixNano()%int64(len(charset))]
		}
		msgID := fmt.Sprintf("msg_%s", string(b))

		send("message_start", fmt.Sprintf(`{"type":"message_start","message":{"id":"%s","type":"message","role":"assistant","content":[],"model":"claude-3-5-sonnet-20241022","stop_reason":null,"stop_sequence":null,"usage":{"input_tokens":10,"output_tokens":1}}}`, msgID))
		textOpen := false
		toolOpen := map[int]bool{}
		toolIds := map[int]string{}
		toolNames := map[int]string{}
		done := false
		closeText := func() {
			if !textOpen {
				return
			}
			send("content_block_stop", `{"type":"content_block_stop","index":0}`)
			textOpen = false
		}
		closeTools := func() {
			for i, open := range toolOpen {
				if !open {
					continue
				}
				stop, err := json.Marshal(map[string]interface{}{
					"type":  "content_block_stop",
					"index": i,
				})
				if err == nil {
					send("content_block_stop", string(stop))
					toolOpen[i] = false
				}
			}
		}

		reader := bufio.NewReader(body)
		for {
			line, err := reader.ReadString('\n')
			if err != nil {
				if err != io.EOF {
					fmt.Printf("Error reading stream: %v\n", err)
				}
				if line == "" {
					break
				}
			}

			line = strings.TrimSpace(line)
			if line == "" {
				continue
			}

			if !strings.HasPrefix(line, "data: ") {
				continue
			}
			payload := strings.TrimPrefix(line, "data: ")
			if payload == "[DONE]" {
				break
			}

			var chunk struct {
				Choices []struct {
					Delta struct {
						Content   *string `json:"content"`
						ToolCalls []struct {
							Index    int    `json:"index"`
							ID       string `json:"id"`
							Type     string `json:"type"`
							Function struct {
								Name      string `json:"name"`
								Arguments string `json:"arguments"`
							} `json:"function"`
						} `json:"tool_calls"`
					} `json:"delta"`
					FinishReason *string `json:"finish_reason"`
				} `json:"choices"`
			}
			if err := json.Unmarshal([]byte(payload), &chunk); err != nil {
				continue
			}
			if len(chunk.Choices) == 0 {
				continue
			}
			delta := chunk.Choices[0].Delta
			if delta.ToolCalls != nil {
				for _, tc := range delta.ToolCalls {
					if tc.ID != "" {
						toolIds[tc.Index] = tc.ID
					}
					if tc.Function.Name != "" {
						toolNames[tc.Index] = tc.Function.Name
					}
					if !toolOpen[tc.Index] && toolNames[tc.Index] != "" {
						id := toolIds[tc.Index]
						if id == "" {
							id = fmt.Sprintf("toolu_%d", time.Now().UnixNano())
							toolIds[tc.Index] = id
						}
						start, err := json.Marshal(map[string]interface{}{
							"type":  "content_block_start",
							"index": tc.Index,
							"content_block": map[string]interface{}{
								"type":  "tool_use",
								"id":    id,
								"name":  toolNames[tc.Index],
								"input": map[string]interface{}{},
							},
						})
						if err == nil {
							send("content_block_start", string(start))
							toolOpen[tc.Index] = true
						}
					}
					if tc.Function.Arguments != "" {
						deltaPayload, err := json.Marshal(map[string]interface{}{
							"type":  "content_block_delta",
							"index": tc.Index,
							"delta": map[string]interface{}{
								"type":         "input_json_delta",
								"partial_json": tc.Function.Arguments,
							},
						})
						if err == nil {
							send("content_block_delta", string(deltaPayload))
						}
					}
				}
			}

			text := delta.Content
			if text == nil || *text == "" {
				finish := chunk.Choices[0].FinishReason
				if finish == nil {
					continue
				}
				if *finish == "tool_calls" {
					closeText()
					closeTools()
					send("message_delta", `{"type":"message_delta","delta":{"stop_reason":"tool_use","stop_sequence":null},"usage":{"output_tokens":0}}`)
					send("message_stop", `{"type":"message_stop"}`)
					done = true
					break
				}
				if *finish == "stop" {
					closeText()
					closeTools()
					send("message_delta", `{"type":"message_delta","delta":{"stop_reason":"end_turn","stop_sequence":null},"usage":{"output_tokens":0}}`)
					send("message_stop", `{"type":"message_stop"}`)
					done = true
					break
				}
				if *finish == "length" {
					closeText()
					closeTools()
					send("message_delta", `{"type":"message_delta","delta":{"stop_reason":"max_tokens","stop_sequence":null},"usage":{"output_tokens":0}}`)
					send("message_stop", `{"type":"message_stop"}`)
					done = true
					break
				}
				continue
			}
			if !textOpen {
				send("content_block_start", `{"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}`)
				textOpen = true
			}
			data, err := json.Marshal(map[string]interface{}{
				"type":  "content_block_delta",
				"index": 0,
				"delta": map[string]interface{}{
					"type": "text_delta",
					"text": *text,
				},
			})
			if err != nil {
				continue
			}
			send("content_block_delta", string(data))
		}

		if done {
			return
		}
		closeText()
		closeTools()
		send("message_delta", `{"type":"message_delta","delta":{"stop_reason":"end_turn","stop_sequence":null},"usage":{"output_tokens":0}}`)
		send("message_stop", `{"type":"message_stop"}`)
	}()

	return reader
}

type responseWrapper struct {
	io.ReadCloser
	body *bytes.Buffer
	path string
}

func (r *responseWrapper) Read(p []byte) (n int, err error) {
	n, err = r.ReadCloser.Read(p)
	if n > 0 {
		r.body.Write(p[:n])
	}
	return
}

func (r *responseWrapper) Close() error {
	go logToAppLog("RESPONSE", r.body.Bytes(), r.path)
	return r.ReadCloser.Close()
}
