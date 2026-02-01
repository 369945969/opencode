# session-manager/storage.ts

## 文件功能概述

Session Manager 工具的存储操作文件，提供会话数据的读取、查询和遍历功能。所有数据操作都基于文件系统，支持异步读取和错误处理。

## 主要函数

### getMainSessions(options)
获取主会话列表（非子会话）。

**参数**：
- `options?: GetMainSessionsOptions` - 选项
  - `directory?: string` - 按目录过滤

**返回**：`Promise<SessionMetadata[]>` - 会话元数据列表

**功能**：
- 扫描会话存储目录
- 排除子会话（有 parentID 的会话）
- 可选按工作目录过滤
- 按更新时间倒序排序

**逻辑**：
1. 遍历项目目录
2. 读取每个会话的元数据文件
3. 过滤掉子会话
4. 应用目录过滤
5. 按更新时间排序

### getAllSessions()
获取所有会话 ID 列表。

**返回**：`Promise<string[]>` - 会话 ID 列表

**功能**：
- 递归扫描消息存储目录
- 收集所有会话 ID
- 去重处理

**逻辑**：
1. 递归遍历消息存储目录
2. 查找包含 JSON 文件的目录
3. 提取会话 ID
4. 返回去重后的列表

### getMessageDir(sessionID)
获取会话消息的存储目录路径。

**参数**：
- `sessionID: string` - 会话 ID

**返回**：`string` - 目录路径（不存在时返回空字符串）

**功能**：
- 首先检查直接路径
- 然后在所有项目目录中搜索
- 返回找到的目录路径

### sessionExists(sessionID)
检查会话是否存在。

**参数**：
- `sessionID: string` - 会话 ID

**返回**：`boolean` - 是否存在

**实现**：基于 getMessageDir 的结果判断

### readSessionMessages(sessionID)
读取会话的所有消息。

**参数**：
- `sessionID: string` - 会话 ID

**返回**：`Promise<SessionMessage[]>` - 消息列表（按时间排序）

**功能**：
- 获取消息目录
- 读取所有消息 JSON 文件
- 读取每个消息的部分内容
- 按时间戳排序

**逻辑**：
1. 获取消息目录
2. 遍历目录中的 JSON 文件
3. 解析消息元数据
4. 调用 readParts 读取消息部分
5. 构建完整消息对象
6. 按创建时间排序

### readParts(messageID)
读取消息的所有部分（内部函数）。

**参数**：
- `messageID: string` - 消息 ID

**返回**：`Promise<MessagePart[]>` - 部分列表（按 ID 排序）

**功能**：
- 从部分存储目录读取
- 解析所有部分 JSON 文件
- 按 ID 排序

### readSessionTodos(sessionID)
读取会话的待办事项列表。

**参数**：
- `sessionID: string` - 会话 ID

**返回**：`Promise<TodoItem[]>` - 待办事项列表

**功能**：
- 扫描待办事项目录
- 查找包含会话 ID 的文件
- 解析 JSON 内容
- 返回待办事项数组

### readSessionTranscript(sessionID)
读取会话的转录条目数。

**参数**：
- `sessionID: string` - 会话 ID

**返回**：`Promise<number>` - 转录条目数

**功能**：
- 检查转录文件是否存在
- 读取 JSONL 文件
- 计算非空行数

### getSessionInfo(sessionID)
获取会话的完整信息。

**参数**：
- `sessionID: string` - 会话 ID

**返回**：`Promise<SessionInfo | null>` - 会话信息（不存在时返回 null）

**功能**：
- 读取会话消息
- 统计消息数量和日期范围
- 收集使用的代理
- 读取待办事项
- 获取转录条目数

**统计信息**：
- 消息数量
- 第一条/最后一条消息时间
- 使用的代理集合
- 待办事项数量和完成状态
- 转录条目数

## 代码逻辑流程

```
getMainSessions(options)
├── 检查存储目录存在
├── 遍历项目目录
│   ├── 读取会话元数据文件
│   ├── 过滤子会话（有 parentID）
│   ├── 应用目录过滤
│   └── 添加到列表
├── 按更新时间倒序排序
└── 返回列表

getAllSessions()
├── 定义递归扫描函数
├── 遍历消息存储目录
│   ├── 如果是目录
│   │   ├── 检查是否包含 JSON 文件
│   │   │   ├── 是：添加会话 ID
│   │   │   └── 否：递归扫描
│   └── 继续遍历
├── 去重
└── 返回会话 ID 列表

readSessionMessages(sessionID)
├── 获取消息目录
├── 检查目录存在
├── 遍历 JSON 文件
│   ├── 解析消息元数据
│   ├── 读取消息部分（readParts）
│   └── 构建消息对象
├── 按时间排序
└── 返回消息列表

getSessionInfo(sessionID)
├── 读取会话消息
├── 如果无消息，返回 null
├── 统计信息：
│   ├── 消息数量
│   ├── 第一条/最后一条时间
│   └── 使用的代理
├── 读取待办事项
├── 读取转录条目数
└── 构建 SessionInfo 对象
```

## 依赖关系

### 内部依赖
- `./constants` - 存储路径常量
- `./types` - 类型定义

### 外部依赖
- `node:fs` - 同步文件操作
- `node:fs/promises` - 异步文件操作
- `node:path` - 路径处理

## 使用示例

```typescript
import {
  getMainSessions,
  getAllSessions,
  getMessageDir,
  sessionExists,
  readSessionMessages,
  readSessionTodos,
  readSessionTranscript,
  getSessionInfo
} from './storage';

// 获取主会话列表
const sessions = await getMainSessions({ directory: '/project/path' });

// 获取所有会话 ID
const allIds = await getAllSessions();

// 检查会话存在
const exists = sessionExists('ses_abc123');

// 读取消息
const messages = await readSessionMessages('ses_abc123');

// 读取待办
const todos = await readSessionTodos('ses_abc123');

// 获取转录数
const transcriptCount = await readSessionTranscript('ses_abc123');

// 获取完整信息
const info = await getSessionInfo('ses_abc123');
```

## 注意事项

1. **错误处理**：所有函数都有 try-catch，失败时返回空结果而非抛出错误
2. **性能考虑**：大量会话可能影响性能，建议合理使用过滤
3. **文件格式**：所有数据以 JSON 格式存储
4. **路径处理**：使用 `node:path` 确保跨平台兼容
5. **排序规则**：消息按创建时间升序，会话按更新时间降序
6. **转录格式**：转录文件使用 JSONL 格式（每行一个 JSON 对象）

