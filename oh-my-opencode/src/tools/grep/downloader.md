# downloader.ts

## 文件信息

- **路径**: src/tools/grep/downloader.ts
- **目录**: src/tools/grep
- **行数**: 146

## 文件功能

提供了 9 个函数/工具,用于实现特定功能。

## 函数定义

### findFileRecursive()

- **定义位置**: 第6行
- **参数**: `dir: string, filename: string`
- **返回值**: `string | null`

### getPlatformKey()

- **定义位置**: 第30行
- **返回值**: `string`

### getInstallDir()

- **定义位置**: 第34行
- **返回值**: `string`

### getRgPath()

- **定义位置**: 第39行
- **返回值**: `string`

### downloadFile()

- **定义位置**: 第44行
- **参数**: `url: string, destPath: string`
- **返回值**: `Promise<void>`

### extractTarGz()

- **定义位置**: 第54行
- **参数**: `archivePath: string, destDir: string`
- **返回值**: `Promise<void>`

### extractZip()

- **定义位置**: 第78行
- **参数**: `archivePath: string, destDir: string`
- **返回值**: `Promise<void>`

### downloadAndInstallRipgrep()

- **定义位置**: 第92行
- **返回值**: `Promise<string>`

### getInstalledRipgrepPath()

- **定义位置**: 第142行
- **返回值**: `string | null`

## 常量定义

### RG_VERSION

- **定义位置**: 第20行
- **值**: `"14.1.1"`

## 依赖关系

- `node:fs`
- `node:path`
- `bun`
- `../../shared`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 9
- 常量数量: 1
- 类型定义数量: 0
- 导入模块数量: 4

