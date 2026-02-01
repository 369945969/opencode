# storage.ts

## 文件信息

- **路径**: src/hooks/ralph-loop/storage.ts
- **目录**: src/hooks/ralph-loop
- **行数**: 116

## 文件功能

提供了 5 个函数/工具,用于实现特定功能。

## 函数定义

### getStateFilePath()

- **定义位置**: 第7行
- **参数**: `directory: string, customPath?: string`
- **返回值**: `string`

### readState()

- **定义位置**: 第13行
- **参数**: `directory: string, customPath?: string`
- **返回值**: `RalphLoopState | null`

### writeState()

- **定义位置**: 第58行
- **参数**: `directory: string,
  state: RalphLoopState,
  customPath?: string`
- **返回值**: `boolean`

### clearState()

- **定义位置**: 第90行
- **参数**: `directory: string, customPath?: string`
- **返回值**: `boolean`

### incrementIteration()

- **定义位置**: 第103行
- **参数**: `directory: string,
  customPath?: string`
- **返回值**: `RalphLoopState | null`

## 依赖关系

- `node:fs`
- `node:path`
- `../../shared/frontmatter`
- `./types`
- `./constants`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 5
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 5

