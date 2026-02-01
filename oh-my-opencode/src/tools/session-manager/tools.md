# session-manager/tools.ts

## 文件功能概述

Session Manager 工具的核心实现文件，提供会话列表、读取、搜索和信息查询功能。支持对 OpenCode 会话历史进行全面的管理和检索。

## 主要工具定义

### session_list
列出所有 OpenCode 会话，支持过滤和分页。

**参数**：
- `limit?: number` - 返回的最大会话数
- `from_date?: string` - 起始日期（ISO 8601）
- `to_date?: string` - 结束日期（ISO 8601）
- `project_path?: string` - 按项目路径过滤

**功能**：
- 获取主会话列表
- 按日期范围过滤
- 限制返回数量
- 格式化为表格输出

### session_read
读取指定会话的消息历史。

**参数**：
- `session_id: string` - 会话 ID（必需）
- `include_todos?: boolean` - 包含待办列表
- `include_transcript?: boolean` - 包含转录记录
- `limit?: number` - 最大消息数

**功能**：
- 验证会话存在性
- 读取消息列表
- 可选读取待办事项
- 格式化消息输出

### session_search
在会话消息中搜索内容。

**参数**：
- `query: string` - 搜索查询（必需）
- `session_id?: string` - 限定特定会话
- `case_sensitive?: boolean` - 区分大小写
- `limit?: number` - 最大结果数（默认 20）

**功能**：
- 全文搜索消息内容
- 支持跨会话搜索
- 可限定单个会话
- 返回匹配片段和上下文
- 60 秒超时保护

**性能限制**：
- 最多扫描 50 个会话
- 每个会话单独搜索
- 达到结果限制时停止

### session_info
获取会话的元数据和统计信息。

**参数**：
- `session_id: string` - 会话 ID（必需）

**返回信息**：
- 消息数量
- 日期范围
- 使用过的代理
- 待办事项统计
- 转录条目数
- 会话持续时间

## 代码逻辑流程

```
session_list
├── 获取主会话列表
├── 按日期过滤（如果指定）
├── 限制数量
└── 格式化为表格

session_read
├── 验证会话存在
├── 读取消息列表
├── 应用数量限制
├── 可选读取待办事项
└── 格式化输出

session_search
├── 确定搜索范围
│   ├── 指定会话：单会话搜索
│   └── 未指定：扫描所有会话（最多 50 个）
├── 逐个会话搜索
├── 收集匹配结果
├── 应用结果限制
└── 格式化搜索结果

session_info
├── 获取会话信息
├── 验证存在性
└── 格式化元数据
```

## 依赖关系

### 内部依赖
- `./constants` - 常量定义（描述文本、超时设置）
- `./storage` - 存储操作（读取会话、消息）
- `./utils` - 工具函数（格式化、过滤、搜索）
- `./types` - 类型定义

### 外部依赖
- `@opencode-ai/plugin/tool` - OpenCode 插件工具 API

## 使用示例

```typescript
import { 
  session_list, 
  session_read, 
  session_search, 
  session_info 
} from './tools';

// 列出最近 10 个会话
const list = await session_list.execute({ limit: 10 });

// 读取会话消息（包含待办）
const messages = await session_read.execute({
  session_id: 'ses_abc123',
  include_todos: true,
  limit: 50
});

// 搜索错误相关内容
const searchResults = await session_search.execute({
  query: 'error handling',
  case_sensitive: false,
  limit: 20
});

// 获取会话统计信息
const info = await session_info.execute({
  session_id: 'ses_abc123'
});
```

## 注意事项

1. **超时保护**：搜索操作有 60 秒超时
2. **性能限制**：跨会话搜索最多扫描 50 个会话
3. **日期格式**：使用 ISO 8601 格式（如 2025-12-20）
4. **消息排序**：按时间戳升序排列
5. **搜索结果**：包含匹配片段和上下文
6. **错误处理**：会话不存在时返回友好错误信息

