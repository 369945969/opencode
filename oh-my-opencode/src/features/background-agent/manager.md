# Background Manager

## 文件功能概述

`manager.ts` 是后台代理模块的核心实现文件，包含 `BackgroundManager` 类，负责任务的完整生命周期管理，包括创建、执行、监控、完成处理和通知。

## 核心类：BackgroundManager

### 类概述

`BackgroundManager` 是一个单例管理器，负责管理所有后台任务的执行。它实现了任务队列、并发控制、状态轮询和事件处理机制。

### 主要属性

```typescript
private tasks: Map<string, BackgroundTask>              // 任务存储
private notifications: Map<string, BackgroundTask[]>   // 待通知任务
private pendingByParent: Map<string, Set<string>>      // 父会话的待处理任务
private client: OpencodeClient                          // OpenCode 客户端
private directory: string                               // 工作目录
private pollingInterval?: ReturnType<typeof setInterval>  // 轮询定时器
private concurrencyManager: ConcurrencyManager         // 并发管理器
private shutdownTriggered = false                       // 关闭标志
private config?: BackgroundTaskConfig                   // 配置
private tmuxEnabled: boolean                           // Tmux 集成开关
private queuesByKey: Map<string, QueueItem[]>          // 按并发键分组的队列
private processingKeys: Set<string>                    // 正在处理的键
```

### 构造函数

```typescript
constructor(
  ctx: PluginInput,
  config?: BackgroundTaskConfig,
  options?: {
    tmuxConfig?: TmuxConfig
    onSubagentSessionCreated?: OnSubagentSessionCreated
    onShutdown?: () => void
  }
)
```

**参数说明：**
- `ctx`: 插件上下文，包含 client 和 directory
- `config`: 后台任务配置（可选）
- `options`: 额外选项，包括 tmux 配置和回调函数

### 核心方法

#### 任务管理

**launch(input: LaunchInput): Promise<BackgroundTask>**
启动新任务。创建任务对象，添加到队列，触发处理流程。

```typescript
const task = await manager.launch({
  description: "分析代码",
  prompt: "请分析 src/ 目录",
  agent: "analyzer",
  parentSessionID: "session-123",
  parentMessageID: "msg-456",
})
```

**resume(input: ResumeInput): Promise<BackgroundTask>**
恢复已暂停的任务。重新获取并发槽位，更新状态，发送恢复提示。

**trackTask(input): Promise<BackgroundTask>**
跟踪外部创建的任务（如 delegate_task 工具创建的任务）。

**cancelPendingTask(taskId: string): boolean**
取消待处理的任务。从队列中移除并标记为 cancelled。

#### 状态查询

**getTask(id: string): BackgroundTask | undefined**
获取指定任务的状态。

**getTasksByParentSession(sessionID: string): BackgroundTask[]**
获取指定父会话的所有任务。

**getAllDescendantTasks(sessionID: string): BackgroundTask[]**
递归获取所有后代任务。

**getRunningTasks(): BackgroundTask[]**
获取所有运行中的任务。

**getCompletedTasks(): BackgroundTask[]**
获取所有已完成的任务。

#### 事件处理

**handleEvent(event: Event): void**
处理会话事件：
- `message.part.updated`: 更新工具调用计数
- `session.idle`: 触发任务完成检查
- `session.deleted`: 清理任务状态

#### 通知管理

**markForNotification(task: BackgroundTask): void**
标记任务需要通知父会话。

**getPendingNotifications(sessionID: string): BackgroundTask[]**
获取指定会话的待通知任务。

**clearNotifications(sessionID: string): void**
清除指定会话的通知队列。

#### 生命周期管理

**shutdown(): void**
优雅关闭管理器：
1. 停止轮询
2. 中止所有运行中的会话
3. 释放所有并发槽位
4. 清理所有状态

### 私有方法

#### 队列处理

**processKey(key: string): Promise<void>**
处理指定并发键的队列，按顺序启动任务。

**startTask(item: QueueItem): Promise<void>**
启动具体任务：
1. 创建子会话
2. 调用 tmux 回调（如启用）
3. 更新任务状态
4. 发送 prompt 启动代理

#### 状态检测

**pollRunningTasks(): Promise<void>**
轮询所有运行中的任务，检测完成状态。

**tryCompleteTask(task: BackgroundTask, source: string): Promise<boolean>**
尝试完成任务，包含竞态条件保护。

**validateSessionHasOutput(sessionID: string): Promise<boolean>**
验证会话是否有实际输出，防止过早完成。

**checkSessionTodos(sessionID: string): Promise<boolean>**
检查会话是否有未完成的待办事项。

#### 通知发送

**notifyParentSession(task: BackgroundTask): Promise<void>**
向父会话发送任务完成通知，支持批量通知。

#### 清理维护

**pruneStaleTasksAndNotifications(): void**
清理超时的任务和通知（30分钟TTL）。

**checkAndInterruptStaleTasks(): Promise<void>**
检查并中断长时间无活动的任务。

**cleanupPendingByParent(task: BackgroundTask): void**
从父会话的待处理集合中移除任务。

