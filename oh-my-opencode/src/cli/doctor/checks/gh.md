# gh.ts

## 文件信息

- **路径**: src/cli/doctor/checks/gh.ts
- **目录**: src/cli/doctor/checks
- **行数**: 172

## 文件功能

提供了 6 个函数/工具,用于实现特定功能。

## 接口定义

### GhCliInfo

- **定义位置**: 第4行
- **属性**: installed, nstalled, stalled, talled, alled, lled, led, ed, d, version

## 函数定义

### checkBinaryExists()

- **定义位置**: 第14行
- **参数**: `binary: string`
- **返回值**: `Promise<`

### getGhVersion()

- **定义位置**: 第28行
- **返回值**: `Promise<string | null>`

### getGhAuthStatus()

- **定义位置**: 第43行
- **返回值**: `Promise<`

### getGhCliInfo()

- **定义位置**: 第93行
- **返回值**: `Promise<GhCliInfo>`

### checkGhCli()

- **定义位置**: 第121行
- **返回值**: `Promise<CheckResult>`

### getGhCliCheckDefinition()

- **定义位置**: 第163行
- **返回值**: `CheckDefinition`

## 依赖关系

- `../types`
- `../constants`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 6
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 2

