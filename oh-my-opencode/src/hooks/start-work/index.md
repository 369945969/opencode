# index.ts

## 文件信息

- **路径**: src/hooks/start-work/index.ts
- **目录**: src/hooks/start-work
- **行数**: 246

## 文件功能

这是模块的入口文件,统一导出本模块的所有公共 API。

## 接口定义

### StartWorkHookInput

- **定义位置**: 第19行
- **属性**: sessionID, essionID, ssionID, sionID, ionID, onID, nID, ID, D, messageID

### StartWorkHookOutput

- **定义位置**: 第24行
- **属性**: parts, arts, rts, ts, s

## 函数定义

### extractUserRequestPlanName()

- **定义位置**: 第28行
- **参数**: `promptText: string`
- **返回值**: `string | null`

### findPlanByName()

- **定义位置**: 第39行
- **参数**: `plans: string[], requestedName: string`
- **返回值**: `string | null`

### createStartWorkHook()

- **定义位置**: 第49行
- **参数**: `ctx: PluginInput`

## 常量定义

### HOOK_NAME

- **定义位置**: 第15行
- **值**: `"start-work"`

### KEYWORD_PATTERN

- **定义位置**: 第17行
- **值**: `/\b(ultrawork|ulw)\b/gi`

## 依赖关系

- `@opencode-ai/plugin`
- `../../features/boulder-state`
- `../../shared/logger`
- `../../features/claude-code-session-state`

## 代码统计

- 接口数量: 2
- 类数量: 0
- 函数数量: 3
- 常量数量: 2
- 类型定义数量: 0
- 导入模块数量: 4

