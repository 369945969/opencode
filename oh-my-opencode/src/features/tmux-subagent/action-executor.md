# action-executor.ts

## 文件信息

- **路径**: src/features/tmux-subagent/action-executor.ts
- **目录**: src/features/tmux-subagent
- **行数**: 98

## 文件功能

提供了 3 个函数/工具,用于实现特定功能。

## 接口定义

### ActionResult

- **定义位置**: 第6行
- **属性**: success, uccess, ccess, cess, ess, ss, s, paneId, aneId, neId

### ExecuteActionsResult

- **定义位置**: 第12行
- **属性**: success, uccess, ccess, cess, ess, ss, s, spawnedPaneId, pawnedPaneId, awnedPaneId

### ExecuteContext

- **定义位置**: 第18行
- **属性**: config, onfig, nfig, fig, ig, g, serverUrl, erverUrl, rverUrl, verUrl

## 函数定义

### enforceMainPane()

- **定义位置**: 第24行
- **参数**: `windowState: WindowState`
- **返回值**: `Promise<void>`

### executeAction()

- **定义位置**: 第29行
- **参数**: `action: PaneAction,
  ctx: ExecuteContext`
- **返回值**: `Promise<ActionResult>`

### executeActions()

- **定义位置**: 第74行
- **参数**: `actions: PaneAction[],
  ctx: ExecuteContext`
- **返回值**: `Promise<ExecuteActionsResult>`

## 依赖关系

- `../../config/schema`
- `./types`
- `../../shared/tmux`
- `../../shared`

## 代码统计

- 接口数量: 3
- 类数量: 0
- 函数数量: 3
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 4

