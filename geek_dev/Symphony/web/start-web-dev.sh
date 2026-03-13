#!/bin/bash

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "🎨 正在以 DEV 模式启动 Symphony Web..."

# 1. 检查并杀掉已有的前端开发进程 (Vite)
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

# 3. 设置默认后端地址（开发环境）
echo "VITE_API_BASE_URL=http://localhost:4098" > .env

# 4. 启动开发服务器
npm run dev
