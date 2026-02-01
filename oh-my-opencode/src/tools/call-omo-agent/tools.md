# tools.ts

## 文件信息

- **路径**: src/tools/call-omo-agent/tools.ts
- **目录**: src/tools/call-omo-agent
- **行数**: 357

## 文件功能

提供了 4 个函数/工具,用于实现特定功能。

## 函数定义

### getMessageDir()

- **定义位置**: 第12行
- **参数**: `sessionID: string`
- **返回值**: `string | null`

### createCallOmoAgent()

- **定义位置**: 第34行
- **参数**: `ctx: PluginInput,
  backgroundManager: BackgroundManager`
- **返回值**: `ToolDefinition`

### executeBackground()

- **定义位置**: 第80行
- **参数**: `args: CallOmoAgentArgs,
  toolContext: ToolContextWithMetadata,
  manager: BackgroundManager`
- **返回值**: `Promise<string>`

### executeSync()

- **定义位置**: 第134行
- **参数**: `args: CallOmoAgentArgs,
  toolContext: ToolContextWithMetadata,
  ctx: PluginInput`
- **返回值**: `Promise<string>`

## 类型定义

- `ToolContextWithMetadata`

## 依赖关系

- `@opencode-ai/plugin`
- `node:fs`
- `node:path`
- `./constants`
- `./types`
- `../../features/background-agent`
- `../../shared`
- `../../shared/session-cursor`
- `../../features/hook-message-injector`
- `../../features/claude-code-session-state`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 4
- 常量数量: 0
- 类型定义数量: 1
- 导入模块数量: 10

