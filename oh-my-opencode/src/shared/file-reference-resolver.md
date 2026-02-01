# file-reference-resolver.ts

## 文件信息

- **路径**: src/shared/file-reference-resolver.ts
- **目录**: src/shared
- **行数**: 86

## 文件功能

提供了 4 个函数/工具,用于实现特定功能。

## 接口定义

### FileMatch

- **定义位置**: 第4行
- **属性**: fullMatch, ullMatch, llMatch, lMatch, Match, atch, tch, ch, h, filePath

## 函数定义

### findFileReferences()

- **定义位置**: 第13行
- **参数**: `text: string`
- **返回值**: `FileMatch[]`

### resolveFilePath()

- **定义位置**: 第31行
- **参数**: `filePath: string, cwd: string`
- **返回值**: `string`

### readFileContent()

- **定义位置**: 第38行
- **参数**: `resolvedPath: string`
- **返回值**: `string`

### resolveFileReferencesInText()

- **定义位置**: 第52行
- **参数**: `text: string,
  cwd: string = process.cwd(`

## 常量定义

### FILE_REFERENCE_PATTERN

- **定义位置**: 第11行
- **值**: `/@([^\s@]+)/g`

## 依赖关系

- `fs`
- `path`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 4
- 常量数量: 1
- 类型定义数量: 0
- 导入模块数量: 2

