# index.ts - MCP 模块主入口

## 文件功能概述

该文件是 MCP (Model Context Protocol) 模块的主入口文件，负责：
- 导入并聚合所有内置 MCP 服务配置
- 提供统一的 MCP 配置导出
- 实现 `createBuiltinMcps` 工厂函数，支持按需启用/禁用服务

## 主要组件

### 1. 导入依赖

```typescript
import { websearch } from "./websearch"
import { context7 } from "./context7"
import { grep_app } from "./grep-app"
import type { McpName } from "./types"
```

**导入的模块**:
- `websearch` - Exa AI Web 搜索服务配置
- `context7` - Context7 文档检索服务配置
- `grep_app` - Grep.app 代码搜索服务配置
- `McpName` - 内置 MCP 服务名称类型

### 2. 类型导出

```typescript
export { McpNameSchema, type McpName } from "./types"
```

**重新导出的内容**:
- `McpNameSchema` - Zod 验证模式
- `McpName` - TypeScript 类型定义

### 3. RemoteMcpConfig 类型

```typescript
type RemoteMcpConfig = {
  type: "remote"
  url: string
  enabled: boolean
  headers?: Record<string, string>
  oauth?: false
}
```

**描述**: 远程 MCP 服务的配置类型

**属性说明**:

| 属性 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `type` | `"remote"` | 是 | 服务类型，固定为 "remote" |
| `url` | `string` | 是 | MCP 服务端点 URL |
| `enabled` | `boolean` | 是 | 是否启用该服务 |
| `headers` | `Record<string, string>` | 否 | 自定义请求头（如 API Key） |
| `oauth` | `false` | 否 | 是否禁用 OAuth 自动检测 |

### 4. allBuiltinMcps 配置映射

```typescript
const allBuiltinMcps: Record<McpName, RemoteMcpConfig> = {
  websearch,
  context7,
  grep_app,
}
```

**描述**: 包含所有内置 MCP 服务的配置映射表

**结构**: 
- 键: `McpName` 枚举值 ("websearch", "context7", "grep_app")
- 值: 对应的 `RemoteMcpConfig` 配置对象

### 5. createBuiltinMcps 工厂函数

```typescript
export function createBuiltinMcps(disabledMcps: string[] = []) {
  const mcps: Record<string, RemoteMcpConfig> = {}

  for (const [name, config] of Object.entries(allBuiltinMcps)) {
    if (!disabledMcps.includes(name)) {
      mcps[name] = config
    }
  }

  return mcps
}
```

**描述**: 创建内置 MCP 服务配置的工厂函数

**参数**:

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `disabledMcps` | `string[]` | `[]` | 要禁用的 MCP 服务名称列表 |

**返回值**: `Record<string, RemoteMcpConfig>` - 启用的 MCP 服务配置映射

**逻辑流程**:

```
┌─────────────────────────────────────────────────────────────┐
│           createBuiltinMcps(disabledMcps)                   │
├─────────────────────────────────────────────────────────────┤
│  1. 初始化空对象 mcps = {}                                   │
│  2. 遍历 allBuiltinMcps 中的所有服务                         │
│     对于每个 [name, config]:                                 │
│     ├─ 检查 name 是否在 disabledMcps 列表中                  │
│     │   ├─ 是: 跳过（不添加到 mcps）                         │
│     │   └─ 否: mcps[name] = config                          │
│  3. 返回 mcps 对象                                           │
└─────────────────────────────────────────────────────────────┘
```

## 代码逻辑流程

```
┌─────────────────────────────────────────────────────────────┐
│                    index.ts 加载                             │
├─────────────────────────────────────────────────────────────┤
│  1. 导入所有内置 MCP 配置模块                                 │
│     ├─ websearch.ts                                         │
│     ├─ context7.ts                                          │
│     └─ grep-app.ts                                          │
│  2. 从 types.ts 导入类型                                     │
│  3. 重新导出 McpNameSchema 和 McpName 类型                   │
│  4. 定义 RemoteMcpConfig 类型                                │
│  5. 创建 allBuiltinMcps 配置映射                             │
│  6. 导出 createBuiltinMcps 工厂函数                          │
└─────────────────────────────────────────────────────────────┘
```

## 使用示例

### 基本使用（启用所有服务）

```typescript
import { createBuiltinMcps, McpName } from "./index"

// 获取所有内置 MCP 服务
const allMcps = createBuiltinMcps()

console.log(allMcps)
// {
//   websearch: { type: "remote", url: "...", enabled: true, ... },
//   context7: { type: "remote", url: "...", enabled: true, ... },
//   grep_app: { type: "remote", url: "...", enabled: true, ... }
// }
```

### 禁用特定服务

```typescript
import { createBuiltinMcps } from "./index"

// 禁用 websearch 服务
const mcpsWithoutWebsearch = createBuiltinMcps(["websearch"])

console.log(mcpsWithoutWebsearch)
// {
//   context7: { ... },
//   grep_app: { ... }
// }
// 注意: websearch 不在结果中
```

### 禁用多个服务

```typescript
import { createBuiltinMcps } from "./index"

// 禁用多个服务
const limitedMcps = createBuiltinMcps(["websearch", "grep_app"])

console.log(limitedMcps)
// {
//   context7: { ... }
// }
// 只保留 context7
```

### 类型使用

```typescript
import { McpName, McpNameSchema } from "./index"

// 使用类型
const mcpName: McpName = "websearch" // ✓ 有效

// 使用 Zod 模式验证
const result = McpNameSchema.safeParse("unknown")
console.log(result.success) // false
```

## 依赖关系

### 导入依赖

| 模块 | 路径 | 用途 |
|------|------|------|
| `websearch` | `./websearch` | Web 搜索服务配置 |
| `context7` | `./context7` | 文档检索服务配置 |
| `grep_app` | `./grep-app` | 代码搜索服务配置 |
| `McpName` | `./types` | 内置 MCP 名称类型 |

### 被依赖模块

该模块通常被主应用或其他配置模块导入使用，作为 MCP 服务的统一入口。

## 注意事项

1. **配置扩展**: 
   - 添加新的内置 MCP 服务时，需要：
     1. 创建新的配置文件（如 `new-service.ts`）
     2. 在 `types.ts` 中更新 `McpNameSchema` 枚举
     3. 在 `index.ts` 中导入并添加到 `allBuiltinMcps`

2. **禁用列表匹配**: 
   - `disabledMcps` 参数使用字符串数组
   - 匹配是大小写敏感的
   - 不存在的名称会被忽略（不会报错）

3. **类型安全**: 
   - `allBuiltinMcps` 使用 `Record<McpName, RemoteMcpConfig>` 类型
   - 确保所有键都在 `McpName` 枚举中定义
   - 提供编译时类型检查

4. **运行时验证**: 
   - 虽然 TypeScript 提供编译时检查，但运行时仍可能传入无效的禁用列表
   - 建议在使用前验证 `disabledMcps` 数组的内容

5. **配置对象引用**: 
   - 返回的 `mcps` 对象包含原始配置对象的引用
   - 修改返回对象的属性会影响原始配置（不推荐）

6. **环境变量处理**: 
   - 各个 MCP 配置模块在导入时处理环境变量
   - `createBuiltinMcps` 只负责筛选，不负责配置构建

7. **命名一致性**: 
   - `grep_app` 在文件名中使用 kebab-case (`grep-app.ts`)
   - 在对象键中使用 snake_case (`grep_app`)
   - 确保导入和使用时名称一致
