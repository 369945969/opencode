# index.ts

## 文件信息

- **路径**: src/hooks/thinking-block-validator/index.ts
- **目录**: src/hooks/thinking-block-validator
- **行数**: 172

## 文件功能

这是模块的入口文件,统一导出本模块的所有公共 API。

## 接口定义

### MessageWithParts

- **定义位置**: 第19行
- **描述**: - Runs BEFORE API call vs AFTER API error - User never sees the error vs User sees error then recovery /
- **属性**: info, nfo, fo, o, parts, arts, rts, ts, s

## 函数定义

### isExtendedThinkingModel()

- **定义位置**: 第35行
- **描述**: Check if a model has extended thinking enabled Uses patterns from think-mode/switcher.ts for consistency /
- **参数**: `modelID: string`
- **返回值**: `boolean`

### hasContentParts()

- **定义位置**: 第56行
- **描述**: Check if a message has any content parts (tool_use, text, or other non-thinking content) /
- **参数**: `parts: Part[]`
- **返回值**: `boolean`

### startsWithThinkingBlock()

- **定义位置**: 第69行
- **描述**: Check if a message starts with a thinking/reasoning block /
- **参数**: `parts: Part[]`
- **返回值**: `boolean`

### findPreviousThinkingContent()

- **定义位置**: 第80行
- **描述**: Find the most recent thinking content from previous assistant messages /
- **参数**: `messages: MessageWithParts[],
  currentIndex: number`
- **返回值**: `string`

### prependThinkingBlock()

- **定义位置**: 第108行
- **描述**: Prepend a thinking block to a message's parts array /
- **参数**: `message: MessageWithParts,
  thinkingContent: string`

### createThinkingBlockValidatorHook()

- **定义位置**: 第133行
- **描述**: Validate and fix assistant messages that have tool_use but no thinking block /
- **返回值**: `MessagesTransformHook`

## 类型定义

- `MessagesTransformHook`

## 依赖关系

- `@opencode-ai/sdk`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 6
- 常量数量: 0
- 类型定义数量: 1
- 导入模块数量: 1

