# model-resolution.ts

## 文件信息

- **路径**: src/cli/doctor/checks/model-resolution.ts
- **目录**: src/cli/doctor/checks
- **行数**: 265

## 文件功能

提供了 13 个函数/工具,用于实现特定功能。

## 接口定义

### AgentResolutionInfo

- **定义位置**: 第50行
- **属性**: name, ame, me, e, requirement, equirement, quirement, uirement, irement, rement

### CategoryResolutionInfo

- **定义位置**: 第58行
- **属性**: name, ame, me, e, requirement, equirement, quirement, uirement, irement, rement

### ModelResolutionInfo

- **定义位置**: 第66行
- **属性**: agents, gents, ents, nts, ts, s, categories, ategories, tegories, egories

### OmoConfig

- **定义位置**: 第71行
- **属性**: agents, gents, ents, nts, ts, s, categories, ategories, tegories, egories

### AvailableModelsInfo

- **定义位置**: 第190行
- **属性**: providers, roviders, oviders, viders, iders, ders, ers, rs, s, modelCount

## 函数定义

### getOpenCodeCacheDir()

- **定义位置**: 第13行
- **返回值**: `string`

### loadAvailableModels()

- **定义位置**: 第19行

### loadConfig()

- **定义位置**: 第76行
- **返回值**: `OmoConfig | null`

### formatProviderChain()

- **定义位置**: 第100行
- **参数**: `providers: string[]`
- **返回值**: `string`

### getEffectiveModel()

- **定义位置**: 第104行
- **参数**: `requirement: ModelRequirement, userOverride?: string`
- **返回值**: `string`

### buildEffectiveResolution()

- **定义位置**: 第115行
- **参数**: `requirement: ModelRequirement,
  userOverride?: string,`
- **返回值**: `string`

### getModelResolutionInfo()

- **定义位置**: 第129行
- **返回值**: `ModelResolutionInfo`

### getModelResolutionInfoWithOverrides()

- **定义位置**: 第151行
- **参数**: `config: OmoConfig`
- **返回值**: `ModelResolutionInfo`

### formatModelWithVariant()

- **定义位置**: 第181行
- **参数**: `model: string, variant?: string`
- **返回值**: `string`

### getEffectiveVariant()

- **定义位置**: 第185行
- **参数**: `requirement: ModelRequirement`
- **返回值**: `string | undefined`

### buildDetailsArray()

- **定义位置**: 第196行
- **参数**: `info: ModelResolutionInfo, available: AvailableModelsInfo`
- **返回值**: `string[]`

### checkModelResolution()

- **定义位置**: 第234行
- **返回值**: `Promise<CheckResult>`

### getModelResolutionCheckDefinition()

- **定义位置**: 第256行
- **返回值**: `CheckDefinition`

## 常量定义

### PACKAGE_NAME

- **定义位置**: 第45行
- **值**: `"oh-my-opencode"`

### USER_CONFIG_DIR

- **定义位置**: 第46行
- **值**: `join(homedir(), ".config", "opencode")`

### USER_CONFIG_BASE

- **定义位置**: 第47行
- **值**: `join(USER_CONFIG_DIR, PACKAGE_NAME)`

### PROJECT_CONFIG_BASE

- **定义位置**: 第48行
- **值**: `join(process.cwd(), ".opencode", PACKAGE_NAME)`

## 依赖关系

- `node:fs`
- `../types`
- `../constants`
- `../../../shared`
- `../../../shared/model-requirements`
- `node:os`
- `node:path`

## 代码统计

- 接口数量: 5
- 类数量: 0
- 函数数量: 13
- 常量数量: 4
- 类型定义数量: 0
- 导入模块数量: 7

