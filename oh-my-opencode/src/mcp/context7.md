# context7.ts - Context7 文档检索 MCP 配置

## 文件功能概述

该文件定义了 Context7 文档检索服务的 MCP (Model Context Protocol) 配置。Context7 是一个文档索引和检索服务，允许 AI 模型访问结构化的文档内容。

## 主要配置对象

### context7

```typescript
export const context7 = {
  type: "remote" as const,
  url: "https://mcp.context7.com/mcp",
  enabled: true,
  headers: process.env.CONTEXT7_API_KEY
    ? { Authorization: `Bearer ${process.env.CONTEXT7_API_KEY}` }
    : undefined,
  oauth: false as const,
}
```

**描述**: Context7 文档检索服务的远程 MCP 配置

**配置属性**:

| 属性 | 类型 | 值 | 说明 |
|------|------|-----|------|
| `type` | `"remote"` | `"remote"` | 远程 MCP 服务类型 |
| `url` | `string` | `"https://mcp.context7.com/mcp"` | Context7 MCP 服务端点 |
| `enabled` | `boolean` | `true` | 默认启用该服务 |
| `headers` | `object \| undefined` | 条件值 | Bearer Token 认证头 |
| `oauth` | `false` | `false` | 禁用 OAuth 自动检测 |

## 代码逻辑流程

```
┌─────────────────────────────────────────────────────────────┐
│                 context7.ts 加载                             │
├─────────────────────────────────────────────────────────────┤
│  1. 检查环境变量 CONTEXT7_API_KEY                             │
│     ├─ 存在: 设置 headers = {                                │
│     │          Authorization: "Bearer <key>"                 │
│     │        }                                               │
│     └─ 不存在: headers = undefined                           │
│  2. 导出 context7 配置对象                                    │
└─────────────────────────────────────────────────────────────┘
```

## 认证机制

### Bearer Token 认证

Context7 服务使用 Bearer Token 进行认证：

```
请求头格式:
{
  "Authorization": "Bearer <your-context7-api-key>"
}
```

**环境变量**: `CONTEXT7_API_KEY`

**配置方式**:
```bash
# 在 shell 中设置
export CONTEXT7_API_KEY="your-api-key-here"

# 或在 .env 文件中
CONTEXT7_API_KEY=your-api-key-here
```

### OAuth 禁用说明

显式设置 `oauth: false` 以防止 OpenCode 尝试自动检测 OAuth 流程。Context7 使用简单的 Bearer Token 认证，不需要 OAuth。

## 使用示例

### 基本使用

```typescript
import { context7 } from "./context7"
import { createBuiltinMcps } from "./index"

// 直接使用配置
console.log(context7.url) // "https://mcp.context7.com/mcp"

// 通过工厂函数创建（包含 context7）
const mcps = createBuiltinMcps()
console.log(mcps.context7) // { type: "remote", url: "...", ... }
```

### 环境变量配置

```bash
# 设置 API Key
export CONTEXT7_API_KEY="ctx7_live_xxxxxxxxxxxx"

# 运行应用
bun run dev
```

### 禁用服务

```typescript
import { createBuiltinMcps } from "./index"

// 禁用 context7 服务
const mcps = createBuiltinMcps(["context7"])
console.log(mcps.context7) // undefined
```

## Context7 服务特性

### 文档索引

Context7 允许索引以下类型的文档：
- 技术文档
- API 参考
- 代码库文档
- 知识库文章

### 检索能力

- 语义搜索：基于含义而非关键词匹配
- 结构化检索：获取特定章节或代码块
- 上下文感知：理解文档结构和层级

## 依赖关系

### 导入依赖

该文件无外部导入依赖，纯配置对象定义。

### 被依赖模块

| 模块 | 用途 |
|------|------|
| `index.ts` | 导入 context7 配置并注册到内置 MCP 列表 |

## 注意事项

1. **API Key 安全**: 
   - 不要将 API Key 硬编码在代码中
   - 使用环境变量或安全的密钥管理服务
   - 确保 `.env` 文件在 `.gitignore` 中

2. **环境变量检查**: 
   - 如果没有设置 `CONTEXT7_API_KEY`，服务仍然可以加载但认证会失败
   - 建议在应用启动时验证必要的环境变量

3. **服务可用性**: 
   - 需要网络连接才能访问 Context7 服务
   - 服务可能因网络问题或 API 限制而暂时不可用

4. **文档索引**: 
   - 首次使用可能需要先索引相关文档
   - 索引过程可能需要一些时间，取决于文档大小

5. **认证头格式**: 
   - 注意与 websearch.ts 的区别：Context7 使用 `Authorization: Bearer <token>`
   - websearch 使用 `x-api-key: <key>`
   - 确保使用正确的认证头格式

6. **错误处理**: 
   - 当 API Key 无效或过期时，Context7 服务会返回 401 未授权错误
   - 建议在调用层实现适当的错误处理和重试逻辑

## 相关链接

- Context7 官网: https://context7.com
- MCP 协议文档: https://modelcontextprotocol.io
