# websearch.ts - Web 搜索 MCP 配置

## 文件功能概述

该文件定义了 Exa AI Web 搜索服务的 MCP (Model Context Protocol) 配置。Exa 是一个专为 AI 应用设计的网络搜索引擎，提供结构化的搜索结果。

## 主要配置对象

### websearch

```typescript
export const websearch = {
  type: "remote" as const,
  url: "https://mcp.exa.ai/mcp?tools=web_search_exa",
  enabled: true,
  headers: process.env.EXA_API_KEY
    ? { "x-api-key": process.env.EXA_API_KEY }
    : undefined,
  oauth: false as const,
}
```

**描述**: Exa AI Web 搜索服务的远程 MCP 配置

**配置属性**:

| 属性 | 类型 | 值 | 说明 |
|------|------|-----|------|
| `type` | `"remote"` | `"remote"` | 远程 MCP 服务类型 |
| `url` | `string` | `"https://mcp.exa.ai/mcp?tools=web_search_exa"` | Exa MCP 服务端点 |
| `enabled` | `boolean` | `true` | 默认启用该服务 |
| `headers` | `object \| undefined` | 条件值 | API 密钥认证头 |
| `oauth` | `false` | `false` | 禁用 OAuth 自动检测 |

## 代码逻辑流程

```
┌─────────────────────────────────────────────────────────────┐
│                 websearch.ts 加载                            │
├─────────────────────────────────────────────────────────────┤
│  1. 检查环境变量 EXA_API_KEY                                  │
│     ├─ 存在: 设置 headers = { "x-api-key": <key> }           │
│     └─ 不存在: headers = undefined                           │
│  2. 导出 websearch 配置对象                                   │
└─────────────────────────────────────────────────────────────┘
```

## 认证机制

### API Key 认证

Exa 服务使用 API Key 进行认证：

```
请求头格式:
{
  "x-api-key": "<your-exa-api-key>"
}
```

**环境变量**: `EXA_API_KEY`

**配置方式**:
```bash
# 在 shell 中设置
export EXA_API_KEY="your-api-key-here"

# 或在 .env 文件中
EXA_API_KEY=your-api-key-here
```

### OAuth 禁用说明

显式设置 `oauth: false` 以防止 OpenCode 尝试自动检测 OAuth 流程。Exa 使用简单的 API Key 认证，不需要 OAuth。

## 使用示例

### 基本使用

```typescript
import { websearch } from "./websearch"
import { createBuiltinMcps } from "./index"

// 直接使用配置
console.log(websearch.url) // "https://mcp.exa.ai/mcp?tools=web_search_exa"

// 通过工厂函数创建（包含 websearch）
const mcps = createBuiltinMcps()
console.log(mcps.websearch) // { type: "remote", url: "...", ... }
```

### 环境变量配置

```bash
# 设置 API Key
export EXA_API_KEY="exa_live_xxxxxxxxxxxx"

# 运行应用
bun run dev
```

### 禁用服务

```typescript
import { createBuiltinMcps } from "./index"

// 禁用 websearch 服务
const mcps = createBuiltinMcps(["websearch"])
console.log(mcps.websearch) // undefined
```

## 依赖关系

### 导入依赖

该文件无外部导入依赖，纯配置对象定义。

### 被依赖模块

| 模块 | 用途 |
|------|------|
| `index.ts` | 导入 websearch 配置并注册到内置 MCP 列表 |

## 注意事项

1. **API Key 安全**: 
   - 不要将 API Key 硬编码在代码中
   - 使用环境变量或安全的密钥管理服务
   - 确保 `.env` 文件在 `.gitignore` 中

2. **环境变量检查**: 
   - 如果没有设置 `EXA_API_KEY`，服务仍然可以加载但认证会失败
   - 建议在应用启动时验证必要的环境变量

3. **服务可用性**: 
   - 需要网络连接才能访问 Exa 服务
   - 服务可能因网络问题或 API 限制而暂时不可用

4. **工具参数**: 
   - URL 中的 `?tools=web_search_exa` 指定了要使用的具体工具
   - Exa 可能提供多个工具，这里明确指定使用 web_search_exa

5. **错误处理**: 
   - 当 API Key 无效或过期时，Exa 服务会返回 401 未授权错误
   - 建议在调用层实现适当的错误处理和重试逻辑

## 相关链接

- Exa AI 官网: https://exa.ai
- MCP 协议文档: https://modelcontextprotocol.io
