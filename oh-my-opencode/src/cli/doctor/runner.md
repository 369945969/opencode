# runner.ts

## 文件信息

- **路径**: src/cli/doctor/runner.ts
- **目录**: src/cli/doctor
- **行数**: 133

## 文件功能

提供了 6 个函数/工具,用于实现特定功能。

## 函数定义

### runCheck()

- **定义位置**: 第20行
- **参数**: `check: CheckDefinition`
- **返回值**: `Promise<CheckResult>`

### calculateSummary()

- **定义位置**: 第36行
- **参数**: `results: CheckResult[], duration: number`
- **返回值**: `DoctorSummary`

### determineExitCode()

- **定义位置**: 第47行
- **参数**: `results: CheckResult[]`
- **返回值**: `number`

### filterChecksByCategory()

- **定义位置**: 第52行
- **参数**: `checks: CheckDefinition[],
  category?: CheckCategory`
- **返回值**: `CheckDefinition[]`

### groupChecksByCategory()

- **定义位置**: 第60行
- **参数**: `checks: CheckDefinition[]`
- **返回值**: `Map<CheckCategory, CheckDefinition[]>`

### runDoctor()

- **定义位置**: 第83行
- **参数**: `options: DoctorOptions`
- **返回值**: `Promise<DoctorResult>`

## 依赖关系

- `./types`
- `./checks`
- `./constants`
- `./formatter`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 6
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 4

