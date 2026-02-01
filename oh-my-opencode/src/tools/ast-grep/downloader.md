# downloader.ts

## 文件信息

- **路径**: src/tools/ast-grep/downloader.ts
- **目录**: src/tools/ast-grep
- **行数**: 129

## 文件功能

提供了 6 个函数/工具,用于实现特定功能。

## 接口定义

### PlatformInfo

- **定义位置**: 第23行
- **属性**: arch, rch, ch, h, os, s

## 函数定义

### getAstGrepVersion()

- **定义位置**: 第13行
- **返回值**: `string`

### getCacheDir()

- **定义位置**: 第38行
- **返回值**: `string`

### getBinaryName()

- **定义位置**: 第50行
- **返回值**: `string`

### getCachedBinaryPath()

- **定义位置**: 第54行
- **返回值**: `string | null`

### downloadAstGrep()

- **定义位置**: 第61行
- **参数**: `version: string = DEFAULT_VERSION`
- **返回值**: `Promise<string | null>`

### ensureAstGrepBinary()

- **定义位置**: 第120行
- **返回值**: `Promise<string | null>`

## 常量定义

### REPO

- **定义位置**: 第7行
- **值**: `"ast-grep/ast-grep"`

### DEFAULT_VERSION

- **定义位置**: 第11行
- **值**: `"0.40.0"`

## 依赖关系

- `fs`
- `path`
- `os`
- `module`
- `../../shared`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 6
- 常量数量: 2
- 类型定义数量: 0
- 导入模块数量: 5

