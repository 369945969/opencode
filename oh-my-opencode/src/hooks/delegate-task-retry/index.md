# index.ts

## 文件信息

- **路径**: src/hooks/delegate-task-retry/index.ts
- **目录**: src/hooks/delegate-task-retry
- **行数**: 137

## 文件功能

这是模块的入口文件,统一导出本模块的所有公共 API。

## 接口定义

### DelegateTaskErrorPattern

- **定义位置**: 第3行
- **属性**: pattern, attern, ttern, tern, ern, rn, n, errorType, rrorType, rorType

### DetectedError

- **定义位置**: 第57行
- **属性**: errorType, rrorType, rorType, orType, rType, Type, ype, pe, e, originalOutput

## 函数定义

### detectDelegateTaskError()

- **定义位置**: 第62行
- **参数**: `output: string`
- **返回值**: `DetectedError | null`

### extractAvailableList()

- **定义位置**: 第77行
- **参数**: `output: string`
- **返回值**: `string | null`

### buildRetryGuidance()

- **定义位置**: 第82行
- **参数**: `errorInfo: DetectedError`
- **返回值**: `string`

### createDelegateTaskRetryHook()

- **定义位置**: 第121行
- **参数**: `_ctx: PluginInput`

## 依赖关系

- `@opencode-ai/plugin`

## 代码统计

- 接口数量: 2
- 类数量: 0
- 函数数量: 4
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 1

