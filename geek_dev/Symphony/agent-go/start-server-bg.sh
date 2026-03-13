#!/bin/bash

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

LOG_FILE="symphony-agent.log"

echo "🚀 正在后台启动 Symphony Agent (Server 模式)..."

# 1. 检查并杀掉已有的进程
EXISTING_PID=$(pgrep -f "./symphony-agent")
if [ ! -z "$EXISTING_PID" ]; then
    echo "🔌 发现正在运行的 Symphony Agent (PID: $EXISTING_PID)，正在停止..."
    kill $EXISTING_PID
    sleep 1
fi

# 2. 检查配置文件
if [ ! -f "config.json" ]; then
    echo "❌ 错误: 未找到 config.json 配置文件。"
    exit 1
fi

# 3. 编译程序
echo "🔨 正在编译..."
go build -o symphony-agent .

if [ $? -eq 0 ]; then
    echo "✅ 编译成功。"
    # 4. 后台运行
    echo "📂 日志将输出到: $LOG_FILE"
    nohup ./symphony-agent -mode="server" > "$LOG_FILE" 2>&1 &
    echo "✅ 后台进程已启动 (PID: $!)。"
else
    echo "❌ 编译失败，请检查代码错误。"
    exit 1
fi
