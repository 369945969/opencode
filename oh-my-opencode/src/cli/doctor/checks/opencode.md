# opencode.ts

## 文件信息

- **路径**: src/cli/doctor/checks/opencode.ts
- **目录**: src/cli/doctor/checks
- **行数**: 179

## 文件功能

提供了 10 个函数/工具,用于实现特定功能。

## 函数定义

### getBinaryLookupCommand()

- **定义位置**: 第6行
- **参数**: `platform: NodeJS.Platform`
- **返回值**: `"which" | "where"`

### parseBinaryPaths()

- **定义位置**: 第10行
- **参数**: `output: string`
- **返回值**: `string[]`

### selectBinaryPath()

- **定义位置**: 第17行
- **参数**: `paths: string[],
  platform: NodeJS.Platform`
- **返回值**: `string | null`

### buildVersionCommand()

- **定义位置**: 第33行
- **参数**: `binaryPath: string,
  platform: NodeJS.Platform`
- **返回值**: `string[]`

### findOpenCodeBinary()

- **定义位置**: 第55行
- **返回值**: `Promise<`

### getOpenCodeVersion()

- **定义位置**: 第76行
- **参数**: `binaryPath: string,
  platform: NodeJS.Platform = process.platform`
- **返回值**: `Promise<string | null>`

### compareVersions()

- **定义位置**: 第94行
- **参数**: `current: string, minimum: string`
- **返回值**: `boolean`

### getOpenCodeInfo()

- **定义位置**: 第112行
- **返回值**: `Promise<OpenCodeInfo>`

### checkOpenCodeInstallation()

- **定义位置**: 第134行
- **返回值**: `Promise<CheckResult>`

### getOpenCodeCheckDefinition()

- **定义位置**: 第170行
- **返回值**: `CheckDefinition`

## 常量定义

### WINDOWS_EXECUTABLE_EXTS

- **定义位置**: 第4行
- **值**: `[".exe", ".cmd", ".bat", ".ps1"]`

## 依赖关系

- `../types`
- `../constants`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 10
- 常量数量: 1
- 类型定义数量: 0
- 导入模块数量: 2

