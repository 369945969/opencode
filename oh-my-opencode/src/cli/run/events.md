# events.ts

## 文件信息

- **路径**: src/cli/run/events.ts
- **目录**: src/cli/run
- **行数**: 326

## 文件功能

提供了 11 个函数/工具,用于实现特定功能。

## 接口定义

### EventState

- **定义位置**: 第59行
- **属性**: mainSessionIdle, ainSessionIdle, inSessionIdle, nSessionIdle, SessionIdle, essionIdle, ssionIdle, sionIdle, ionIdle, onIdle

## 函数定义

### serializeError()

- **定义位置**: 第14行
- **参数**: `error: unknown`
- **返回值**: `string`

### createEventState()

- **定义位置**: 第68行
- **返回值**: `EventState`

### processEvents()

- **定义位置**: 第79行
- **参数**: `ctx: RunContext,
  stream: AsyncIterable<unknown>,
  state: EventState`
- **返回值**: `Promise<void>`

### logEventVerbose()

- **定义位置**: 第109行
- **参数**: `ctx: RunContext, payload: EventPayload`

### handleSessionIdle()

- **定义位置**: 第185行
- **参数**: `ctx: RunContext,
  payload: EventPayload,
  state: EventState`

### handleSessionStatus()

- **定义位置**: 第198行
- **参数**: `ctx: RunContext,
  payload: EventPayload,
  state: EventState`

### handleSessionError()

- **定义位置**: 第211行
- **参数**: `ctx: RunContext,
  payload: EventPayload,
  state: EventState`

### handleMessagePartUpdated()

- **定义位置**: 第226行
- **参数**: `ctx: RunContext,
  payload: EventPayload,
  state: EventState`

### handleMessageUpdated()

- **定义位置**: 第249行
- **参数**: `ctx: RunContext,
  payload: EventPayload,
  state: EventState`

### handleToolExecute()

- **定义位置**: 第272行
- **参数**: `ctx: RunContext,
  payload: EventPayload,
  state: EventState`

### handleToolResult()

- **定义位置**: 第302行
- **参数**: `ctx: RunContext,
  payload: EventPayload,
  state: EventState`

## 依赖关系

- `./types`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 11
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 1

