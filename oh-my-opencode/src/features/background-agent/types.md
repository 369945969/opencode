# Background Agent Types

## 文件功能概述

定义后台代理模块的所有类型接口和枚举，为任务管理、状态跟踪和输入参数提供类型安全保证。

## 主要类型定义

### BackgroundTaskStatus

任务状态枚举，表示任务在其生命周期中的当前状态。

```typescript
export type BackgroundTaskStatus =
  | "pending"      // 等待执行
  | "running"      // 正在执行
  | "completed"    // 已完成
  | "error"        // 执行出错
  | "cancelled"    // 已取消
```

### TaskProgress

任务进度信息，用于跟踪任务执行过程中的活动。

```typescript
export interface TaskProgress {
  toolCalls: number           // 工具调用次数
  lastTool?: string          // 最后调用的工具
  lastUpdate: Date           // 最后更新时间
  lastMessage?: string       // 最后消息内容
  lastMessageAt?: Date       // 最后消息时间
}
```

### BackgroundTask

核心任务对象接口，包含任务的完整信息。

```typescript
export interface BackgroundTask {
  id: string                 // 唯一标识符
  sessionID?: string         // OpenCode 会话ID
  parentSessionID: string    // 父会话ID
  parentMessageID: string    // 父消息ID
  description: string        // 任务描述
  prompt: string            // 任务提示词
  agent: string             // 执行代理名称
  status: BackgroundTaskStatus  // 当前状态
  queuedAt?: Date           // 入队时间
  startedAt?: Date          // 开始时间
  completedAt?: Date        // 完成时间
  result?: string           // 执行结果
  error?: string            // 错误信息
  progress?: TaskProgress   // 进度信息
  parentModel?: { providerID: string; modelID: string }  // 父会话模型
  model?: {                  // 任务使用的模型
    providerID: string
    modelID: string
    variant?: string
  }
  concurrencyKey?: string    // 并发槽位键
  concurrencyGroup?: string  // 持久化并发组
  parentAgent?: string       // 父代理名称
  lastMsgCount?: number      // 消息数量（用于稳定性检测）
  stablePolls?: number       // 连续稳定轮询次数
}
```

### LaunchInput

启动新任务的输入参数。

```typescript
export interface LaunchInput {
  description: string        // 任务描述
  prompt: string            // 任务提示词
  agent: string             // 执行代理
  parentSessionID: string   // 父会话ID
  parentMessageID: string   // 父消息ID
  parentModel?: { providerID: string; modelID: string }  // 父模型
  parentAgent?: string      // 父代理
  model?: {                  // 指定模型
    providerID: string
    modelID: string
    variant?: string
  }
  skills?: string[]         // 技能列表
  skillContent?: string     // 技能内容
}
```

### ResumeInput

恢复任务的输入参数。

```typescript
export interface ResumeInput {
  sessionId: string         // 要恢复的会话ID
  prompt: string           // 新的提示词
  parentSessionID: string  // 父会话ID
  parentMessageID: string  // 父消息ID
  parentModel?: { providerID: string; modelID: string }  // 父模型
  parentAgent?: string     // 父代理
}
```

## 使用示例

```typescript
import type { BackgroundTask, LaunchInput, TaskProgress } from "./types"

// 创建任务对象
const task: BackgroundTask = {
  id: `bg_${crypto.randomUUID().slice(0, 8)}`,
  status: "pending",
  description: "代码分析任务",
  prompt: "分析 src/ 目录结构",
  agent: "analyzer",
  parentSessionID: "parent-123",
  parentMessageID: "msg-456",
  queuedAt: new Date(),
}

// 更新进度
const progress: TaskProgress = {
  toolCalls: 5,
  lastTool: "read_file",
  lastUpdate: new Date(),
  lastMessage: "正在读取文件...",
}

task.progress = progress
task.status = "running"
```

## 设计考量

1. **可选字段**: 使用 `?` 标记可选字段，允许渐进式填充
2. **时间戳**: 使用 `Date` 类型记录关键时间点
3. **嵌套对象**: 模型信息使用嵌套对象保持清晰
4. **扩展性**: 预留 `progress` 等字段支持状态跟踪

## 相关文件

- `manager.ts`: 使用这些类型实现任务管理
- `concurrency.ts`: 使用并发键进行资源控制
