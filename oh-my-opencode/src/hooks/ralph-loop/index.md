# index.ts

## 文件信息

- **路径**: src/hooks/ralph-loop/index.ts
- **目录**: src/hooks/ralph-loop
- **行数**: 429

## 文件功能

这是模块的入口文件,统一导出本模块的所有公共 API。

## 接口定义

### SessionState

- **定义位置**: 第31行
- **属性**: isRecovering, sRecovering, Recovering, ecovering, covering, overing, vering, ering, ring, ing

### OpenCodeSessionMessage

- **定义位置**: 第35行
- **属性**: info, nfo, fo, o, parts, arts, rts, ts, s

### RalphLoopHook

- **定义位置**: 第59行
- **属性**: event, vent, ent, nt, t, input, nput, put, ut, startLoop

## 函数定义

### getMessageDir()

- **定义位置**: 第16行
- **参数**: `sessionID: string`
- **返回值**: `string | null`

### createRalphLoopHook()

- **定义位置**: 第72行
- **参数**: `ctx: PluginInput,
  options?: RalphLoopOptions`
- **返回值**: `RalphLoopHook`

## 常量定义

### CONTINUATION_PROMPT

- **定义位置**: 第46行
- **值**: ``${SYSTEM_DIRECTIVE_PREFIX} - RALPH LOOP {{ITERATION}}/{{MAX}}]`

### DEFAULT_API_TIMEOUT

- **定义位置**: 第70行
- **值**: `3000`

## 导出内容

```typescript
export { * from "./types"
export * from "./constants"
export { readState, writeState, clearState, incrementIteration };
```

## 依赖关系

- `@opencode-ai/plugin`
- `node:fs`
- `node:path`
- `../../shared/logger`
- `../../shared/system-directive`
- `./storage`
- `./constants`
- `./types`
- `../claude-code-hooks/transcript`
- `../../features/hook-message-injector`

## 代码统计

- 接口数量: 3
- 类数量: 0
- 函数数量: 2
- 常量数量: 2
- 类型定义数量: 0
- 导入模块数量: 10

