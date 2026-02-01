# connected-providers-cache.ts

## 文件信息

- **路径**: src/shared/connected-providers-cache.ts
- **目录**: src/shared
- **行数**: 193

## 文件功能

提供了 9 个函数/工具,用于实现特定功能。

## 接口定义

### ConnectedProvidersCache

- **定义位置**: 第9行
- **属性**: connected, onnected, nnected, nected, ected, cted, ted, ed, d, updatedAt

### ProviderModelsCache

- **定义位置**: 第14行
- **属性**: models, odels, dels, els, ls, s, connected, onnected, nnected, nected

## 函数定义

### getCacheFilePath()

- **定义位置**: 第20行
- **参数**: `filename: string`
- **返回值**: `string`

### ensureCacheDir()

- **定义位置**: 第24行

### readConnectedProvidersCache()

- **定义位置**: 第35行
- **描述**: Read the connected providers cache. Returns the list of connected provider IDs, or null if cache doesn't exist. /
- **返回值**: `string[] | null`

### hasConnectedProvidersCache()

- **定义位置**: 第57行
- **描述**: Check if connected providers cache exists. /
- **返回值**: `boolean`

### writeConnectedProvidersCache()

- **定义位置**: 第65行
- **描述**: Write the connected providers cache. /
- **参数**: `connected: string[]`

### readProviderModelsCache()

- **定义位置**: 第86行
- **描述**: Read the provider-models cache. Returns the cache data, or null if cache doesn't exist. /
- **返回值**: `ProviderModelsCache | null`

### hasProviderModelsCache()

- **定义位置**: 第111行
- **描述**: Check if provider-models cache exists. /
- **返回值**: `boolean`

### writeProviderModelsCache()

- **定义位置**: 第119行
- **描述**: Write the provider-models cache. /
- **参数**: `data: { models: Record<string, string[]>; connected: string[] }`

### updateConnectedProvidersCache()

- **定义位置**: 第142行
- **描述**: Update the connected providers cache by fetching from the client. Also updates the provider-models cache with model lists per provider. /
- **参数**: `client: {
	provider?: {
		list?: (`

## 常量定义

### CONNECTED_PROVIDERS_CACHE_FILE

- **定义位置**: 第6行
- **值**: `"connected-providers.json"`

### PROVIDER_MODELS_CACHE_FILE

- **定义位置**: 第7行
- **值**: `"provider-models.json"`

## 依赖关系

- `fs`
- `path`
- `./logger`
- `./data-path`

## 代码统计

- 接口数量: 2
- 类数量: 0
- 函数数量: 9
- 常量数量: 2
- 类型定义数量: 0
- 导入模块数量: 4

