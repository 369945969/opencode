# manager.test.ts

## 文件信息

- **路径**: src/features/background-agent/manager.test.ts
- **目录**: src/features/background-agent
- **行数**: 2090

## 文件功能

这是一个测试文件,使用 Bun 测试框架编写。

## 接口定义

### CurrentMessage

- **定义位置**: 第757行
- **属性**: agent, gent, ent, nt, t, model, odel, del, el, l

## 类定义

### MockBackgroundManager

- **定义位置**: 第12行
- **方法**: Map, ap, p, addTask, ddTask, dTask, Task, ask, sk, k

## 函数定义

### createMockTask()

- **定义位置**: 第157行
- **参数**: `overrides: Partial<BackgroundTask> & { id: string; sessionID: string; parentSessionID: string }`
- **返回值**: `BackgroundTask`

### createBackgroundManager()

- **定义位置**: 第169行
- **返回值**: `BackgroundManager`

### getConcurrencyManager()

- **定义位置**: 第179行
- **参数**: `manager: BackgroundManager`
- **返回值**: `ConcurrencyManager`

### getTaskMap()

- **定义位置**: 第183行
- **参数**: `manager: BackgroundManager`
- **返回值**: `Map<string, BackgroundTask>`

### stubNotifyParentSession()

- **定义位置**: 第187行
- **参数**: `manager: BackgroundManager`

### tryCompleteTaskForTest()

- **定义位置**: 第191行
- **参数**: `manager: BackgroundManager, task: BackgroundTask`
- **返回值**: `Promise<boolean>`

### getCleanupSignals()

- **定义位置**: 第195行
- **返回值**: `Array<NodeJS.Signals | "beforeExit" | "exit">`

### getListenerCounts()

- **定义位置**: 第203行
- **参数**: `signals: Array<NodeJS.Signals | "beforeExit" | "exit">`
- **返回值**: `Record<string, number>`

### buildNotificationPromptBody()

- **定义位置**: 第873行
- **参数**: `task: BackgroundTask,
  currentMessage: CurrentMessage | null`
- **返回值**: `Record<string, unknown>`

## 常量定义

### TASK_TTL_MS

- **定义位置**: 第10行
- **值**: `30 * 60 * 1000`

## 依赖关系

- `bun:test`
- `node:os`
- `@opencode-ai/plugin`
- `./types`
- `./manager`
- `./concurrency`

## 代码统计

- 接口数量: 1
- 类数量: 1
- 函数数量: 9
- 常量数量: 1
- 类型定义数量: 0
- 导入模块数量: 6

