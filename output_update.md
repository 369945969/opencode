
---

## 工具结果如何返回给大模型（详细说明）

### 关键问题
**工具执行结果会被返回给大模型吗？**

**答案：是的！** 工具执行结果会被包装成消息返回给大模型，大模型在下一轮对话中可以看到。

### 完整流程示例

以第一次工具调用 `ls -la` 为例，展示完整的双向交互过程：

#### 第1轮：大模型决策调用工具

**大模型的完整响应**（从 server.log 行 606-667）:
```json
{
  "text": "我来帮你实现一个五子棋小游戏，后端用Go，前端用Web。让我先了解当前项目结构。",
  "toolCalls": [
    {
      "type": "tool-call",
      "toolCallId": "call_946f5a6babf94d8581d4e9a7",
      "toolName": "bash",
      "input": {
        "command": "ls -la",
        "description": "List directory contents"
      }
    }
  ],
  "finishReason": "tool-calls"
}
```

#### 第2步：系统执行工具

系统执行 `bash ls -la` 命令，得到输出结果：
```
total 96
drwxr-xr-x  18 jack  staff    576  2月  1 10:45 .
drwxr-xr-x  19 jack  staff    608  2月  1 09:09 ..
-rw-r--r--   1 jack  staff     58  2月  1 09:09 .gitignore
drwxr-xr-x@  3 jack  staff     96  2月  1 09:40 .turbo
-rw-r--r--   1 jack  staff   1404  2月  1 09:09 AGENTS.md
drwxr-xr-x   3 jack  staff     96  2月  1 09:09 bin
-rw-r--r--   1 jack  staff    127  2月  1 09:09 bunfig.toml
drwxr-xr-x@  5 jack  staff    160  2月  1 10:45 dist
drw-r--r--   1 jack  staff    593  2月  1  09:09 Dockerfile
...
```

#### 第3步：系统将结果包装成 tool 消息

**关键！** 系统将工具执行结果包装成一个新的消息（server.log 行 686-703）:
```json
{
  "role": "tool",
  "content": [
    {
      "type": "tool-result",
      "toolCallId": "call_946f5a6babf94d8581d4e9a7",
      "toolName": "bash",
      "output": {
        "type": "text",
        "value": "total 96\ndrwxr-xr-x  18 jack  staff    576  2月  1 10:45 .\ndrwxr-xr-x  19 jack  staff    608  2月  1  09:09 ..\n-rw-r--r--   1 jack  staff     58  2月  1 09:09 .gitignore\ndrwxr-xr-x@  3 jack  staff     96  2月  1 09:40 .turbo\n-rw-r--r--   1 jack  staff   1404  2月  1 09:09 AGENTS.md\ndrwxr-xr-x   3 jack  staff     96  2月  1 09:09 bin\n-rw-r--r--   1 jack  staff    127  2月  1 09:09 bunfig.toml\ndrwxr-xr-x@  5 jack  staff    160  2月  1 10:45 dist\n-rw-r--r--   1 jack  staff    593  2月  1 09:09 Dockerfile\ndrwxr-xr-x@ 56 jack  staff   1792  2月  1 09:15 node_modules\n-rw-r--r--@  1 jack  staff   4373  2月  1 10:45 package.json\n-rw-r--r--   1 jack  staff  10748  2月  1 09:09 parsers-config.ts\n-rw-r--r--   1 jack  staff    217  2月  1 09:09 README.md\ndrwxr-xr-x   7 jack  staff    224  2月  1 09:09 script\ndrwxr-xr-x  40 jack  staff   1280  2月  1 09:43 src\n-rw-r--r--   1 jack  staff    192  2月  1 09:09 sst-env.d.ts\ndrwxr-xr-x  28 jack  staff    896  2月  1 09:09 test\n-rw-r--r--   1 jack  staff    419  2月  1 09:09 tsconfig.json\n"
      }
    }
  ]
}
```

**关键点解析**:
- `"role": "tool"` - 标识这是一个工具执行结果，不是普通消息
- `"toolCallId": "call_946f5a6babf94d8581d4e9a7"` - 与之前的工具调用ID精确匹配
- `"type": "tool-result"` - 标识这是工具结果类型
- `"output"` - 包含工具的完整输出（目录列表）

#### 第4步：tool 消息被添加到对话历史

