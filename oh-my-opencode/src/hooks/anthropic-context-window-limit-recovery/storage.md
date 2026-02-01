# storage.ts

## 文件信息

- **路径**: src/hooks/anthropic-context-window-limit-recovery/storage.ts
- **目录**: src/hooks/anthropic-context-window-limit-recovery
- **行数**: 251

## 文件功能

提供了 8 个函数/工具,用于实现特定功能。

## 接口定义

### StoredToolPart

- **定义位置**: 第12行
- **属性**: id, d, sessionID, essionID, ssionID, sionID, ionID, onID, nID, ID

### ToolResultInfo

- **定义位置**: 第34行
- **属性**: partPath, artPath, rtPath, tPath, Path, ath, th, h, partId, artId

### AggressiveTruncateResult

- **定义位置**: 第175行
- **属性**: success, uccess, ccess, cess, ess, ss, s, sufficient, ufficient, fficient

## 函数定义

### getMessageDir()

- **定义位置**: 第42行
- **参数**: `sessionID: string`
- **返回值**: `string`

### getMessageIds()

- **定义位置**: 第60行
- **参数**: `sessionID: string`
- **返回值**: `string[]`

### findToolResultsBySize()

- **定义位置**: 第74行
- **参数**: `sessionID: string`
- **返回值**: `ToolResultInfo[]`

### findLargestToolResult()

- **定义位置**: 第107行
- **参数**: `sessionID: string`
- **返回值**: `ToolResultInfo | null`

### truncateToolResult()

- **定义位置**: 第112行
- **参数**: `partPath: string`

### getTotalToolOutputSize()

- **定义位置**: 第145行
- **参数**: `sessionID: string`
- **返回值**: `number`

### countTruncatedResults()

- **定义位置**: 第150行
- **参数**: `sessionID: string`
- **返回值**: `number`

### truncateUntilTargetTokens()

- **定义位置**: 第184行
- **参数**: `sessionID: string,
  currentTokens: number,
  maxTokens: number,
  targetRatio: number = 0.8,
  charsPerToken: number = 4`
- **返回值**: `AggressiveTruncateResult`

## 常量定义

### OPENCODE_STORAGE

- **定义位置**: 第5行
- **值**: `getOpenCodeStorageDir()`

### MESSAGE_STORAGE

- **定义位置**: 第6行
- **值**: `join(OPENCODE_STORAGE, "message")`

### PART_STORAGE

- **定义位置**: 第7行
- **值**: `join(OPENCODE_STORAGE, "part")`

### TRUNCATION_MESSAGE

- **定义位置**: 第9行
- **值**: `"[TOOL RESULT TRUNCATED - Context limit exceeded. Original output was too large and has been truncat...`

## 依赖关系

- `node:fs`
- `node:path`
- `../../shared/data-path`

## 代码统计

- 接口数量: 3
- 类数量: 0
- 函数数量: 8
- 常量数量: 4
- 类型定义数量: 0
- 导入模块数量: 3

