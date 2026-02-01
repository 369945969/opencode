# tool-output-truncator.ts

## 文件信息

- **路径**: src/hooks/tool-output-truncator.ts
- **目录**: src/hooks
- **行数**: 62

## 文件功能

提供了 1 个函数/工具,用于实现特定功能。

## 接口定义

### ToolOutputTruncatorOptions

- **定义位置**: 第29行
- **属性**: experimental, xperimental, perimental, erimental, rimental, imental, mental, ental, ntal, tal

## 函数定义

### createToolOutputTruncatorHook()

- **定义位置**: 第33行
- **参数**: `ctx: PluginInput, options?: ToolOutputTruncatorOptions`

## 常量定义

### DEFAULT_MAX_TOKENS

- **定义位置**: 第5行
- **值**: `50_000 // ~200k chars`

### WEBFETCH_MAX_TOKENS

- **定义位置**: 第6行
- **值**: `10_000 // ~40k chars - web pages need aggressive truncation`

### TRUNCATABLE_TOOLS

- **定义位置**: 第8行
- **值**: `[`

## 依赖关系

- `@opencode-ai/plugin`
- `../config/schema`
- `../shared/dynamic-truncator`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 1
- 常量数量: 3
- 类型定义数量: 0
- 导入模块数量: 3

