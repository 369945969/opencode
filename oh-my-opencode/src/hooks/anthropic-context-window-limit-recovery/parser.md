# parser.ts

## 文件信息

- **路径**: src/hooks/anthropic-context-window-limit-recovery/parser.ts
- **目录**: src/hooks/anthropic-context-window-limit-recovery
- **行数**: 202

## 文件功能

提供了 5 个函数/工具,用于实现特定功能。

## 接口定义

### AnthropicErrorData

- **定义位置**: 第3行
- **属性**: type, ype, pe, e, error, rror, ror, or, r, request_id

## 函数定义

### isThinkingBlockError()

- **定义位置**: 第42行
- **参数**: `text: string`
- **返回值**: `boolean`

### extractTokensFromMessage()

- **定义位置**: 第48行
- **参数**: `message: string`

### extractMessageIndex()

- **定义位置**: 第60行
- **参数**: `text: string`
- **返回值**: `number | undefined`

### isTokenLimitError()

- **定义位置**: 第68行
- **参数**: `text: string`
- **返回值**: `boolean`

### parseAnthropicTokenLimitError()

- **定义位置**: 第76行
- **参数**: `err: unknown`
- **返回值**: `ParsedTokenLimitError | null`

## 常量定义

### TOKEN_LIMIT_PATTERNS

- **定义位置**: 第12行
- **值**: `[`

### TOKEN_LIMIT_KEYWORDS

- **定义位置**: 第20行
- **值**: `[`

### THINKING_BLOCK_ERROR_PATTERNS

- **定义位置**: 第33行
- **值**: `[`

### MESSAGE_INDEX_PATTERN

- **定义位置**: 第46行
- **值**: `/messages\.(\d+)/`

## 依赖关系

- `./types`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 5
- 常量数量: 4
- 类型定义数量: 0
- 导入模块数量: 1

