# storage.ts

## 文件信息

- **路径**: src/features/boulder-state/storage.ts
- **目录**: src/features/boulder-state
- **行数**: 151

## 文件功能

提供了 9 个函数/工具,用于实现特定功能。

## 函数定义

### getBoulderFilePath()

- **定义位置**: 第12行
- **参数**: `directory: string`
- **返回值**: `string`

### readBoulderState()

- **定义位置**: 第16行
- **参数**: `directory: string`
- **返回值**: `BoulderState | null`

### writeBoulderState()

- **定义位置**: 第31行
- **参数**: `directory: string, state: BoulderState`
- **返回值**: `boolean`

### appendSessionId()

- **定义位置**: 第47行
- **参数**: `directory: string, sessionId: string`
- **返回值**: `BoulderState | null`

### clearBoulderState()

- **定义位置**: 第61行
- **参数**: `directory: string`
- **返回值**: `boolean`

### findPrometheusPlans()

- **定义位置**: 第79行
- **描述**: Find Prometheus plan files for this project. Prometheus stores plans at: {project}/.sisyphus/plans/{name}.md /
- **参数**: `directory: string`
- **返回值**: `string[]`

### getPlanProgress()

- **定义位置**: 第105行
- **描述**: Parse a plan file and count checkbox progress. /
- **参数**: `planPath: string`
- **返回值**: `PlanProgress`

### getPlanName()

- **定义位置**: 第133行
- **描述**: Extract plan name from file path. /
- **参数**: `planPath: string`
- **返回值**: `string`

### createBoulderState()

- **定义位置**: 第140行
- **描述**: Create a new boulder state for a plan. /
- **参数**: `planPath: string,
  sessionId: string`
- **返回值**: `BoulderState`

## 依赖关系

- `node:fs`
- `node:path`
- `./types`
- `./constants`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 9
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 4

