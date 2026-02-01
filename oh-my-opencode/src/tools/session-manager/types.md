# session-manager/types.ts

## 文件功能概述

Session Manager 工具的类型定义文件，定义了会话消息、元数据、待办事项、搜索结果等核心类型，以及工具参数接口。

## 主要类型定义

### SessionMessage
会话消息接口。

```typescript
interface SessionMessage {
  id: string;                      // 消息 ID
  role: "user" | "assistant";      // 角色
  agent?: string;                  // 代理名称（可选）
  time?: {                         // 时间戳
    created: number;               // 创建时间
    updated?: number;              // 更新时间（可选）
  };
  parts: MessagePart[];            // 消息部分内容
}
```

### MessagePart
消息部分内容接口。

```typescript
interface MessagePart {
  id: string;                      // 部分 ID
  type: string;                    // 类型（text, thinking, tool_use, tool_result 等）
  text?: string;                   // 文本内容（可选）
  thinking?: string;               // 思考内容（可选）
  tool?: string;                   // 工具名称（可选）
  callID?: string;                 // 调用 ID（可选）
  input?: Record<string, unknown>; // 输入参数（可选）
  output?: string;                 // 输出内容（可选）
  error?: string;                  // 错误信息（可选）
}
```

### SessionInfo
会话信息接口。

```typescript
interface SessionInfo {
  id: string;                      // 会话 ID
  message_count: number;           // 消息数量
  first_message?: Date;            // 第一条消息时间（可选）
  last_message?: Date;             // 最后一条消息时间（可选）
  agents_used: string[];           // 使用过的代理列表
  has_todos: boolean;              // 是否有待办事项
  has_transcript: boolean;         // 是否有转录记录
  todos?: TodoItem[];              // 待办事项列表（可选）
  transcript_entries?: number;     // 转录条目数（可选）
}
```

### TodoItem
待办事项接口。

```typescript
interface TodoItem {
  id: string;                      // 待办 ID
  content: string;                 // 内容
  status: "pending" | "in_progress" | "completed" | "cancelled"; // 状态
  priority?: string;               // 优先级（可选）
}
```

### SearchResult
搜索结果接口。

```typescript
interface SearchResult {
  session_id: string;              // 会话 ID
  message_id: string;              // 消息 ID
  role: string;                    // 角色
  excerpt: string;                 // 匹配片段
  match_count: number;             // 匹配次数
  timestamp?: number;              // 时间戳（可选）
}
```

### SessionMetadata
会话元数据接口。

```typescript
interface SessionMetadata {
  id: string;                      // 会话 ID
  version?: string;                // 版本（可选）
  projectID: string;               // 项目 ID
  directory: string;               // 工作目录
  title?: string;                  // 标题（可选）
  parentID?: string;               // 父会话 ID（可选）
  time: {                          // 时间戳
    created: number;               // 创建时间
    updated: number;               // 更新时间
  };
  summary?: {                      // 摘要（可选）
    additions: number;             // 添加行数
    deletions: number;             // 删除行数
    files: number;                 // 文件数
  };
}
```

### 工具参数接口

```typescript
interface SessionListArgs {
  limit?: number;                  // 最大数量
  offset?: number;                 // 偏移量
  from_date?: string;              // 起始日期
  to_date?: string;                // 结束日期
  project_path?: string;           // 项目路径
}

interface SessionReadArgs {
  session_id: string;              // 会话 ID
  include_todos?: boolean;         // 包含待办
  include_transcript?: boolean;    // 包含转录
  limit?: number;                  // 最大消息数
}

interface SessionSearchArgs {
  query: string;                   // 搜索查询
  session_id?: string;             // 限定会话
  case_sensitive?: boolean;        // 区分大小写
  limit?: number;                  // 最大结果数
}

interface SessionInfoArgs {
  session_id: string;              // 会话 ID
}

interface SessionDeleteArgs {
  session_id: string;              // 会话 ID
  confirm: boolean;                // 确认删除
}
```

## 依赖关系

### 无内部依赖
纯类型定义文件。

### 无外部依赖
不依赖其他模块。

## 类型关系图

```
SessionMessage
├── id: string
├── role: "user" | "assistant"
├── agent?: string
├── time?: { created: number, updated?: number }
└── parts: MessagePart[]
    ├── id: string
    ├── type: string
    ├── text?: string
    ├── thinking?: string
    ├── tool?: string
    ├── callID?: string
    ├── input?: Record<string, unknown>
    ├── output?: string
    └── error?: string

SessionInfo
├── id: string
├── message_count: number
├── first_message?: Date
├── last_message?: Date
├── agents_used: string[]
├── has_todos: boolean
├── has_transcript: boolean
├── todos?: TodoItem[]
│   ├── id: string
│   ├── content: string
│   ├── status: TodoStatus
│   └── priority?: string
└── transcript_entries?: number
```

## 使用示例

```typescript
import type { 
  SessionMessage, 
  SessionInfo, 
  TodoItem, 
  SearchResult,
  SessionListArgs 
} from './types';

// 定义消息
const message: SessionMessage = {
  id: 'msg_001',
  role: 'assistant',
  agent: 'build',
  time: { created: Date.now() },
  parts: [{ id: 'part_1', type: 'text', text: 'Hello' }]
};

// 定义待办
const todo: TodoItem = {
  id: 'todo_1',
  content: 'Fix bug',
  status: 'in_progress',
  priority: 'high'
};

// 定义搜索参数
const searchArgs: SessionSearchArgs = {
  query: 'error',
  case_sensitive: false,
  limit: 20
};
```

## 注意事项

1. **消息角色**：只能是 "user" 或 "assistant"
2. **待办状态**：pending | in_progress | completed | cancelled
3. **时间戳**：使用 Unix 时间戳（毫秒）
4. **可选字段**：大部分字段都是可选的，需要检查存在性
5. **消息部分**：支持多种类型（text, thinking, tool_use, tool_result）
6. **搜索片段**：excerpt 包含匹配文本的上下文

