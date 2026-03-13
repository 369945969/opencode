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
npm run dev
