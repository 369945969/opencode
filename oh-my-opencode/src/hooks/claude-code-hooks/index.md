# index.ts

## 文件信息

- **路径**: src/hooks/claude-code-hooks/index.ts
- **目录**: src/hooks/claude-code-hooks
- **行数**: 407

## 文件功能

这是模块的入口文件,统一导出本模块的所有公共 API。

## 函数定义

### createClaudeCodeHooksHook()

- **定义位置**: 第36行
- **参数**: `ctx: PluginInput,
  config: PluginConfig = {},
  contextCollector?: ContextCollector`

## 常量定义

### sessionFirstMessageProcessed

- **定义位置**: 第32行
- **值**: `new Set<string>()`

### sessionErrorState

- **定义位置**: 第33行
- **值**: `new Map<string, { hasError: boolean`

### sessionInterruptState

- **定义位置**: 第34行
- **值**: `new Map<string, { interrupted: boolean }>()`

## 依赖关系

- `@opencode-ai/plugin`
- `./config`
- `./config-loader`
- `./pre-tool-use`
- `./post-tool-use`
- `./user-prompt-submit`
- `./stop`
- `./pre-compact`
- `./tool-input-cache`
- `./transcript`
- `./types`
- `../../shared`
- `../../features/context-injector`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 1
- 常量数量: 3
- 类型定义数量: 0
- 导入模块数量: 13

