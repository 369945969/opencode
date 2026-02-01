# session-manager/constants.ts

## 文件功能概述

Session Manager 工具的常量定义文件，定义了存储路径和工具描述字符串。这些常量用于配置会话数据的存储位置和构建工具的用户界面文本。

## 存储路径常量

### OPENCODE_STORAGE
OpenCode 存储目录根路径。

```typescript
export const OPENCODE_STORAGE = getOpenCodeStorageDir();
```

**用途**：所有会话数据的根目录。

### MESSAGE_STORAGE
消息存储目录。

```typescript
export const MESSAGE_STORAGE = join(OPENCODE_STORAGE, "message");
```

**用途**：存储会话消息的 JSON 文件。

### PART_STORAGE
消息部分存储目录。

```typescript
export const PART_STORAGE = join(OPENCODE_STORAGE, "part");
```

**用途**：存储消息各部分的详细内容。

### SESSION_STORAGE
会话元数据存储目录。

```typescript
export const SESSION_STORAGE = join(OPENCODE_STORAGE, "session");
```

**用途**：存储会话元数据文件。

### TODO_DIR
待办事项存储目录。

```typescript
export const TODO_DIR = join(getClaudeConfigDir(), "todos");
```

**用途**：存储会话的待办事项列表。

### TRANSCRIPT_DIR
转录记录存储目录。

```typescript
export const TRANSCRIPT_DIR = join(getClaudeConfigDir(), "transcripts");
```

**用途**：存储会话的转录记录。

## 工具描述常量

### SESSION_LIST_DESCRIPTION
会话列表工具的描述。

```typescript
export const SESSION_LIST_DESCRIPTION = `List all OpenCode sessions with optional filtering.

Returns a list of available session IDs with metadata including message count, date range, and agents used.

Arguments:
- limit (optional): Maximum number of sessions to return
- from_date (optional): Filter sessions from this date (ISO 8601 format)
- to_date (optional): Filter sessions until this date (ISO 8601 format)

Example output:
| Session ID | Messages | First | Last | Agents |
|------------|----------|-------|------|--------|
| ses_abc123 | 45 | 2025-12-20 | 2025-12-24 | build, oracle |
| ses_def456 | 12 | 2025-12-19 | 2025-12-19 | build |`;
```

### SESSION_READ_DESCRIPTION
会话读取工具的描述。

```typescript
export const SESSION_READ_DESCRIPTION = `Read messages and history from an OpenCode session.

Returns a formatted view of session messages with role, timestamp, and content. Optionally includes todos and transcript data.

Arguments:
- session_id (required): Session ID to read
- include_todos (optional): Include todo list if available (default: false)
- include_transcript (optional): Include transcript log if available (default: false)
- limit (optional): Maximum number of messages to return (default: all)`;
```

### SESSION_SEARCH_DESCRIPTION
会话搜索工具的描述。

```typescript
export const SESSION_SEARCH_DESCRIPTION = `Search for content within OpenCode session messages.

Performs full-text search across session messages and returns matching excerpts with context.

Arguments:
- query (required): Search query string
- session_id (optional): Search within specific session only (default: all sessions)
- case_sensitive (optional): Case-sensitive search (default: false)
- limit (optional): Maximum number of results to return (default: 20)`;
```

### SESSION_INFO_DESCRIPTION
会话信息工具的描述。

```typescript
export const SESSION_INFO_DESCRIPTION = `Get metadata and statistics about an OpenCode session.

Returns detailed information about a session including message count, date range, agents used, and available data sources.

Arguments:
- session_id (required): Session ID to inspect`;
```

### SESSION_DELETE_DESCRIPTION
会话删除工具的描述。

```typescript
export const SESSION_DELETE_DESCRIPTION = `Delete an OpenCode session and all associated data.

Removes session messages, parts, todos, and transcript. This operation cannot be undone.

Arguments:
- session_id (required): Session ID to delete
- confirm (required): Must be true to confirm deletion`;
```

### TOOL_NAME_PREFIX
工具名称前缀。

```typescript
export const TOOL_NAME_PREFIX = "session_";
```

## 依赖关系

### 内部依赖
- `../../shared/data-path` - 数据路径工具
- `../../shared` - 共享工具函数

### 外部依赖
- `node:path` - 路径处理

## 使用示例

```typescript
import { 
  OPENCODE_STORAGE,
  MESSAGE_STORAGE,
  SESSION_LIST_DESCRIPTION,
  SESSION_READ_DESCRIPTION 
} from './constants';

// 使用存储路径
const messageDir = join(MESSAGE_STORAGE, sessionId);

// 使用工具描述
const tool = {
  name: 'session_list',
  description: SESSION_LIST_DESCRIPTION
};
```

## 注意事项

1. **路径构建**：使用 `node:path` 的 `join` 函数确保跨平台兼容
2. **存储位置**：数据存储在用户主目录下的 .local/share/opencode/
3. **Claude 配置**：待办和转录存储在 Claude Code 配置目录
4. **描述格式**：工具描述使用 Markdown 格式，包含参数说明和示例
5. **删除警告**：SESSION_DELETE_DESCRIPTION 强调了操作的不可撤销性

