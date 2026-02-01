# model-fallback.ts

## 文件信息

- **路径**: src/cli/model-fallback.ts
- **目录**: src/cli
- **行数**: 195

## 文件功能

提供了 7 个函数/工具,用于实现特定功能。

## 接口定义

### ProviderAvailability

- **定义位置**: 第8行
- **属性**: native, ative, tive, ive, ve, e, opencodeZen, pencodeZen, encodeZen, ncodeZen

### AgentConfig

- **定义位置**: 第20行
- **属性**: model, odel, del, el, l, variant, ariant, riant, iant, ant

### CategoryConfig

- **定义位置**: 第25行
- **属性**: model, odel, del, el, l, variant, ariant, riant, iant, ant

### GeneratedOmoConfig

- **定义位置**: 第30行
- **属性**: schema, chema, hema, ema, ma, a, agents, gents, ents, nts

## 函数定义

### toProviderAvailability()

- **定义位置**: 第42行
- **参数**: `config: InstallConfig`
- **返回值**: `ProviderAvailability`

### isProviderAvailable()

- **定义位置**: 第56行
- **参数**: `provider: string, avail: ProviderAvailability`
- **返回值**: `boolean`

### transformModelForProvider()

- **定义位置**: 第68行
- **参数**: `provider: string, model: string`
- **返回值**: `string`

### resolveModelFromChain()

- **定义位置**: 第79行
- **参数**: `fallbackChain: FallbackEntry[],
  avail: ProviderAvailability`

### getSisyphusFallbackChain()

- **定义位置**: 第97行
- **参数**: `isMaxPlan: boolean`
- **返回值**: `FallbackEntry[]`

### generateModelConfig()

- **定义位置**: 第110行
- **参数**: `config: InstallConfig`
- **返回值**: `GeneratedOmoConfig`

### shouldShowChatGPTOnlyWarning()

- **定义位置**: 第192行
- **参数**: `config: InstallConfig`
- **返回值**: `boolean`

## 常量定义

### ZAI_MODEL

- **定义位置**: 第37行
- **值**: `"zai-coding-plan/glm-4.7"`

### ULTIMATE_FALLBACK

- **定义位置**: 第39行
- **值**: `"opencode/big-pickle"`

### SCHEMA_URL

- **定义位置**: 第40行
- **值**: `"https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.j...`

## 依赖关系

- `../shared/model-requirements`
- `./types`

## 代码统计

- 接口数量: 4
- 类数量: 0
- 函数数量: 7
- 常量数量: 3
- 类型定义数量: 0
- 导入模块数量: 2

