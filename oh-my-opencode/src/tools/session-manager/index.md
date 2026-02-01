# session-manager/index.ts

## 文件功能概述

Session Manager 工具的入口文件，负责导出会话管理的工具、类型定义和存储函数。该模块提供了查询、读取、搜索和管理 OpenCode 会话历史记录的功能。

## 主要导出内容

### 工具
- `session_list` - 列出所有会话
- `session_read` - 读取会话消息
- `session_search` - 搜索会话内容
- `session_info` - 获取会话信息

### 类型定义
- `SessionMessage` - 会话消息接口
- `MessagePart` - 消息部分接口
- `SessionInfo` - 会话信息接口
- `TodoItem` - 待办事项接口
- `SearchResult` - 搜索结果接口
- `SessionMetadata` - 会话元数据接口
- `SessionListArgs` - 列表参数接口
- `SessionReadArgs` - 读取参数接口
- `SessionSearchArgs` - 搜索参数接口
- `SessionInfoArgs` - 信息参数接口
- `SessionDeleteArgs` - 删除参数接口

### 存储函数
- `sessionExists` - 检查会话是否存在

## 代码逻辑流程

```
index.ts
├── 从 tools.ts 导出工具
│   ├── session_list - 列出会话
│   ├── session_read - 读取消息
│   ├── session_search - 搜索内容
│   └── session_info - 会话信息
├── 从 types.ts 导出类型定义
├── 从 constants.ts 导出常量
├── 从 storage.ts 导出存储函数
└── 从 utils.ts 导出工具函数

使用流程：
1. session_list - 获取会话列表
2. session_read - 读取特定会话的消息
3. session_search - 搜索跨会话的内容
4. session_info - 获取会话元数据
```

## 依赖关系

### 内部依赖
- `./tools` - 工具实现
- `./types` - 类型定义
- `./constants` - 常量定义
- `./storage` - 存储操作
- `./utils` - 工具函数

### 外部依赖
- `@opencode-ai/plugin/tool` - OpenCode 插件工具 API

## 使用示例

```typescript
import { 
  session_list, 
  session_read, 
  session_search, 
  session_info,
  sessionExists 
} from './session-manager';

// 列出会话
const sessions = await session_list.execute({ limit: 10 });

// 读取会话消息
const messages = await session_read.execute({ 
  session_id: 'ses_abc123',
  include_todos: true 
});

// 搜索内容
const results = await session_search.execute({ 
  query: 'error handling',
  case_sensitive: false 
});

// 获取会话信息
const info = await session_info.execute({ session_id: 'ses_abc123' });

// 检查会话是否存在
const exists = sessionExists('ses_abc123');
```

## 注意事项

1. **存储位置**：会话数据存储在 OpenCode 存储目录中
2. **性能限制**：搜索最多扫描 50 个会话，超时 60 秒
3. **日期过滤**：支持 ISO 8601 格式的日期范围过滤
4. **消息排序**：消息按时间戳升序排列
5. **待办事项**：可选包含会话的待办列表
6. **转录记录**：支持获取会话的转录条目数

