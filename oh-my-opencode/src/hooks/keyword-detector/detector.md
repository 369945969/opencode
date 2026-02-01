# detector.ts

## 文件信息

- **路径**: src/hooks/keyword-detector/detector.ts
- **目录**: src/hooks/keyword-detector
- **行数**: 53

## 文件功能

提供了 5 个函数/工具,用于实现特定功能。

## 接口定义

### DetectedKeyword

- **定义位置**: 第7行
- **属性**: type, ype, pe, e, message, essage, ssage, sage, age, ge

## 函数定义

### removeCodeBlocks()

- **定义位置**: 第12行
- **参数**: `text: string`
- **返回值**: `string`

### resolveMessage()

- **定义位置**: 第19行
- **描述**: Resolves message to string, handling both static strings and dynamic functions. /
- **参数**: `message: string | ((agentName?: string`

### detectKeywords()

- **定义位置**: 第26行
- **参数**: `text: string, agentName?: string`
- **返回值**: `string[]`

### detectKeywordsWithType()

- **定义位置**: 第33行
- **参数**: `text: string, agentName?: string`
- **返回值**: `DetectedKeyword[]`

### extractPromptText()

- **定义位置**: 第45行
- **参数**: `parts: Array<{ type: string; text?: string }>`
- **返回值**: `string`

## 依赖关系

- `./constants`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 5
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 1

