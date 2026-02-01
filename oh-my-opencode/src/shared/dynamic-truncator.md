# dynamic-truncator.ts

## 文件信息

- **路径**: src/shared/dynamic-truncator.ts
- **目录**: src/shared
- **行数**: 194

## 文件功能

提供了 5 个函数/工具,用于实现特定功能。

## 接口定义

### AssistantMessageInfo

- **定义位置**: 第11行
- **属性**: role, ole, le, e, tokens, okens, kens, ens, ns, s

### MessageWrapper

- **定义位置**: 第21行
- **属性**: info, nfo, fo, o

### TruncationResult

- **定义位置**: 第25行
- **属性**: result, esult, sult, ult, lt, t, truncated, runcated, uncated, ncated

### TruncationOptions

- **定义位置**: 第31行
- **属性**: targetMaxTokens, argetMaxTokens, rgetMaxTokens, getMaxTokens, etMaxTokens, tMaxTokens, MaxTokens, axTokens, xTokens, Tokens

## 函数定义

### estimateTokens()

- **定义位置**: 第37行
- **参数**: `text: string`
- **返回值**: `number`

### truncateToTokenLimit()

- **定义位置**: 第41行
- **参数**: `output: string,
	maxTokens: number,
	preserveHeaderLines = 3,`
- **返回值**: `TruncationResult`

### getContextWindowUsage()

- **定义位置**: 第105行
- **参数**: `ctx: PluginInput,
	sessionID: string,`
- **返回值**: `Promise<`

### dynamicTruncate()

- **定义位置**: 第144行
- **参数**: `ctx: PluginInput,
	sessionID: string,
	output: string,
	options: TruncationOptions = {},`
- **返回值**: `Promise<TruncationResult>`

### createDynamicTruncator()

- **定义位置**: 第177行
- **参数**: `ctx: PluginInput`

## 常量定义

### ANTHROPIC_ACTUAL_LIMIT

- **定义位置**: 第3行
- **值**: `process.env.ANTHROPIC_1M_CONTEXT === "true" ||`

### CHARS_PER_TOKEN_ESTIMATE

- **定义位置**: 第8行
- **值**: `4`

### DEFAULT_TARGET_MAX_TOKENS

- **定义位置**: 第9行
- **值**: `50_000`

## 依赖关系

- `@opencode-ai/plugin`

## 代码统计

- 接口数量: 4
- 类数量: 0
- 函数数量: 5
- 常量数量: 3
- 类型定义数量: 0
- 导入模块数量: 1

