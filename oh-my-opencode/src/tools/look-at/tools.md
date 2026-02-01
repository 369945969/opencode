# tools.ts

## 文件信息

- **路径**: src/tools/look-at/tools.ts
- **目录**: src/tools/look-at
- **行数**: 215

## 文件功能

提供了 4 个函数/工具,用于实现特定功能。

## 接口定义

### LookAtArgsWithAlias

- **定义位置**: 第8行
- **属性**: path, ath, th, h

## 函数定义

### normalizeArgs()

- **定义位置**: 第12行
- **参数**: `args: LookAtArgsWithAlias`
- **返回值**: `LookAtArgs`

### validateArgs()

- **定义位置**: 第19行
- **参数**: `args: LookAtArgs`
- **返回值**: `string | null`

### inferMimeType()

- **定义位置**: 第29行
- **参数**: `filePath: string`
- **返回值**: `string`

### createLookAt()

- **定义位置**: 第67行
- **参数**: `ctx: PluginInput`
- **返回值**: `ToolDefinition`

## 依赖关系

- `node:path`
- `node:url`
- `@opencode-ai/plugin`
- `./constants`
- `./types`
- `../../shared/logger`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 4
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 6

