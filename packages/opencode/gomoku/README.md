# 五子棋游戏

一个简单的五子棋小游戏，支持双人在线对战。

## 技术栈

- **后端**: Go + WebSocket
- **前端**: HTML + CSS + JavaScript

## 如何运行

### 前置要求

- Go 1.21+
- 现代浏览器

### 启动后端

```bash
cd backend
go mod download
go run main.go
```

服务器将在 `localhost:8080` 启动。

### 前端访问

直接在浏览器中打开 `frontend/index.html` 文件即可。

## 游戏规则

1. 黑棋先手
2. 双方轮流落子
3. 五子连成一线（横、竖、斜）即获胜

## 功能特性

- 实时WebSocket通信
- 双人在线对战
- 漂亮的渐变UI设计
- 胜负判定和显示
