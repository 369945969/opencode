package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strings"
)

// StartConsole 启动控制台交互模式
func StartConsole(cfg *Config, initialPrompt string) {
	fmt.Println("🎨 Symphony Agent 控制台模式")
	fmt.Println("输入 'exit' 或 'quit' 退出，输入 'clear' 清屏")
	fmt.Println("-------------------------------------------")

	// 1. 创建一个初始 Agent
	agentID, err := manager.CreateAgent("", "")
	if err != nil {
		log.Fatalf("❌ 创建初始 Agent 失败: %v", err)
	}

	fmt.Printf("📂 已创建主 Agent: %s\n", agentID)

	// 2. 订阅所有 Agent 更新
	ch := manager.pubsub.Subscribe("all_updates")
	defer manager.pubsub.Unsubscribe("all_updates", ch)

	// 启动一个协程监听并打印更新
	go func() {
		for event := range ch {
			if event.Type == "message" && event.Message.Role == "assistant" {
				// 收到助手回复时，根据状态打印
			} else if event.Type == "status" && event.Status == "idle" {
				status := manager.GetAgentStatus(event.AgentID)
				if status != nil {
					fmt.Printf("\n\n🔔 [Agent %s | 节点: %s (%d) | 状态: %s]\nAssistant: ", event.AgentID[len(event.AgentID)-6:], status.NodeName, status.Node, status.NodeStatus)
					for i := len(status.Messages) - 1; i >= 0; i-- {
						if status.Messages[i].Role == "assistant" {
							if status.Messages[i].Thinking != "" {
								fmt.Printf("\n[思考]: %s\n", status.Messages[i].Thinking)
							}
							fmt.Printf("%s\n\n> ", status.Messages[i].Content)
							break
						}
					}
				}
			}
		}
	}()

	// 3. 如果有初始 Prompt，直接发送
	if initialPrompt != "" {
		fmt.Printf("> %s\n", initialPrompt)
		err := manager.SendMessage(agentID, initialPrompt, false)
		if err != nil {
			fmt.Printf("❌ 发送初始消息失败: %v\n> ", err)
		}
	}

	// 4. 循环读取用户输入
	scanner := bufio.NewScanner(os.Stdin)
	if initialPrompt == "" {
		fmt.Print("> ")
	}
	for scanner.Scan() {
		input := strings.TrimSpace(scanner.Text())

		if input == "exit" || input == "quit" {
			break
		}

		if input == "clear" {
			fmt.Print("\033[H\033[2J")
			fmt.Print("> ")
			continue
		}

		if input == "" {
			fmt.Print("> ")
			continue
		}

		// 发送消息给初始主 Agent
		err := manager.SendMessage(agentID, input, false)
		if err != nil {
			fmt.Printf("❌ 发送消息失败: %v\n> ", err)
			continue
		}
	}

	if err := scanner.Err(); err != nil {
		fmt.Printf("❌ 读取输入错误: %v\n", err)
	}
}