**下一次发送给大模型时**，完整的消息数组会包含：
```json
[
  {
    "role": "system",
    "content": "...完整的 system prompt..."
  },
  {
    "role": "user",
    "content": [{"type": "text", "text": "hi"}]
  },
  {
    "role": "assistant",
    "content": [{"type": "reasoning", "text": "..."}, {"type": "text", "text": "Hi! How can I help you today?"}]
  },
  {
    "role": "user",
    "content": [{"type": "text", "text": "hi"}]
  },
  {
    "role": "assistant",
    "content": [{"type": "reasoning", "text": "..."}, {"type": "text", "text": "Hi! What can I help you with?"}]
  },
  {
    "role": "user",
    "content": [{"type": "text", "text": "帮我写一个五子棋的小游戏，后端用 Go，前端用 Web。"}]
  },
  {
    "role": "assistant",
    "content": "我来帮你实现一个五子棋小游戏...",
    "toolCalls": [{
      "type": "tool-call",
      "toolCallId": "call_946f5a6babf94d8581d4e9a7",
      "toolName": "bash",
      "input": {"command": "ls -la", "description": "List directory contents"}
    }]
  },
  {
    "role": "tool",  // ← 新增！工具执行结果
    "content": [{
      "type": "tool-result",
      "toolCallId": "call_946f5a6babf94d8581d4e9a7",
      "toolName": "bash",
      "output": {"type": "text", "value": "total 96\n..."}
    }]
  }
]
```

#### 第5步：大模型基于工具结果做下一步决策

**大模型看到工具结果后**，返回下一步的响应（server.log 行 705-753）:
```json
{
  "role": "assistant",
  "content": [
    {
      "type": "reasoning",
      "text": "看起来这是一个TypeScript/Bun项目，不是Go项目。用户想要创建一个使用Go后端和Web前端的五子棋游戏。\n\n我有两个选择：\n1. 在当前项目中创建一个新的目录来放置这个五子棋游戏\n2. 询问用户是否想要在单独的位置创建\n\n由于当前项目看起来是一个TypeScript项目（可能是opencode本身），创建五子棋游戏可能会不太合适。最好询问用户是否想要在单独的位置创建这个游戏。\n\n但是用户只是简单地要求我帮他写一个五子棋游戏，没有指定具体位置。我可以：\n1. 直接在当前目录下创建一个新的子目录来放五子棋游戏\n2. 询问用户想要在哪里创建\n\n根据指南：\"Prefer automation: execute requested actions without confirmation unless blocked by missing info or safety/irreversibility.\"\n所以我应该直接执行，在当前目录下创建一个新的子目录来放置五子棋游戏。\n\n让我创建一个目录结构：\n- gomoku/\n  - backend/  (Go后端)\n  - frontend/ (Web前端)\n\n然后我将实现简单的五子棋游戏。"
    },
    {
      "type": "tool-call",
      "toolCallId": "call_835407b9ba4a495da4551092",
      "toolName": "bash",
      "input": {
        "command": "mkdir -p gomoku/backend gomoku/frontend",
        "description": "Create directories for gomoku game"
      }
    }
  ]
}
```

**关键观察**：
- 大模型的 reasoning 明确提到"看起来这是一个TypeScript/Bun项目，不是Go项目"
- 这证明大模型**看到了** `ls -la` 的结果（显示有 package.json, bunfig.toml, tsconfig.json 等）
- 基于这个观察，大模型才决定创建新的 gomoku 目录

### 关键技术细节

#### 1. role: "tool" 的作用
`role: "tool"` 是 OpenAI 函数工具（Function Calling）的标准设计：

- `"role": "system"` - 系统提示词
- `"role": "user"` - 用户消息
- `"role": "assistant"` - AI响应（可能包含 toolCalls 或纯文本）
- `"role": "tool"` - **工具执行结果** ← 这是关键！

#### 2. toolCallId 的匹配机制
每个工具调用都有一个唯一的 ID：
```json
大模型的响应：  { "toolCallId": "call_946f5a6babf94d8581d4e9a7", ... }
工具结果返回：  { "toolCallId": "call_946f5a6babf94d8581d4e9a7", ... }
```

**为什么需要 toolCallId？**
- 支持并行调用多个工具
- 每个工具结果需要精确匹配到对应的工具调用
- 大模型可以知道哪个结果对应哪个工具调用

#### 3. 完整的双向通信流程

