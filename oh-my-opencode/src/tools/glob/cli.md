# cli.ts

## 文件信息

- **路径**: src/tools/glob/cli.ts
- **目录**: src/tools/glob
- **行数**: 192

## 文件功能

提供了 5 个函数/工具,用于实现特定功能。

## 接口定义

### ResolvedCli

- **定义位置**: 第14行
- **属性**: path, ath, th, h, backend, ackend, ckend, kend, end, nd

## 函数定义

### buildRgArgs()

- **定义位置**: 第19行
- **参数**: `options: GlobOptions`
- **返回值**: `string[]`

### buildFindArgs()

- **定义位置**: 第34行
- **参数**: `options: GlobOptions`
- **返回值**: `string[]`

### buildPowerShellCommand()

- **定义位置**: 第56行
- **参数**: `options: GlobOptions`
- **返回值**: `string[]`

### getFileMtime()

- **定义位置**: 第80行
- **参数**: `filePath: string`
- **返回值**: `Promise<number>`

### runRgFiles()

- **定义位置**: 第91行
- **参数**: `options: GlobOptions,
  resolvedCli?: ResolvedCli`
- **返回值**: `Promise<GlobResult>`

## 依赖关系

- `bun`
- `./constants`
- `./types`
- `node:fs/promises`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 5
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 4

