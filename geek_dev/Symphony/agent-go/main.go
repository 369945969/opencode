package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"strings"
)

// manager 全局 SymphonyManager 实例
var manager *SymphonyManager

func main() {
	// 1. 定义命令行参数
	mode := flag.String("mode", "console", "运行模式: server (API 服务) | console (交互控制台)")
	configPath := flag.String("config", "config.json", "配置文件路径")
	flag.Parse()

	// 捕获非 flag 参数作为初始问题
	initialPrompt := strings.Join(flag.Args(), " ")

	// 2. 加载配置文件
	cfg, err := LoadConfig(*configPath)
	if err != nil {
		log.Fatalf("无法加载配置文件 %s: %v", *configPath, err)
	}

	// 3. 初始化核心管理器
	manager = NewSymphonyManager(cfg)

	// 4. 根据模式启动
	switch *mode {
	case "server":
		fmt.Println("🚀 启动服务器模式...")
		StartServer(cfg)
	case "console":
		fmt.Println("💻 启动控制台模式...")
		StartConsole(cfg, initialPrompt)
	default:
		fmt.Printf("❌ 未知运行模式: %s\n", *mode)
		os.Exit(1)
	}
}
