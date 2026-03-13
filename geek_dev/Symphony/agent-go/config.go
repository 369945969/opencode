package main

import (
	"encoding/json"
	"os"
)

// Config 应用程序配置结构体
type Config struct {
	Server struct {
		Port string `json:"port"` // 服务监听端口
	} `json:"server"`
	Engine  string `json:"engine"` // 当前启用的引擎类型: "opencode" | "llm"
	Engines struct {
		OpenCode struct {
			BaseURL   string `json:"base_url"`   // OpenCode 后端基础 URL
			Username  string `json:"username"`   // OpenCode 后端认证用户名
			Password  string `json:"password"`   // OpenCode 后端认证密码
			HasMemory bool   `json:"has_memory"` // 引擎是否原生支持记忆能力
		} `json:"opencode"`
		LLM struct {
			Provider  string `json:"provider"`   // 提供商: "deepseek" | "openai" 等
			BaseURL   string `json:"base_url"`   // LLM API 基础 URL
			APIKey    string `json:"api_key"`    // LLM API 密钥
			Model     string `json:"model"`      // LLM 模型名称
			HasMemory bool   `json:"has_memory"` // 引擎是否原生支持记忆能力
		} `json:"llm"`
	} `json:"engines"`
	Database struct {
		File string `json:"file"` // SQLite 数据库文件名
	} `json:"database"`
}

// LoadConfig 从指定路径加载配置文件
func LoadConfig(path string) (*Config, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	cfg := &Config{}
	decoder := json.NewDecoder(file)
	if err := decoder.Decode(cfg); err != nil {
		return nil, err
	}

	return cfg, nil
}