```
┌─────────────────────────────────────────────────────────────────┐
│  第一次请求发送给大模型                                           │
├─────────────────────────────────────────────────────────────────┤
│  messages: [                                                    │
│    {role: "system", ...},                                        │
│    {role: "user", "hi"},                                        │
│    {role: "assistant", "Hi!..."},                                 │
│    {role: "user", "hi"},                                        │
│    {role: "assistant", "Hi! What..."},                            │
│    {role: "user", "帮我写一个五子棋..."}                          │
│  ]                                                               │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  大模型响应（带工具调用）                                          │
├─────────────────────────────────────────────────────────────────┤
│  {                                                               │
│    "text": "我来帮你实现...",                                     │
│    "toolCalls": [{                                               │
│      "type": "tool-call",                                        │
│      "toolCallId": "call_946f5a6babf94d8581d4e9a7",             │
│      "toolName": "bash",                                         │
│      "input": {"command": "ls -la", ...}                         │
│    }]                                                             │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  系统执行工具：bash ls -la                                        │
│  得到结果：目录列表                                               │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  系统将结果包装成消息                                              │
├─────────────────────────────────────────────────────────────────┤
│  {                                                               │
│    "role": "tool",                                               │
│    "content": [{                                                 │
│      "type": "tool-result",                                     │
│      "toolCallId": "call_946f5a6babf94d8581d4e9a7",             │
│      "toolName": "bash",                                         │
│      "output": {"type": "text", "value": "total 96\n..."}        │
│    }]                                                             │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  第二次请求发送给大模型（包含工具结果）                              │
├─────────────────────────────────────────────────────────────────┤
│  messages: [                                                    │
│    {role: "system", ...},                                        │
│    {role: "user", "hi"},                                        │
│    {role: "assistant", "Hi!..."},                                 │
│    {role: "user", "hi"},                                        │
│    {role: "assistant", "Hi! What..."},                            │
│    {role: "user", "帮我写一个五子棋..."},                          │
│    {role: "assistant", [toolCall: ls -la]},                    │
│    {role: "tool", [tool-result: 目录列表]}  ← 新增！            │
│  ]                                                               │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  大模型基于工具结果继续决策                                        │
│  "虽然这是 TypeScript 项目，但我应该在 gomoku 目录下创建..."       │
│  调用下一个工具: mkdir -p gomoku/backend gomoku/frontend         │
└─────────────────────────────────────────────────────────────────┘
```

#### 4. LSP 错误的自动修复

另一个工具结果反馈的例子：

**工具执行结果**（写 main.go 后）:
```json
{
  "role": "tool",
  "content": [{
    "type": "tool-result",
    "toolCallId": "call_dc9a33b2c83040369642d0aa",
    "toolName": "write",
    "output": {
      "type": "text",
      "value": "Wrote file successfully.\n\nLSP errors detected in this file, please fix:\n<diagnostics file=\"/Users/jack/typescript/opencode/packages/opencode/gomoku/backend/main.go\">\nERROR [9:2] could not import github.com/gorilla/websocket (cannot find package \"github.com/gorilla/websocket\" in GOROOT)\n</diagnostics>"
    }
  }]
}
```

**大模型看到 LSP 错误后**，在 reasoning 中说：
> "我收到了一个LSP错误，说找不到gorilla/websocket包。这是因为Go模块还没有初始化。我需要创建go.mod文件并安装依赖。"

然后大模型**主动决策**创建 go.mod 文件来解决问题。

### 日志中的证据位置

| 日志行号 | 内容 |
|---------|------|
| 606-667 | 大模型返回 toolCall（ls -la） |
| 686-703 | 工具执行结果返回（role: "tool"） |
| 705-753 | 大模型基于工具结果的下一步响应（mkdir） |
| 788-794 | 工具执行结果返回（mkdir 成功） |
| 795-900+ | 大模型基于结果返回下一个工具调用（写 Go 代码） |
| 900-920 | 工具执行结果返回（写文件 + LSP 错误） |
| 921-940 | 大模型看到 LSP 错误，创建 go.mod |

### 总结

**工具执行结果确实会返回给大模型！**

1. **双向通信**：这不是单向的"大模型命令→系统执行"，而是完整的"大模型→系统→大模型→系统"循环
2. **tool role**：工具结果使用 `role: "tool"` 被包装成消息
3. **ID 匹配**：`toolCallId` 确保结果与调用精确对应
4. **完整的上下文**：大模型在下一轮可以看到所有工具的执行结果
5. **智能决策**：大模型基于工具结果做出智能决策（看到 LSP 错误后自动创建 go.mod）

这就是为什么大模型能够：
- 看到 `ls -la` 结果后说"这是一个TypeScript/Bun项目"
- 看到 LSP 错误后自动创建 go.mod
- 看到文件创建成功后继续下一步

**这一切都建立在对工具执行结果的完整反馈上！**
