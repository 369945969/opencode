# runner.ts

## 文件功能概述

`runner.ts` 是 run 模块的核心实现，负责创建 OpenCode 会话、发送提示、处理事件流，并监控任务完成状态。它实现了完整的任务生命周期管理，包括超时控制、错误处理和优雅关闭。

## 主要函数详细说明

### `run(options: RunOptions): Promise<number>`

主运行函数，执行完整的任务流程。

#### 参数
- `options.message`: 要执行的任务描述
- `options.agent?`: 指定使用的 Agent 名称
- `options.directory?`: 工作目录（默认当前目录）
- `options.timeout?`: 超时时间（毫秒，0=无限制）

#### 返回值
- `0`: 任务成功完成
- `1`: 执行出错
- `130`: 被中断或超时

#### 执行流程

1. **初始化**
   - 解析参数和选项
   - 设置超时定时器（如果指定）

2. **创建 OpenCode 客户端**
   - 支持自定义端口和主机名（环境变量）
   - 设置信号控制器用于取消

3. **清理设置**
   - 注册 SIGINT 处理程序
   - 设置清理函数关闭服务器

4. **会话创建**
   - 带重试机制的会话创建
   - 指数退避策略（1s, 2s, 3s）
   - 最大 3 次重试

5. **事件订阅**
   - 订阅 OpenCode 事件流
   - 创建事件状态对象
   - 启动事件处理器

6. **发送提示**
   - 使用 `promptAsync` 发送任务描述
   - 指定 Agent 和工作目录

7. **监控循环**
   - 每 500ms 检查一次状态
   - 检查会话错误
   - 检查完成条件（todos + 子会话）
   - 超时或完成时退出

8. **清理和退出**
   - 清理资源
   - 返回退出码

## 代码逻辑流程

```
run(options)
├── 参数解析和超时设置
├── createOpencode({ signal, port?, hostname? })
├── 设置 cleanup() 和 SIGINT 处理
├── 会话创建（带重试）
│   ├── 尝试 1
│   ├── 延迟 1s → 尝试 2
│   └── 延迟 2s → 尝试 3
├── client.event.subscribe()
├── createEventState()
├── client.session.promptAsync()
└── 监控循环
    ├── 每 500ms 检查
    ├── 检查 sessionError
    ├── checkCompletionConditions()
    │   ├── areAllTodosComplete()
    │   └── areAllChildrenIdle()
    └── 完成或超时 → 退出
```

## 错误处理

### 会话创建失败
- 记录每次失败原因
- 重试直到成功或达到最大次数
- 最终失败返回退出码 1

### 会话错误
- 检测 `session.error` 事件
- 记录错误信息
- 立即退出并返回退出码 1

### 超时
- 超时触发 AbortController
- 优雅关闭服务器
- 返回退出码 130

### 中断 (SIGINT)
- 捕获 SIGINT 信号
- 执行清理
- 返回退出码 130

## 使用示例

```typescript
import { run } from "./runner"

// 简单任务
await run({ message: "Fix the bug" })

// 指定 Agent
await run({
  message: "Implement feature",
  agent: "Sisyphus",
})

// 完整配置
await run({
  message: "Large refactoring",
  agent: "Sisyphus",
  directory: "/path/to/project",
  timeout: 3600000, // 1小时
})
```

## 依赖关系

### 外部依赖
- `@opencode-ai/sdk`: OpenCode SDK
- `picocolors`: 终端颜色

### 内部依赖
- `./types`: RunOptions, RunContext 类型
- `./completion`: checkCompletionConditions
- `./events`: createEventState, processEvents, serializeError

## 注意事项

1. **超时设置**: 0 表示无超时限制，任务会一直运行到完成
2. **重试机制**: 会话创建有 3 次重试机会，使用指数退避
3. **环境变量**: 支持 `OPENCODE_SERVER_PORT` 和 `OPENCODE_SERVER_HOSTNAME`
4. **信号处理**: 正确处理 SIGINT 信号，确保资源清理
5. **轮询间隔**: 固定 500ms，可根据需要调整
