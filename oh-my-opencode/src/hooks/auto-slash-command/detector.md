# detector.ts

## 文件信息

- **路径**: src/hooks/auto-slash-command/detector.ts
- **目录**: src/hooks/auto-slash-command
- **行数**: 66

## 文件功能

提供了 5 个函数/工具,用于实现特定功能。

## 函数定义

### removeCodeBlocks()

- **定义位置**: 第9行
- **参数**: `text: string`
- **返回值**: `string`

### parseSlashCommand()

- **定义位置**: 第13行
- **参数**: `text: string`
- **返回值**: `ParsedSlashCommand | null`

### isExcludedCommand()

- **定义位置**: 第33行
- **参数**: `command: string`
- **返回值**: `boolean`

### detectSlashCommand()

- **定义位置**: 第37行
- **参数**: `text: string`
- **返回值**: `ParsedSlashCommand | null`

### extractPromptText()

- **定义位置**: 第58行
- **参数**: `parts: Array<{ type: string; text?: string }>`
- **返回值**: `string`

## 常量定义

### CODE_BLOCK_PATTERN

- **定义位置**: 第7行
- **值**: `/```[\s\S]*?```/g`

## 依赖关系

- `./constants`
- `./types`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 5
- 常量数量: 1
- 类型定义数量: 0
- 导入模块数量: 2

