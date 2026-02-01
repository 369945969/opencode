# model-availability.ts

## 文件信息

- **路径**: src/shared/model-availability.ts
- **目录**: src/shared
- **行数**: 198

## 文件功能

提供了 6 个函数/工具,用于实现特定功能。

## 函数定义

### normalizeModelName()

- **定义位置**: 第27行
- **描述**: const available = new Set(["openai/gpt-5.2", "openai/gpt-5.2-codex", "anthropic/claude-opus-4-5"]) fuzzyMatchModel("gpt-5.2", available) // → "openai/gpt-5.2" fuzzyMatchModel("claude", available, ["openai"]) // → null (provider filter excludes anthropic) /
- **参数**: `name: string`
- **返回值**: `string`

### fuzzyMatchModel()

- **定义位置**: 第34行
- **参数**: `target: string,
	available: Set<string>,
	providers?: string[],`
- **返回值**: `string | null`

### getConnectedProviders()

- **定义位置**: 第90行
- **参数**: `client: any`
- **返回值**: `Promise<string[]>`

### fetchAvailableModels()

- **定义位置**: 第107行
- **参数**: `_client?: any,
	options?: { connectedProviders?: string[] | null }`
- **返回值**: `Promise<Set<string>>`

### __resetModelCache()

- **定义位置**: 第189行

### isModelCacheAvailable()

- **定义位置**: 第191行
- **返回值**: `boolean`

## 依赖关系

- `fs`
- `path`
- `./logger`
- `./data-path`
- `./connected-providers-cache`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 6
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 5

