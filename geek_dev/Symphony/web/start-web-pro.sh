#!/bin/bash

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

PRO_API_URL="http://76.13.11.164:4098"
LOG_FILE="web-pro.log"

echo "🚀 正在以 PRO 模式启动 Symphony Web (生产环境: $PRO_API_URL)..."

# 1. 检查并杀掉已有的前端进程 (Vite)
EXISTING_PID=$(lsof -t -i:5173)
if [ ! -z "$EXISTING_PID" ]; then
    echo "🔌 发现正在运行的前端进程 (PID: $EXISTING_PID)，正在停止..."
    kill -9 $EXISTING_PID
    sleep 1
fi

# 2. 确保依赖已安装
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    npm install
fi

# 3. 设置生产环境后端地址
echo "VITE_API_BASE_URL=$PRO_API_URL" > .env

# 4. 后台启动开发服务器 (Vite 在生产环境通常用 npm run build + serve，
# 但基于您的需求，我们在后台运行 npm run dev)
echo "📂 日志将输出到: $LOG_FILE"
nohup npm run dev > "$LOG_FILE" 2>&1 &

echo "✅ Symphony Web 已在后台启动。"
echo "🔗 访问地址: http://localhost:5173"
