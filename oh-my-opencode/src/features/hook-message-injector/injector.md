# injector.ts

## 文件信息

- **路径**: src/features/hook-message-injector/injector.ts
- **目录**: src/features/hook-message-injector
- **行数**: 204

## 文件功能

提供了 6 个函数/工具,用于实现特定功能。

## 接口定义

### StoredMessage

- **定义位置**: 第6行
- **属性**: agent, gent, ent, nt, t, model, odel, del, el, l

## 函数定义

### findNearestMessageWithFields()

- **定义位置**: 第12行
- **参数**: `messageDir: string`
- **返回值**: `StoredMessage | null`

### findFirstMessageWithAgent()

- **定义位置**: 第57行
- **描述**: Finds the FIRST (oldest) message in the session with agent field. This is used to get the original agent that started the session, avoiding issues where newer messages may have a different agent due to OpenCode's internal agent switching. /
- **参数**: `messageDir: string`
- **返回值**: `string | null`

### generateMessageId()

- **定义位置**: 第80行
- **返回值**: `string`

### generatePartId()

- **定义位置**: 第86行
- **返回值**: `string`

### getOrCreateMessageDir()

- **定义位置**: 第92行
- **参数**: `sessionID: string`
- **返回值**: `string`

### injectHookMessage()

- **定义位置**: 第113行
- **参数**: `sessionID: string,
  hookContent: string,
  originalMessage: OriginalMessageContext`
- **返回值**: `boolean`

## 依赖关系

- `node:fs`
- `node:path`
- `./constants`
- `./types`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 6
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 4

