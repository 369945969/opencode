# session-utils.ts

## 文件功能概述

该文件提供了会话（session）相关的工具函数，主要用于管理消息目录和检测调用者是否为协调器（Orchestrator）。这些功能在代理委派和消息存储系统中起到关键作用。

## 主要函数/类详细说明

### `getMessageDir(sessionID: string): string | null`
获取指定会话的消息存储目录路径。
- **参数**: `sessionID` - 会话 ID
- **返回值**: 消息目录路径，如果未找到返回 `null`
- **搜索逻辑**:
  1. 首先检查 `MESSAGE_STORAGE` 目录是否存在
  2. 尝试直接路径: `{MESSAGE_STORAGE}/{sessionID}`
  3. 如果直接路径不存在，遍历 `MESSAGE_STORAGE` 下的所有子目录
  4. 在每个子目录中查找 `{subdir}/{sessionID}`
- **用途**: 定位会话消息的存储位置，用于读取会话历史和上下文

### `isCallerOrchestrator(sessionID?: string): boolean`
检查当前调用者是否为 Atlas 协调器代理。
- **参数**: `sessionID` - 可选的会话 ID
- **返回值**: 如果调用者是 Atlas 返回 `true`，否则返回 `false`
- **判断逻辑**:
  1. 如果 `sessionID` 未提供，返回 `false`
  2. 获取消息目录
  3. 使用 `findNearestMessageWithFields` 查找最近的消息
  4. 检查消息的 `agent` 字段是否为 `"atlas"`（不区分大小写）
- **用途**: 
  - 确定当前操作是否由协调器发起
  - 用于权限控制和路由决策
  - 区分协调器指令和普通代理操作

## 代码逻辑流程

### 获取消息目录流程

```
getMessageDir(sessionID)
├── 检查 MESSAGE_STORAGE 是否存在
│   └── 不存在 → 返回 null
├── 尝试直接路径: MESSAGE_STORAGE/sessionID
│   └── 存在 → 返回路径
├── 遍历 MESSAGE_STORAGE 的子目录
│   └── 对每个子目录检查 subdir/sessionID
│       └── 存在 → 返回路径
└── 未找到 → 返回 null
```

### 检测协调器流程

```
isCallerOrchestrator(sessionID)
├── 检查 sessionID
│   └── 未提供 → 返回 false
├── 调用 getMessageDir(sessionID)
│   └── 未找到 → 返回 false
├── 调用 findNearestMessageWithFields(messageDir)
│   └── 查找最近的消息元数据
└── 比较 agent 字段是否为 "atlas"
    └── 返回比较结果
```

## 使用示例

```typescript
import { getMessageDir, isCallerOrchestrator } from './session-utils';

// 获取消息目录
const sessionId = "session-abc-123";
const messageDir = getMessageDir(sessionId);

if (messageDir) {
  console.log(`Message directory: ${messageDir}`);
  // 可以进一步读取消息文件
} else {
  console.log('Session not found');
}

// 检查是否为协调器调用
const isOrchestrator = isCallerOrchestrator(sessionId);

if (isOrchestrator) {
  console.log('Called by Atlas orchestrator');
  // 执行协调器特定的逻辑
  // 例如：允许更高权限的操作
} else {
  console.log('Called by regular agent');
  // 执行普通代理逻辑
}

// 在代理委派系统中的实际应用
async function handleAgentTask(sessionID: string, task: Task) {
  // 检查调用者身份
  const isOrchestrator = isCallerOrchestrator(sessionID);
  
  if (isOrchestrator) {
    // 协调器可以委派任务给其他代理
    return await delegateTask(task);
  } else {
    // 普通代理执行自己的任务
    return await executeTask(task);
  }
}
```

## 依赖关系

- `node:path`: 使用 `join` 进行路径拼接
- `node:os`: 未直接使用（可能遗留导入）
- `node:fs`: 使用 `existsSync`, `readdirSync`
- `../features/hook-message-injector`: 
  - `findNearestMessageWithFields` 函数
  - `MESSAGE_STORAGE` 常量

## 注意事项

1. **目录结构**: 消息存储采用两层结构 `{MESSAGE_STORAGE}/{subdir}/{sessionID}`，支持会话分组
2. **大小写不敏感**: `isCallerOrchestrator` 对 agent 名称的检查不区分大小写
3. **性能考虑**: `getMessageDir` 在直接路径不存在时会遍历所有子目录，如果子目录很多可能影响性能
4. **错误处理**: 函数在目录不存在或查找失败时返回 `null` 或 `false`，调用方需要处理这些情况
5. **耦合度**: 依赖 `hook-message-injector` 模块的特定函数和常量，与该模块紧密耦合
