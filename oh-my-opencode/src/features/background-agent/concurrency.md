# Concurrency Manager

## 文件功能概述

`concurrency.ts` 实现了基于信号量的并发控制机制，用于限制同时运行的后台任务数量。支持按模型或代理配置不同的并发限制。

## 核心类：ConcurrencyManager

### 类概述

`ConcurrencyManager` 使用队列和计数器实现资源限制，确保不会超出配置的并发数。采用 settled-flag 模式防止竞态条件。

### 主要属性

```typescript
private config?: BackgroundTaskConfig    // 配置对象
private counts: Map<string, number>       // 当前计数（按模型）
private queues: Map<string, QueueEntry[]> // 等待队列（按模型）
```

### 接口定义

**QueueEntry**: 队列条目，包含解析/拒绝回调和 settled 标志

```typescript
interface QueueEntry {
  resolve: () => void      // 成功回调
  rawReject: (error: Error) => void  // 失败回调
  settled: boolean         // 是否已解决（防重复）
}
```

### 构造函数

```typescript
constructor(config?: BackgroundTaskConfig)
```

### 核心方法

#### getConcurrencyLimit(model: string): number

获取指定模型的并发限制，按优先级查找：
1. `config.modelConcurrency[model]`
2. `config.providerConcurrency[provider]`（从 model 提取 provider）
3. `config.defaultConcurrency`
4. 默认值：5

特殊值：0 表示无限制（Infinity）

#### acquire(model: string): Promise<void>

获取执行槽位：
- 如果无限制，立即返回
- 如果当前计数 < 限制，计数+1，立即返回
- 否则，加入等待队列，返回 Promise

```typescript
await concurrencyManager.acquire("anthropic/claude-opus-4-5")
// 现在可以执行任务
try {
  await runTask()
} finally {
  concurrencyManager.release("anthropic/claude-opus-4-5")
}
```

#### release(model: string): void

释放执行槽位：
1. 检查等待队列，将槽位传递给下一个等待者
2. 如果没有等待者，计数-1

#### cancelWaiters(model: string): void

取消指定模型的所有等待者，拒绝所有等待中的 Promise。

#### clear(): void

清理所有状态：
1. 取消所有等待者
2. 清空计数器
3. 清空队列

#### getCount(model: string): number

获取当前计数（调试用）。

#### getQueueLength(model: string): number

获取队列长度（调试用）。

## 配置示例

```typescript
const config: BackgroundTaskConfig = {
  defaultConcurrency: 5,           // 默认5个并发
  modelConcurrency: {
    "anthropic/claude-opus-4-5": 3,  // Opus 限制3个
    "openai/gpt-5.2": 10,            // GPT-5 限制10个
  },
  providerConcurrency: {
    "anthropic": 5,   // Anthropic 所有模型共5个
    "openai": 15,     // OpenAI 所有模型共15个
  },
}
```

## 并发控制流程

```
acquire(model)
  ↓
limit = getConcurrencyLimit(model)
  ↓
limit === Infinity?
  ├─ YES → 立即返回
  └─ NO → 继续
  ↓
current = counts.get(model) ?? 0
  ↓
current < limit?
  ├─ YES → counts.set(model, current + 1)，立即返回
  └─ NO → 加入队列，返回 Promise
```

```
release(model)
  ↓
检查 queues.get(model)
  ↓
队列非空？
  ├─ YES → 取出下一个未 settled 的 entry
  │        entry.resolve()
  │        // 槽位直接转移，计数不变
  └─ NO → counts.set(model, current - 1)
```

## 竞态条件防护

使用 `settled` 标志防止 `cancelWaiters` 和 `release` 之间的竞态：

```typescript
const entry: QueueEntry = {
  resolve: () => {
    if (entry.settled) return  // 已解决则跳过
    entry.settled = true
    resolve()
  },
  rawReject: reject,
  settled: false,
}
```

## 依赖关系

- `../../config/schema`: `BackgroundTaskConfig` 类型

## 注意事项

1. **必须配对使用**: `acquire` 和 `release` 必须成对调用
2. **异常处理**: 使用 try/finally 确保 release 被调用
3. **无限并发**: 设置为 0 表示无限制
4. **优先级**: model > provider > default
5. **队列顺序**: FIFO（先进先出）

## 使用示例

```typescript
import { ConcurrencyManager } from "./concurrency"

const manager = new ConcurrencyManager({
  defaultConcurrency: 3,
})

async function runWithLimit(model: string, task: () => Promise<void>) {
  await manager.acquire(model)
  try {
    await task()
  } finally {
    manager.release(model)
  }
}

// 并行执行，但最多3个同时运行
await Promise.all([
  runWithLimit("gpt-4", () => analyzeCode()),
  runWithLimit("gpt-4", () => refactorCode()),
  runWithLimit("gpt-4", () => testCode()),
  runWithLimit("gpt-4", () => deployCode()),  // 这个会等待
])
```
