# cli.ts

## 文件信息

- **路径**: src/tools/grep/cli.ts
- **目录**: src/tools/grep
- **行数**: 230

## 文件功能

提供了 7 个函数/工具,用于实现特定功能。

## 函数定义

### buildRgArgs()

- **定义位置**: 第16行
- **参数**: `options: GrepOptions`
- **返回值**: `string[]`

### buildGrepArgs()

- **定义位置**: 第57行
- **参数**: `options: GrepOptions`
- **返回值**: `string[]`

### buildArgs()

- **定义位置**: 第85行
- **参数**: `options: GrepOptions, backend: GrepBackend`
- **返回值**: `string[]`

### parseOutput()

- **定义位置**: 第89行
- **参数**: `output: string`
- **返回值**: `GrepMatch[]`

### parseCountOutput()

- **定义位置**: 第111行
- **参数**: `output: string`
- **返回值**: `CountResult[]`

### runRg()

- **定义位置**: 第132行
- **参数**: `options: GrepOptions`
- **返回值**: `Promise<GrepResult>`

### runRgCount()

- **定义位置**: 第196行
- **参数**: `options: Omit<GrepOptions, "context">`
- **返回值**: `Promise<CountResult[]>`

## 依赖关系

- `bun`
- `./constants`
- `./types`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 7
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 3

