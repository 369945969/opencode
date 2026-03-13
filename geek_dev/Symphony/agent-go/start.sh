#!/bin/bash

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# 默认模式为 console
MODE=${1:-"console"}

# 检查配置文件是否存在
if [ ! -f "config.json" ]; then
    echo "❌ 错误: 未找到 config.json 配置文件。"
    exit 1
fi

# 检查 Go 是否安装
if ! command -v go &> /dev/null; then
    echo "❌ 错误: 系统未安装 Go 语言环境。"
    exit 1
fi

# 检查是否有正在运行的进程，如果有则杀掉
EXISTING_PID=$(pgrep -f "./symphony-agent")
if [ ! -z "$EXISTING_PID" ]; then
    echo "🔌 发现正在运行的 Symphony Agent (PID: $EXISTING_PID)，正在停止..."
    kill $EXISTING_PID
    sleep 1
fi

# 编译程序
echo "🔨 正在编译 Symphony Agent (Go 版)..."
go build -o symphony-agent .

if [ $? -eq 0 ]; then
    echo "✅ 编译成功。"
    echo "🚀 正在以 $MODE 模式启动..."
    # 运行程序并传递模式参数，透传后续所有参数
    shift # 移除模式参数
    ./symphony-agent -mode="$MODE" "$@"
else
    echo "❌ 编译失败，请检查代码错误。"
    exit 1
fi