### 常量定义

```typescript
const TASK_TTL_MS = 30 * 60 * 1000           // 任务超时时间：30分钟
const MIN_STABILITY_TIME_MS = 10 * 1000      // 最小稳定检测时间：10秒
const DEFAULT_STALE_TIMEOUT_MS = 180_000     // 默认无活动超时：3分钟
const MIN_RUNTIME_BEFORE_STALE_MS = 30_000   // 最小运行时间：30秒
```

## 代码逻辑流程

### 任务启动序列

```
launch(input)
  ↓
创建 BackgroundTask 对象（status=pending）
  ↓
添加到 queuesByKey（按并发键分组）
  ↓
触发 processKey(key)
  ↓
acquire(key) 获取并发槽位
  ↓
startTask(item)
  ↓
  ├─ 创建子会话
  ├─ 调用 onSubagentSessionCreated（tmux）
  ├─ 更新 status=running
  ├─ 启动轮询
  └─ 发送 prompt 启动代理
```

### 任务完成检测序列

```
pollRunningTasks()
  ↓
检查 session.status
  ↓
validateSessionHasOutput() - 验证有实际输出
  ↓
checkSessionTodos() - 检查待办事项
  ↓
tryCompleteTask(task, source)
  ↓
  ├─ 原子性标记 status=completed
  ├─ release(key) 释放并发槽位
  ├─ markForNotification(task)
  └─ notifyParentSession(task)
```

### 事件处理序列

```
handleEvent(event)
  ↓
session.idle
  ↓
检查 elapsedMs >= MIN_IDLE_TIME_MS
  ↓
validateSessionHasOutput()
  ↓
checkSessionTodos()
  ↓
tryCompleteTask()
```

## 并发控制机制

### 并发键生成

```typescript
private getConcurrencyKeyFromInput(input: LaunchInput): string {
  if (input.model) {
    return `${input.model.providerID}/${input.model.modelID}`
  }
  return input.agent
}
```

### 队列结构

```typescript
private queuesByKey: Map<string, QueueItem[]>
// key: "anthropic/claude-opus-4-5" 或 "analyzer"
// value: [{ task, input }, ...]
```

## 稳定性检测算法

```typescript
// 1. 记录当前消息数
const currentMsgCount = messages.length

// 2. 检查是否达到最小运行时间
if (elapsedMs >= MIN_STABILITY_TIME_MS) {
  // 3. 检查消息数是否连续3次不变
  if (task.lastMsgCount === currentMsgCount) {
    task.stablePolls = (task.stablePolls ?? 0) + 1
    if (task.stablePolls >= 3) {
      // 4. 重新检查 session 状态
      // 5. 验证输出和待办事项
      // 6. 完成任务
    }
  } else {
    task.stablePolls = 0
  }
}
task.lastMsgCount = currentMsgCount
```

## 依赖关系

### 内部依赖
- `./types`: 类型定义
- `./concurrency`: ConcurrencyManager
- `../../config/schema`: 配置类型
- `../../shared`: 日志、工具限制
- `../../shared/tmux`: Tmux 检测
- `../claude-code-session-state`: 子会话跟踪
- `../task-toast-manager`: 任务通知
- `../hook-message-injector`: 消息字段查找

### 外部依赖
- `@opencode-ai/plugin`: OpenCode SDK
- `node:fs`: 文件系统
- `node:path`: 路径处理

## 注意事项

1. **竞态条件保护**: `tryCompleteTask` 使用原子状态检查防止重复完成
2. **资源泄漏防护**: 所有路径都确保释放并发槽位
3. **信号安全**: 注册进程信号处理器进行优雅关闭
4. **异步安全**: 轮询中的异步操作后重新检查状态
5. **Tmux 集成**: 支持在 tmux 中自动创建窗格显示子会话
6. **批量通知**: 多个任务完成时合并为一条通知
7. **超时处理**: 多层次超时机制（TTL、stale、stability）

## 使用示例

```typescript
import { BackgroundManager } from "./manager"
import { ConcurrencyManager } from "./concurrency"

// 创建管理器
const manager = new BackgroundManager(
  pluginContext,
  {
    defaultConcurrency: 5,
    modelConcurrency: {
      "anthropic/claude-opus-4-5": 3,
    },
    staleTimeoutMs: 180000,
  },
  {
    tmuxConfig: { enabled: true },
    onSubagentSessionCreated: async (event) => {
      // 在 tmux 中创建窗格
      console.log(`Session ${event.sessionID} created`)
    },
  }
)

// 启动任务
const task = await manager.launch({
  description: "代码重构",
  prompt: "重构 src/utils.ts 文件",
  agent: "refactor-agent",
  parentSessionID: ctx.sessionID,
  parentMessageID: ctx.messageID,
  model: {
    providerID: "anthropic",
    modelID: "claude-opus-4-5",
  },
})

// 监听事件
plugin.onEvent((event) => {
  manager.handleEvent(event)
})

// 关闭时清理
process.on("SIGINT", () => {
  manager.shutdown()
})
```
