# config.ts

## 文件信息

- **路径**: src/tools/lsp/config.ts
- **目录**: src/tools/lsp
- **行数**: 290

## 文件功能

提供了 8 个函数/工具,用于实现特定功能。

## 接口定义

### LspEntry

- **定义位置**: 第7行
- **属性**: disabled, isabled, sabled, abled, bled, led, ed, d, command, ommand

### ConfigJson

- **定义位置**: 第16行
- **属性**: lsp, sp, p

### ServerWithSource

- **定义位置**: 第22行
- **属性**: source, ource, urce, rce, ce, e

## 函数定义

### getConfigPaths()

- **定义位置**: 第35行

### loadAllConfigs()

- **定义位置**: 第45行
- **返回值**: `Map<ConfigSource, ConfigJson>`

### getMergedServers()

- **定义位置**: 第61行
- **返回值**: `ServerWithSource[]`

### findServerForExtension()

- **定义位置**: 第116行
- **参数**: `ext: string`
- **返回值**: `ServerLookupResult`

### getLanguageId()

- **定义位置**: 第159行
- **参数**: `ext: string`
- **返回值**: `string`

### isServerInstalled()

- **定义位置**: 第163行
- **参数**: `command: string[]`
- **返回值**: `boolean`

### getAllServers()

- **定义位置**: 第228行
- **返回值**: `Array<`

### getConfigPaths_()

- **定义位置**: 第287行

## 类型定义

- `ConfigSource`

## 依赖关系

- `fs`
- `path`
- `./constants`
- `./types`
- `../../shared`

## 代码统计

- 接口数量: 3
- 类数量: 0
- 函数数量: 8
- 常量数量: 0
- 类型定义数量: 1
- 导入模块数量: 5

