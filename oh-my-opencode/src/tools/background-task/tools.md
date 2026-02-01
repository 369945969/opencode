# tools.ts

## 文件信息

- **路径**: src/tools/background-task/tools.ts
- **目录**: src/tools/background-task
- **行数**: 518

## 文件功能

提供了 9 个函数/工具,用于实现特定功能。

## 函数定义

### getMessageDir()

- **定义位置**: 第14行
- **参数**: `sessionID: string`
- **返回值**: `string | null`

### formatDuration()

- **定义位置**: 第28行
- **参数**: `start: Date, end?: Date`
- **返回值**: `string`

### createBackgroundTask()

- **定义位置**: 第51行
- **参数**: `manager: BackgroundManager`
- **返回值**: `ToolDefinition`

### delay()

- **定义位置**: 第125行
- **参数**: `ms: number`
- **返回值**: `Promise<void>`

### truncateText()

- **定义位置**: 第129行
- **参数**: `text: string, maxLength: number`
- **返回值**: `string`

### formatTaskStatus()

- **定义位置**: 第134行
- **参数**: `task: BackgroundTask`
- **返回值**: `string`

### formatTaskResult()

- **定义位置**: 第200行
- **参数**: `task: BackgroundTask, client: OpencodeClient`
- **返回值**: `Promise<string>`

### createBackgroundOutput()

- **定义位置**: 第324行
- **参数**: `manager: BackgroundManager, client: OpencodeClient`
- **返回值**: `ToolDefinition`

### createBackgroundCancel()

- **定义位置**: 第390行
- **参数**: `manager: BackgroundManager, client: OpencodeClient`
- **返回值**: `ToolDefinition`

## 类型定义

- `OpencodeClient`
- `ToolContextWithMetadata`

## 依赖关系

- `@opencode-ai/plugin`
- `node:fs`
- `node:path`
- `../../features/background-agent`
- `./types`
- `./constants`
- `../../features/hook-message-injector`
- `../../features/claude-code-session-state`
- `../../shared/logger`
- `../../shared/session-cursor`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 9
- 常量数量: 0
- 类型定义数量: 2
- 导入模块数量: 10

