# completion.ts

## 文件信息

- **路径**: src/cli/run/completion.ts
- **目录**: src/cli/run
- **行数**: 80

## 文件功能

提供了 5 个函数/工具,用于实现特定功能。

## 函数定义

### checkCompletionConditions()

- **定义位置**: 第4行
- **参数**: `ctx: RunContext`
- **返回值**: `Promise<boolean>`

### areAllTodosComplete()

- **定义位置**: 第21行
- **参数**: `ctx: RunContext`
- **返回值**: `Promise<boolean>`

### areAllChildrenIdle()

- **定义位置**: 第37行
- **参数**: `ctx: RunContext`
- **返回值**: `Promise<boolean>`

### fetchAllStatuses()

- **定义位置**: 第42行
- **参数**: `ctx: RunContext`
- **返回值**: `Promise<Record<string, SessionStatus>>`

### areAllDescendantsIdle()

- **定义位置**: 第49行
- **参数**: `ctx: RunContext,
  sessionID: string,
  allStatuses: Record<string, SessionStatus>`
- **返回值**: `Promise<boolean>`

## 依赖关系

- `./types`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 5
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 1

