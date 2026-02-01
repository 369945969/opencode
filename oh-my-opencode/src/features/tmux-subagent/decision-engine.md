# decision-engine.ts

## 文件信息

- **路径**: src/features/tmux-subagent/decision-engine.ts
- **目录**: src/features/tmux-subagent
- **行数**: 387

## 文件功能

提供了 18 个函数/工具,用于实现特定功能。

## 接口定义

### SessionMapping

- **定义位置**: 第4行
- **属性**: sessionId, essionId, ssionId, sionId, ionId, onId, nId, Id, d, paneId

### GridCapacity

- **定义位置**: 第10行
- **属性**: cols, ols, ls, s, rows, ows, ws, total, otal, tal

### GridSlot

- **定义位置**: 第16行
- **属性**: row, ow, w, col, ol, l

### GridPlan

- **定义位置**: 第21行
- **属性**: cols, ols, ls, s, rows, ows, ws, slotWidth, lotWidth, otWidth

### SpawnTarget

- **定义位置**: 第28行
- **属性**: targetPaneId, argetPaneId, rgetPaneId, getPaneId, etPaneId, tPaneId, PaneId, aneId, neId, eId

## 函数定义

### getColumnCount()

- **定义位置**: 第41行
- **参数**: `paneCount: number`
- **返回值**: `number`

### getColumnWidth()

- **定义位置**: 第46行
- **参数**: `agentAreaWidth: number, paneCount: number`
- **返回值**: `number`

### isSplittableAtCount()

- **定义位置**: 第52行
- **参数**: `agentAreaWidth: number, paneCount: number`
- **返回值**: `boolean`

### findMinimalEvictions()

- **定义位置**: 第57行
- **参数**: `agentAreaWidth: number, currentCount: number`
- **返回值**: `number | null`

### canSplitPane()

- **定义位置**: 第66行
- **参数**: `pane: TmuxPaneInfo, direction: SplitDirection`
- **返回值**: `boolean`

### canSplitPaneAnyDirection()

- **定义位置**: 第73行
- **参数**: `pane: TmuxPaneInfo`
- **返回值**: `boolean`

### getBestSplitDirection()

- **定义位置**: 第77行
- **参数**: `pane: TmuxPaneInfo`
- **返回值**: `SplitDirection | null`

### calculateCapacity()

- **定义位置**: 第87行
- **参数**: `windowWidth: number,
  windowHeight: number`
- **返回值**: `GridCapacity`

### computeGridPlan()

- **定义位置**: 第98行
- **参数**: `windowWidth: number,
  windowHeight: number,
  paneCount: number`
- **返回值**: `GridPlan`

### mapPaneToSlot()

- **定义位置**: 第134行
- **参数**: `pane: TmuxPaneInfo,
  plan: GridPlan,
  mainPaneWidth: number`
- **返回值**: `GridSlot`

### buildOccupancy()

- **定义位置**: 第153行
- **参数**: `agentPanes: TmuxPaneInfo[],
  plan: GridPlan,
  mainPaneWidth: number`
- **返回值**: `Map<string, TmuxPaneInfo>`

### findFirstEmptySlot()

- **定义位置**: 第167行
- **参数**: `occupancy: Map<string, TmuxPaneInfo>,
  plan: GridPlan`
- **返回值**: `GridSlot`

### findSplittableTarget()

- **定义位置**: 第182行
- **参数**: `state: WindowState,
  preferredDirection?: SplitDirection`
- **返回值**: `SpawnTarget | null`

### findSpawnTarget()

- **定义位置**: 第231行
- **参数**: `state: WindowState`
- **返回值**: `SpawnTarget | null`

### findOldestSession()

- **定义位置**: 第235行
- **参数**: `mappings: SessionMapping[]`
- **返回值**: `SessionMapping | null`

### findOldestAgentPane()

- **定义位置**: 第242行
- **参数**: `agentPanes: TmuxPaneInfo[],
  sessionMappings: SessionMapping[]`
- **返回值**: `TmuxPaneInfo | null`

### decideSpawnActions()

- **定义位置**: 第270行
- **参数**: `state: WindowState,
  sessionId: string,
  description: string,
  _config: CapacityConfig,
  sessionMappings: SessionMapping[]`
- **返回值**: `SpawnDecision`

### decideCloseAction()

- **定义位置**: 第374行
- **参数**: `state: WindowState,
  sessionId: string,
  sessionMappings: SessionMapping[]`
- **返回值**: `PaneAction | null`

## 常量定义

### MAIN_PANE_RATIO

- **定义位置**: 第33行
- **值**: `0.5`

### MAX_COLS

- **定义位置**: 第34行
- **值**: `2`

### MAX_ROWS

- **定义位置**: 第35行
- **值**: `3`

### MAX_GRID_SIZE

- **定义位置**: 第36行
- **值**: `4`

### DIVIDER_SIZE

- **定义位置**: 第37行
- **值**: `1`

### MIN_SPLIT_WIDTH

- **定义位置**: 第38行
- **值**: `2 * MIN_PANE_WIDTH + DIVIDER_SIZE`

### MIN_SPLIT_HEIGHT

- **定义位置**: 第39行
- **值**: `2 * MIN_PANE_HEIGHT + DIVIDER_SIZE`

## 依赖关系

- `./types`

## 代码统计

- 接口数量: 5
- 类数量: 0
- 函数数量: 18
- 常量数量: 7
- 类型定义数量: 0
- 导入模块数量: 1

