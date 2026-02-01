# executor.ts

## 文件信息

- **路径**: src/hooks/anthropic-context-window-limit-recovery/executor.ts
- **目录**: src/hooks/anthropic-context-window-limit-recovery
- **行数**: 486

## 文件功能

提供了 9 个函数/工具,用于实现特定功能。

## 函数定义

### getOrCreateRetryState()

- **定义位置**: 第58行
- **参数**: `autoCompactState: AutoCompactState,
  sessionID: string,`
- **返回值**: `RetryState`

### getOrCreateTruncateState()

- **定义位置**: 第72行
- **参数**: `autoCompactState: AutoCompactState,
  sessionID: string,`
- **返回值**: `TruncateState`

### sanitizeEmptyMessagesBeforeSummarize()

- **定义位置**: 第86行
- **参数**: `sessionID: string`
- **返回值**: `number`

### formatBytes()

- **定义位置**: 第116行
- **参数**: `bytes: number`
- **返回值**: `string`

### getLastAssistant()

- **定义位置**: 第122行
- **参数**: `sessionID: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: any,
  directory: string,`
- **返回值**: `Promise<Record<string, unknown> | null>`

### clearSessionState()

- **定义位置**: 第152行
- **参数**: `autoCompactState: AutoCompactState,
  sessionID: string,`

### getOrCreateEmptyContentAttempt()

- **定义位置**: 第164行
- **参数**: `autoCompactState: AutoCompactState,
  sessionID: string,`
- **返回值**: `number`

### fixEmptyMessages()

- **定义位置**: 第171行
- **参数**: `sessionID: string,
  autoCompactState: AutoCompactState,
  client: Client,
  messageIndex?: number,`
- **返回值**: `Promise<boolean>`

### executeCompact()

- **定义位置**: 第258行
- **参数**: `sessionID: string,
  msg: Record<string, unknown>,
  autoCompactState: AutoCompactState,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: any,
  directory: string,
  experimental?: ExperimentalConfig,`
- **返回值**: `Promise<void>`

## 常量定义

### PLACEHOLDER_TEXT

- **定义位置**: 第22行
- **值**: `"[user interrupted]"`

## 类型定义

- `Client`

## 依赖关系

- `./types`
- `../../config`
- `./storage`
- `../session-recovery/storage`
- `../../shared/logger`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 9
- 常量数量: 1
- 类型定义数量: 1
- 导入模块数量: 5

