# switcher.ts

## 文件信息

- **路径**: src/hooks/think-mode/switcher.ts
- **目录**: src/hooks/think-mode
- **行数**: 221

## 文件功能

提供了 7 个函数/工具,用于实现特定功能。

## 函数定义

### extractModelPrefix()

- **定义位置**: 第28行
- **描述**: extractModelPrefix("vertex_ai/claude-sonnet-4-5") // { prefix: "vertex_ai/", base: "claude-sonnet-4-5" } extractModelPrefix("claude-sonnet-4-5") // { prefix: "", base: "claude-sonnet-4-5" } extractModelPrefix("openai/gpt-5.2") // { prefix: "openai/", base: "gpt-5.2" } /
- **参数**: `modelID: string`

### normalizeModelID()

- **定义位置**: 第50行
- **描述**: normalizeModelID("claude-opus-4.5") // "claude-opus-4-5" normalizeModelID("gemini-3.5-pro") // "gemini-3-5-pro" normalizeModelID("gpt-5.2") // "gpt-5-2" normalizeModelID("vertex_ai/claude-opus-4.5") // "vertex_ai/claude-opus-4-5" /
- **参数**: `modelID: string`
- **返回值**: `string`

### resolveProvider()

- **定义位置**: 第67行
- **描述**: resolveProvider("github-copilot", "claude-opus-4-5") // "anthropic" resolveProvider("github-copilot", "gemini-3-pro") // "google" resolveProvider("github-copilot", "gpt-5.2") // "openai" resolveProvider("anthropic", "claude-opus-4-5") // "anthropic" (unchanged) /
- **参数**: `providerID: string, modelID: string`
- **返回值**: `string`

### getHighVariant()

- **定义位置**: 第162行
- **参数**: `modelID: string`
- **返回值**: `string | null`

### isAlreadyHighVariant()

- **定义位置**: 第181行
- **参数**: `modelID: string`
- **返回值**: `boolean`

### isThinkingProvider()

- **定义位置**: 第189行
- **参数**: `provider: string`
- **返回值**: `provider is ThinkingProvider`

### getThinkingConfig()

- **定义位置**: 第193行
- **参数**: `providerID: string,
  modelID: string`
- **返回值**: `Record<string, unknown> | null`

## 常量定义

### THINKING_CONFIGS

- **定义位置**: 第116行
- **值**: `{`

### THINKING_CAPABLE_MODELS

- **定义位置**: 第154行
- **值**: `{`

## 类型定义

- `ThinkingProvider`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 7
- 常量数量: 2
- 类型定义数量: 1
- 导入模块数量: 0

