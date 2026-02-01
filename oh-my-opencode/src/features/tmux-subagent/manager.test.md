# manager.test.ts

## 文件信息

- **路径**: src/features/tmux-subagent/manager.test.ts
- **目录**: src/features/tmux-subagent
- **行数**: 691

## 文件功能

这是一个测试文件,使用 Bun 测试框架编写。

## 函数定义

### createMockContext()

- **定义位置**: 第66行
- **参数**: `overrides?: {
  sessionStatusResult?: { data?: Record<string, { type: string }> }
}`

### createSessionCreatedEvent()

- **定义位置**: 第88行
- **参数**: `id: string,
  parentID: string | undefined,
  title: string`

### createWindowState()

- **定义位置**: 第101行
- **参数**: `overrides?: Partial<WindowState>`
- **返回值**: `WindowState`

## 常量定义

### mockQueryWindowState

- **定义位置**: 第12行
- **值**: `mock<(paneId: string) => Promise<WindowState | null>>(`

### mockPaneExists

- **定义位置**: 第20行
- **值**: `mock<(paneId: string) => Promise<boolean>>(async () => true)`

### mockExecuteActions

- **定义位置**: 第21行
- **值**: `mock<(`

### mockExecuteAction

- **定义位置**: 第29行
- **值**: `mock<(`

### mockIsInsideTmux

- **定义位置**: 第33行
- **值**: `mock<() => boolean>(() => true)`

### mockGetCurrentPaneId

- **定义位置**: 第34行
- **值**: `mock<() => string | undefined>(() => '%0')`

### trackedSessions

- **定义位置**: 第64行
- **值**: `new Set<string>()`

## 类型定义

- `ExecuteActionsResult`

## 依赖关系

- `bun:test`
- `../../config/schema`
- `./types`
- `./action-executor`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 3
- 常量数量: 7
- 类型定义数量: 1
- 导入模块数量: 4

