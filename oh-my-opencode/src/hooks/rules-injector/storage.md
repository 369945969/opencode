# storage.ts

## 文件信息

- **路径**: src/hooks/rules-injector/storage.ts
- **目录**: src/hooks/rules-injector
- **行数**: 60

## 文件功能

提供了 4 个函数/工具,用于实现特定功能。

## 函数定义

### getStoragePath()

- **定义位置**: 第12行
- **参数**: `sessionID: string`
- **返回值**: `string`

### loadInjectedRules()

- **定义位置**: 第16行
- **参数**: `sessionID: string`

### saveInjectedRules()

- **定义位置**: 第36行
- **参数**: `sessionID: string,
  data: { contentHashes: Set<string>; realPaths: Set<string> }`

### clearInjectedRules()

- **定义位置**: 第54行
- **参数**: `sessionID: string`

## 依赖关系

- `node:fs`
- `node:path`
- `./constants`
- `./types`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 4
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 4

