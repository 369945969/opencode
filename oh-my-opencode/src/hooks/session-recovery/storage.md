# storage.ts

## 文件信息

- **路径**: src/hooks/session-recovery/storage.ts
- **目录**: src/hooks/session-recovery
- **行数**: 391

## 文件功能

提供了 19 个函数/工具,用于实现特定功能。

## 函数定义

### generatePartId()

- **定义位置**: 第6行
- **返回值**: `string`

### getMessageDir()

- **定义位置**: 第12行
- **参数**: `sessionID: string`
- **返回值**: `string`

### readMessages()

- **定义位置**: 第30行
- **参数**: `sessionID: string`
- **返回值**: `StoredMessageMeta[]`

### readParts()

- **定义位置**: 第53行
- **参数**: `messageID: string`
- **返回值**: `StoredPart[]`

### hasContent()

- **定义位置**: 第71行
- **参数**: `part: StoredPart`
- **返回值**: `boolean`

### messageHasContent()

- **定义位置**: 第91行
- **参数**: `messageID: string`
- **返回值**: `boolean`

### injectTextPart()

- **定义位置**: 第96行
- **参数**: `sessionID: string, messageID: string, text: string`
- **返回值**: `boolean`

### findEmptyMessages()

- **定义位置**: 第121行
- **参数**: `sessionID: string`
- **返回值**: `string[]`

### findEmptyMessageByIndex()

- **定义位置**: 第134行
- **参数**: `sessionID: string, targetIndex: number`
- **返回值**: `string | null`

### findFirstEmptyMessage()

- **定义位置**: 第162行
- **参数**: `sessionID: string`
- **返回值**: `string | null`

### findMessagesWithThinkingBlocks()

- **定义位置**: 第167行
- **参数**: `sessionID: string`
- **返回值**: `string[]`

### findMessagesWithThinkingOnly()

- **定义位置**: 第184行
- **参数**: `sessionID: string`
- **返回值**: `string[]`

### findMessagesWithOrphanThinking()

- **定义位置**: 第206行
- **参数**: `sessionID: string`
- **返回值**: `string[]`

### findLastThinkingContent()

- **定义位置**: 第239行
- **描述**: Find the most recent thinking content from previous assistant messages Following Anthropic's recommendation to include thinking blocks from previous turns /
- **参数**: `sessionID: string, beforeMessageID: string`
- **返回值**: `string`

### prependThinkingPart()

- **定义位置**: 第270行
- **参数**: `sessionID: string, messageID: string`
- **返回值**: `boolean`

### stripThinkingParts()

- **定义位置**: 第298行
- **参数**: `messageID: string`
- **返回值**: `boolean`

### replaceEmptyTextParts()

- **定义位置**: 第321行
- **参数**: `messageID: string, replacementText: string`
- **返回值**: `boolean`

### findMessagesWithEmptyTextParts()

- **定义位置**: 第350行
- **参数**: `sessionID: string`
- **返回值**: `string[]`

### findMessageByIndexNeedingThinking()

- **定义位置**: 第370行
- **参数**: `sessionID: string, targetIndex: number`
- **返回值**: `string | null`

## 依赖关系

- `node:fs`
- `node:path`
- `./constants`
- `./types`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 19
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 4

