# session-cursor.ts

## 文件功能概述

该文件提供了会话消息游标管理功能。用于跟踪会话中已处理的消息位置，实现增量式消息获取，避免重复处理相同消息。

## 主要函数/类详细说明

### 类型定义

#### `CursorMessage`
- **属性**:
  - `info?`: 消息信息
    - `id?`: 消息 ID
    - `time?`: 消息时间戳

### 核心函数

#### `consumeNewMessages<T>(sessionID, messages): T[]`
消费新消息（只返回上次处理后的新消息）。
- **参数**:
  - `sessionID`: 会话 ID
  - `messages`: 当前消息列表
- **返回值**: 新消息数组
- **逻辑**:
  1. 为每条消息生成唯一键（基于 ID 或时间戳+索引）
  2. 检查上次处理的位置
  3. 返回上次位置之后的新消息
  4. 更新游标位置

#### `resetMessageCursor(sessionID?): void`
重置消息游标。
- **参数**: `sessionID` - 可选，指定会话或全部重置

### 消息键生成策略

消息键按以下优先级生成：
1. **ID**: `id:{message.info.id}`
2. **时间戳**: `t:{time}:{index}`
3. **索引**: `i:{index}`

## 使用示例

```typescript
import { consumeNewMessages, resetMessageCursor } from './session-cursor';

// 模拟消息列表
const messages = [
  { info: { id: 'msg-1', time: 1000 } },
  { info: { id: 'msg-2', time: 2000 } },
  { info: { id: 'msg-3', time: 3000 } }
];

// 第一次消费 - 获取所有消息
const newMessages1 = consumeNewMessages('session-123', messages);
console.log(newMessages1.length); // 3

// 添加新消息后再次消费
messages.push({ info: { id: 'msg-4', time: 4000 } });
const newMessages2 = consumeNewMessages('session-123', messages);
console.log(newMessages2.length); // 1 (只有 msg-4)

// 重置游标
resetMessageCursor('session-123');
```

## 依赖关系

- **无外部依赖**

## 注意事项

1. **会话隔离**: 每个会话有独立的游标状态
2. **内存管理**: 会话游标存储在 Map 中，注意清理不再使用的会话
3. **消息变化**: 如果历史消息发生变化（非追加），会自动重置到开头
4. **键生成**: 优先使用消息 ID，其次使用时间戳，最后使用索引
