# constants.ts

## 文件信息

- **路径**: src/hooks/session-recovery/constants.ts
- **目录**: src/hooks/session-recovery
- **行数**: 11

## 文件功能

TypeScript 模块文件,包含类型定义和常量导出。

## 常量定义

### OPENCODE_STORAGE

- **定义位置**: 第4行
- **值**: `getOpenCodeStorageDir()`

### MESSAGE_STORAGE

- **定义位置**: 第5行
- **值**: `join(OPENCODE_STORAGE, "message")`

### PART_STORAGE

- **定义位置**: 第6行
- **值**: `join(OPENCODE_STORAGE, "part")`

### THINKING_TYPES

- **定义位置**: 第8行
- **值**: `new Set(["thinking", "redacted_thinking", "reasoning"])`

### META_TYPES

- **定义位置**: 第9行
- **值**: `new Set(["step-start", "step-finish"])`

### CONTENT_TYPES

- **定义位置**: 第10行
- **值**: `new Set(["text", "tool", "tool_use", "tool_result"])`

## 依赖关系

- `node:path`
- `../../shared/data-path`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 0
- 常量数量: 6
- 类型定义数量: 0
- 导入模块数量: 2

