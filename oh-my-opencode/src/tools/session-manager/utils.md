# session-manager/utils.ts

## 文件功能概述

Session Manager 工具的工具函数文件，提供格式化输出、日期过滤和搜索功能。这些函数用于将原始数据转换为人类可读的格式。

## 主要函数

### formatSessionList(sessionIDs)
格式化会话列表为 Markdown 表格。

**参数**：
- `sessionIDs: string[]` - 会话 ID 列表

**返回**：`Promise<string>` - 格式化的表格字符串

**功能**：
- 获取每个会话的信息
- 构建表格头部和分隔符
- 计算列宽并格式化行
- 返回 Markdown 表格

**输出格式**：
```markdown
| Session ID | Messages | First      | Last       | Agents       |
|------------|----------|------------|------------|--------------|
| ses_abc123 | 45       | 2025-12-20 | 2025-12-24 | build, oracle|
```

### formatSessionMessages(messages, includeTodos, todos)
格式化会话消息为可读文本。

**参数**：
- `messages: SessionMessage[]` - 消息列表
- `includeTodos?: boolean` - 是否包含待办
- `todos?: TodoItem[]` - 待办事项列表

**返回**：`string` - 格式化的消息文本

**功能**：
- 格式化每条消息的时间戳和角色
- 处理不同类型的消息部分（text, thinking, tool_use, tool_result）
- 可选添加待办事项列表
- 截断长内容以保持可读性

**输出格式**：
```markdown
[assistant] 2025-12-20T10:30:00.000Z
Hello, how can I help?

[user] 2025-12-20T10:30:15.000Z
I need help with...
```

### formatSessionInfo(info)
格式化会话信息为可读文本。

**参数**：
- `info: SessionInfo` - 会话信息

**返回**：`string` - 格式化的信息文本

**功能**：
- 显示会话基本统计
- 计算并显示持续时间
- 显示待办和转录状态

**输出格式**：
```markdown
Session ID: ses_abc123
Messages: 45
Date Range: 2025-12-20T10:30:00.000Z to 2025-12-24T15:45:30.000Z
Duration: 4 days, 5 hours
Agents Used: build, oracle, librarian
Has Todos: Yes (12 items, 8 completed)
Has Transcript: Yes (234 entries)
```

### formatSearchResults(results)
格式化搜索结果为可读文本。

**参数**：
- `results: SearchResult[]` - 搜索结果列表

**返回**：`string` - 格式化的结果文本

**功能**：
- 显示匹配总数
- 格式化每个匹配项
- 显示匹配片段和次数

**输出格式**：
```markdown
Found 3 matches:

[ses_abc123] Message msg_001 (user) 2025-12-20T10:30:00.000Z
  ...implement the **session manager** tool...
  Matches: 2

[ses_abc123] Message msg_005 (assistant) 2025-12-20T10:45:00.000Z
  ...I'll create a **session manager** with full search...
  Matches: 1
```

### filterSessionsByDate(sessionIDs, fromDate, toDate)
按日期范围过滤会话。

**参数**：
- `sessionIDs: string[]` - 会话 ID 列表
- `fromDate?: string` - 起始日期（ISO 8601）
- `toDate?: string` - 结束日期（ISO 8601）

**返回**：`Promise<string[]>` - 过滤后的会话 ID 列表

**功能**：
- 解析日期字符串
- 获取每个会话的最后消息时间
- 过滤出在日期范围内的会话

### searchInSession(sessionID, query, caseSensitive, maxResults)
在单个会话中搜索内容。

**参数**：
- `sessionID: string` - 会话 ID
- `query: string` - 搜索查询
- `caseSensitive: boolean` - 区分大小写（默认 false）
- `maxResults?: number` - 最大结果数

**返回**：`Promise<SearchResult[]>` - 搜索结果列表

**功能**：
- 读取会话的所有消息
- 在文本部分中搜索查询
- 计算匹配次数
- 提取匹配片段（前后 50 字符上下文）
- 限制结果数量

**搜索逻辑**：
1. 读取会话消息
2. 遍历每条消息的每个部分
3. 在 text 类型的部分中搜索
4. 计算匹配次数（split 方法）
5. 提取匹配位置周围的上下文
6. 构建搜索结果对象

## 代码逻辑流程

```
formatSessionList()
├── 获取所有会话信息
├── 构建表格头部
├── 计算列宽
├── 格式化每一行
└── 返回 Markdown 表格

formatSessionMessages()
├── 遍历消息列表
│   ├── 格式化时间戳和角色
│   ├── 遍历消息部分
│   │   ├── text: 显示文本内容
│   │   ├── thinking: 显示思考内容（截断）
│   │   ├── tool_use: 显示工具调用
│   │   └── tool_result: 显示工具结果（截断）
│   └── 添加空行分隔
├── 可选：添加待办事项
└── 返回格式化文本

searchInSession()
├── 读取会话消息
├── 准备搜索查询（处理大小写）
├── 遍历消息
│   ├── 遍历消息部分
│   │   └── 如果是 text 类型
│   │       ├── 搜索匹配
│   │       ├── 计算匹配次数
│   │       └── 提取匹配片段
│   └── 如果有匹配，添加结果
├── 应用结果限制
└── 返回结果列表
```

## 依赖关系

### 内部依赖
- `./types` - 类型定义
- `./storage` - 存储操作（getSessionInfo, readSessionMessages）

### 无外部依赖
不依赖外部模块。

## 使用示例

```typescript
import { 
  formatSessionList,
  formatSessionMessages,
  formatSessionInfo,
  formatSearchResults,
  filterSessionsByDate,
  searchInSession
} from './utils';

// 格式化会话列表
const table = await formatSessionList(['ses_001', 'ses_002']);

// 格式化消息
const messages = await readSessionMessages('ses_001');
const formatted = formatSessionMessages(messages, true, todos);

// 格式化会话信息
const info = await getSessionInfo('ses_001');
const infoText = formatSessionInfo(info);

// 搜索内容
const results = await searchInSession('ses_001', 'error', false, 10);
const searchText = formatSearchResults(results);

// 按日期过滤
const filtered = await filterSessionsByDate(
  ['ses_001', 'ses_002'],
  '2025-12-01',
  '2025-12-31'
);
```

## 注意事项

1. **表格格式**：使用 Markdown 表格格式，自动计算列宽
2. **内容截断**：长内容会被截断并添加 "..." 提示
3. **时间格式**：使用 ISO 8601 格式显示时间
4. **搜索上下文**：匹配片段包含前后 50 字符的上下文
5. **大小写处理**：搜索时根据 caseSensitive 参数处理
6. **性能考虑**：搜索在内存中进行，大量消息可能影响性能

