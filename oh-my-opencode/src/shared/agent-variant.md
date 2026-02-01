# agent-variant.ts

## 文件信息

- **路径**: src/shared/agent-variant.ts
- **目录**: src/shared
- **行数**: 80

## 文件功能

提供了 4 个函数/工具,用于实现特定功能。

## 函数定义

### resolveAgentVariant()

- **定义位置**: 第5行
- **参数**: `config: OhMyOpenCodeConfig,
  agentName?: string`
- **返回值**: `string | undefined`

### resolveVariantForModel()

- **定义位置**: 第33行
- **参数**: `config: OhMyOpenCodeConfig,
  agentName: string,
  currentModel: { providerID: string; modelID: string },`
- **返回值**: `string | undefined`

### findVariantInChain()

- **定义位置**: 第58行
- **参数**: `fallbackChain: { providers: string[]; model: string; variant?: string }[],
  providerID: string,`
- **返回值**: `string | undefined`

### applyAgentVariant()

- **定义位置**: 第70行
- **参数**: `config: OhMyOpenCodeConfig,
  agentName: string | undefined,
  message: { variant?: string }`

## 依赖关系

- `../config`
- `./case-insensitive`
- `./model-requirements`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 4
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 3

