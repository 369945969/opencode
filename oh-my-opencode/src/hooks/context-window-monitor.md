# context-window-monitor.ts

## 文件信息

- **路径**: src/hooks/context-window-monitor.ts
- **目录**: src/hooks
- **行数**: 100

## 文件功能

提供了 1 个函数/工具,用于实现特定功能。

## 接口定义

### AssistantMessageInfo

- **定义位置**: 第18行
- **属性**: role, ole, le, e, providerID, roviderID, oviderID, viderID, iderID, derID

### MessageWrapper

- **定义位置**: 第29行
- **属性**: info, nfo, fo, o

## 函数定义

### createContextWindowMonitorHook()

- **定义位置**: 第33行
- **参数**: `ctx: PluginInput`

## 常量定义

### ANTHROPIC_DISPLAY_LIMIT

- **定义位置**: 第4行
- **值**: `1_000_000`

### ANTHROPIC_ACTUAL_LIMIT

- **定义位置**: 第5行
- **值**: `process.env.ANTHROPIC_1M_CONTEXT === "true" ||`

### CONTEXT_WARNING_THRESHOLD

- **定义位置**: 第10行
- **值**: `0.70`

### CONTEXT_REMINDER

- **定义位置**: 第12行
- **值**: ``${createSystemDirective(SystemDirectiveTypes.CONTEXT_WINDOW_MONITOR)}`

## 依赖关系

- `@opencode-ai/plugin`
- `../shared/system-directive`

## 代码统计

- 接口数量: 2
- 类数量: 0
- 函数数量: 1
- 常量数量: 4
- 类型定义数量: 0
- 导入模块数量: 2

