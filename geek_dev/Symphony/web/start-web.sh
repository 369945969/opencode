#!/bin/bash

WEB_DIR="/Users/jack/typescript/opencode/geek_dev/Symphony/web"

echo "🎨 正在启动 Symphony Web 前端..."
cd "$WEB_DIR"

# 检查 node_modules 是否存在，不存在则安装
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    npm install
fi

# 启动开发服务器
# 如果环境变量 SYMPHONY_API_URL 存在，则写入 .env 文件
if [ ! -z "$SYMPHONY_API_URL" ]; then
    echo "🌐 设置后端地址为: $SYMPHONY_API_URL"
    echo "VITE_API_BASE_URL=$SYMPHONY_API_URL" > .env
fi

npm run dev
