# Background Agent Module

## 文件功能概述

`background-agent` 模块是 OpenCode 插件的核心功能模块，用于管理后台任务的完整生命周期。它提供了任务队列、并发控制、状态监控和通知机制，支持在后台异步执行 AI 代理任务。

## 主要组件

### 1. BackgroundManager 类 (manager.ts)

核心管理器类，负责后台任务的创建、执行、监控和完成处理。

**主要功能：**
- **任务生命周期管理**: 创建、启动、暂停、恢复、取消任务
- **并发控制**: 通过 ConcurrencyManager 管理资源使用
- **状态轮询**: 定期检查任务执行状态
- **事件处理**: 响应 session.idle、session.deleted 等事件
- **通知机制**: 任务完成后通知父会话

**关键方法：**
- `launch(input: LaunchInput)`: 启动新任务
- `resume(input: ResumeInput)`: 恢复已暂停的任务
- `trackTask(input)`: 跟踪外部创建的任务
- `handleEvent(event)`: 处理会话事件
- `cancelPendingTask(taskId)`: 取消待处理任务
- `shutdown()`: 优雅关闭管理器

### 2. ConcurrencyManager 类 (concurrency.ts)

并发控制管理器，实现基于信号量的资源限制机制。

**主要功能：**
- 按模型/代理限制并发数
- 支持队列等待机制
- 可配置的并发限制（默认5）

**关键方法：**
- `acquire(model)`: 获取执行槽位
- `release(model)`: 释放执行槽位
- `getConcurrencyLimit(model)`: 获取限制配置

### 3. 类型定义 (types.ts)

定义了任务状态、进度、输入参数等核心类型。

**主要类型：**
- `BackgroundTaskStatus`: 任务状态枚举（pending/running/completed/error/cancelled）
- `BackgroundTask`: 任务对象接口
- `TaskProgress`: 任务进度信息
- `LaunchInput`/`ResumeInput`: 启动/恢复输入参数

## 代码逻辑流程

### 任务启动流程

```
1. launch() 接收任务输入
   ↓
2. 创建任务对象（status = pending）
   ↓
3. 添加到队列（按并发键分组）
   ↓
4. 触发 processKey() 处理队列
   ↓
5. acquire() 获取并发槽位
   ↓
6. startTask() 创建会话并启动
   ↓
7. 更新状态为 running，启动轮询
```

### 任务完成检测

```
1. 轮询检查 (pollRunningTasks)
   ↓
2. 检查 session 状态
   ↓
3. 验证输出内容（防误报）
   ↓
4. 检查待办事项完整性
   ↓
5. 调用 tryCompleteTask()
   ↓
6. 释放并发槽位
   ↓
7. 通知父会话
```

### 稳定性检测机制

- 监控消息数量变化
- 连续3次轮询消息数不变视为稳定
- 结合 session.idle 事件确认完成

## 使用示例

```typescript
import { BackgroundManager } from "./manager"
import type { LaunchInput } from "./types"

// 创建管理器实例
const manager = new BackgroundManager(pluginContext, config)

// 启动后台任务
const task = await manager.launch({
  description: "分析代码库",
  prompt: "请分析 src/ 目录下的所有 TypeScript 文件",
  agent: "code-analyzer",
  parentSessionID: "session-123",
  parentMessageID: "msg-456",
})

// 获取任务状态
const status = manager.getTask(task.id)

// 恢复任务
await manager.resume({
  sessionId: task.sessionID!,
  prompt: "继续分析",
  parentSessionID: "session-123",
  parentMessageID: "msg-789",
})

// 取消待处理任务
manager.cancelPendingTask(task.id)

// 关闭管理器
manager.shutdown()
```

## 依赖关系

### 内部依赖
- `../task-toast-manager`: 任务通知管理
- `../claude-code-session-state`: 子代理会话跟踪
- `../hook-message-injector`: 消息字段查找
- `../../shared`: 日志、工具限制、tmux 检测
- `../../config/schema`: 配置类型定义

### 外部依赖
- `@opencode-ai/plugin`: OpenCode 插件 SDK
- `node:fs`: 文件系统操作
- `node:path`: 路径处理

## 注意事项

1. **并发安全**: ConcurrencyManager 使用 settled-flag 模式防止双重解析
2. **资源清理**: shutdown() 方法会中止所有运行中的会话并释放资源
3. **超时处理**: 任务默认30分钟超时，可配置 staleTimeoutMs
4. **信号处理**: 注册 SIGINT/SIGTERM 处理器进行优雅关闭
5. **稳定性检测**: 需要至少运行10秒后才启动稳定性检测
6. **输出验证**: 通过 validateSessionHasOutput() 防止过早完成标记
7. **Tmux 集成**: 支持在 tmux 环境中自动创建窗格

## 配置选项

```typescript
interface BackgroundTaskConfig {
  defaultConcurrency?: number        // 默认并发限制
  modelConcurrency?: Record<string, number>  // 按模型配置
  providerConcurrency?: Record<string, number>  // 按提供商配置
  staleTimeoutMs?: number            // 无活动超时（默认3分钟）
}
```
