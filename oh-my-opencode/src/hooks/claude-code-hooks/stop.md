# stop.ts

## 文件信息

- **路径**: src/hooks/claude-code-hooks/stop.ts
- **目录**: src/hooks/claude-code-hooks
- **行数**: 119

## 文件功能

提供了 3 个函数/工具,用于实现特定功能。

## 接口定义

### StopContext

- **定义位置**: 第22行
- **属性**: sessionId, essionId, ssionId, sionId, ionId, onId, nId, Id, d, parentSessionId

### StopResult

- **定义位置**: 第31行
- **属性**: block, lock, ock, ck, k, reason, eason, ason, son, on

## 函数定义

### setStopHookActive()

- **定义位置**: 第14行
- **参数**: `sessionId: string, active: boolean`

### getStopHookActive()

- **定义位置**: 第18行
- **参数**: `sessionId: string`
- **返回值**: `boolean`

### executeStopHooks()

- **定义位置**: 第39行
- **参数**: `ctx: StopContext,
  config: ClaudeHooksConfig | null,
  extendedConfig?: PluginExtendedConfig | null`
- **返回值**: `Promise<StopResult>`

## 常量定义

### stopHookActiveState

- **定义位置**: 第12行
- **值**: `new Map<string, boolean>()`

## 依赖关系

- `./types`
- `../../shared`
- `./plugin-config`
- `./todo`
- `./config-loader`

## 代码统计

- 接口数量: 2
- 类数量: 0
- 函数数量: 3
- 常量数量: 1
- 类型定义数量: 0
- 导入模块数量: 5

