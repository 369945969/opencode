# pruning-deduplication.ts

## 文件信息

- **路径**: src/hooks/anthropic-context-window-limit-recovery/pruning-deduplication.ts
- **目录**: src/hooks/anthropic-context-window-limit-recovery
- **行数**: 185

## 文件功能

提供了 6 个函数/工具,用于实现特定功能。

## 接口定义

### DeduplicationConfig

- **定义位置**: 第8行
- **属性**: enabled, nabled, abled, bled, led, ed, d, protectedTools, rotectedTools, otectedTools

### ToolPart

- **定义位置**: 第13行
- **属性**: type, ype, pe, e, callID, allID, llID, lID, ID, D

### MessagePart

- **定义位置**: 第23行
- **属性**: type, ype, pe, e, parts, arts, rts, ts, s

## 函数定义

### createToolSignature()

- **定义位置**: 第28行
- **参数**: `toolName: string, input: unknown`
- **返回值**: `string`

### sortObject()

- **定义位置**: 第33行
- **参数**: `obj: unknown`
- **返回值**: `unknown`

### getMessageDir()

- **定义位置**: 第46行
- **参数**: `sessionID: string`
- **返回值**: `string | null`

### readMessages()

- **定义位置**: 第60行
- **参数**: `sessionID: string`
- **返回值**: `MessagePart[]`

### executeDeduplication()

- **定义位置**: 第82行
- **参数**: `sessionID: string,
  state: PruningState,
  config: DeduplicationConfig,
  protectedTools: Set<string>`
- **返回值**: `number`

### findToolOutput()

- **定义位置**: 第172行
- **参数**: `messages: MessagePart[], callID: string`
- **返回值**: `string | null`

## 依赖关系

- `node:fs`
- `node:path`
- `./pruning-types`
- `../../shared/logger`
- `../../features/hook-message-injector`

## 代码统计

- 接口数量: 3
- 类数量: 0
- 函数数量: 6
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 5

