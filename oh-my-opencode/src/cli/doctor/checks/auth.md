# auth.ts

## 文件信息

- **路径**: src/cli/doctor/checks/auth.ts
- **目录**: src/cli/doctor/checks
- **行数**: 115

## 文件功能

提供了 8 个函数/工具,用于实现特定功能。

## 函数定义

### getOpenCodeConfig()

- **定义位置**: 第17行

### isPluginInstalled()

- **定义位置**: 第29行
- **参数**: `plugins: string[], pluginName: string`
- **返回值**: `boolean`

### getAuthProviderInfo()

- **定义位置**: 第34行
- **参数**: `providerId: AuthProviderId`
- **返回值**: `AuthProviderInfo`

### checkAuthProvider()

- **定义位置**: 第49行
- **参数**: `providerId: AuthProviderId`
- **返回值**: `Promise<CheckResult>`

### checkAnthropicAuth()

- **定义位置**: 第78行
- **返回值**: `Promise<CheckResult>`

### checkOpenAIAuth()

- **定义位置**: 第82行
- **返回值**: `Promise<CheckResult>`

### checkGoogleAuth()

- **定义位置**: 第86行
- **返回值**: `Promise<CheckResult>`

### getAuthCheckDefinitions()

- **定义位置**: 第90行
- **返回值**: `CheckDefinition[]`

## 常量定义

### OPENCODE_CONFIG_DIR

- **定义位置**: 第7行
- **值**: `getOpenCodeConfigDir({ binary: "opencode" })`

### OPENCODE_JSON

- **定义位置**: 第8行
- **值**: `join(OPENCODE_CONFIG_DIR, "opencode.json")`

### OPENCODE_JSONC

- **定义位置**: 第9行
- **值**: `join(OPENCODE_CONFIG_DIR, "opencode.jsonc")`

## 依赖关系

- `node:fs`
- `node:path`
- `../types`
- `../constants`
- `../../../shared`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 8
- 常量数量: 3
- 类型定义数量: 0
- 导入模块数量: 5

