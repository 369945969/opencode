# MCP (Model Context Protocol) 模块

## 目录概述

本目录包含 OpenCode 插件的内置 MCP (Model Context Protocol) 服务配置。MCP 是一种标准化的协议，允许 AI 模型与外部工具和服务进行交互。

## 文件结构

```
src/mcp/
├── index.ts           # MCP 模块主入口，聚合所有内置服务
├── types.ts           # MCP 类型定义和 Zod 验证模式
├── websearch.ts       # Exa AI Web 搜索服务配置
├── context7.ts        # Context7 文档检索服务配置
├── grep-app.ts        # Grep.app 代码搜索服务配置
├── index.test.ts      # 测试文件（本目录）
└── [对应的 .md 文档]   # 各文件的详细文档
```

## 内置 MCP 服务

### 1. Web 搜索服务 (websearch)

**文件**: `websearch.ts`

**服务商**: Exa AI (https://exa.ai)

**功能**: 提供网络搜索能力，允许 AI 模型搜索互联网上的信息

**认证方式**: API Key (`EXA_API_KEY`)

**请求头格式**:
```
x-api-key: <your-api-key>
```

**特点**:
- 专为 AI 应用优化的搜索结果
- 结构化输出便于解析
- 支持语义搜索

**文档**: [websearch.md](./websearch.md)

---

### 2. 文档检索服务 (context7)

**文件**: `context7.ts`

**服务商**: Context7 (https://context7.com)

**功能**: 提供文档索引和检索能力，允许 AI 模型访问结构化的文档内容

**认证方式**: Bearer Token (`CONTEXT7_API_KEY`)

**请求头格式**:
```
Authorization: Bearer <your-api-key>
```

**特点**:
- 语义文档搜索
- 支持技术文档、API 参考等多种文档类型
- 结构化检索特定章节或代码块

**文档**: [context7.md](./context7.md)

---

### 3. 代码搜索服务 (grep_app)

**文件**: `grep-app.ts`

**服务商**: Grep.app (https://grep.app)

**功能**: 在开源代码库中搜索特定代码模式和实现

**认证方式**: 无需认证

**特点**:
- 无需 API Key，开箱即用
- 支持正则表达式搜索
- 按编程语言筛选
- 代码示例和最佳实践参考

**文档**: [grep-app.md](./grep-app.md)

---

## 类型系统

**文件**: `types.ts`

定义了 MCP 模块的核心类型和 Zod 验证模式：

- `McpName` / `McpNameSchema`: 内置 MCP 服务名称（枚举类型）
- `AnyMcpName` / `AnyMcpNameSchema`: 通用 MCP 服务名称（字符串类型）

**文档**: [types.md](./types.md)

---

## 主入口

**文件**: `index.ts`

模块的主入口文件，提供以下功能：

1. **配置聚合**: 导入并聚合所有内置 MCP 服务配置
2. **工厂函数**: `createBuiltinMcps(disabledMcps?)` - 创建 MCP 配置，支持禁用特定服务
3. **类型导出**: 重新导出 `McpNameSchema` 和 `McpName` 类型
4. **配置类型**: `RemoteMcpConfig` - 远程 MCP 服务的配置类型定义

**使用示例**:
```typescript
import { createBuiltinMcps, McpName } from "./mcp"

// 获取所有内置 MCP 服务
const allMcps = createBuiltinMcps()

// 禁用特定服务
const limitedMcps = createBuiltinMcps(["websearch"])
```

**文档**: [index.md](./index.md)

---

## 配置对比

| 服务 | 需要 API Key | 环境变量 | 认证头 | OAuth |
|------|-------------|----------|--------|-------|
| websearch | 是 | `EXA_API_KEY` | `x-api-key` | 禁用 |
| context7 | 是 | `CONTEXT7_API_KEY` | `Authorization: Bearer` | 禁用 |
| grep_app | 否 | 无 | 无 | 禁用 |

---

## 环境变量配置

在使用需要认证的 MCP 服务前，需要设置相应的环境变量：

```bash
# Exa AI Web 搜索
export EXA_API_KEY="your-exa-api-key"

# Context7 文档检索
export CONTEXT7_API_KEY="your-context7-api-key"
```

或者在项目根目录创建 `.env` 文件：

```env
EXA_API_KEY=your-exa-api-key
CONTEXT7_API_KEY=your-context7-api-key
```

---

## 添加新的内置 MCP 服务

要添加新的内置 MCP 服务，需要：

1. **创建配置文件**: 在 `src/mcp/` 目录下创建新的 `.ts` 文件（如 `new-service.ts`）

2. **更新类型定义**: 在 `types.ts` 中更新 `McpNameSchema` 枚举：
   ```typescript
   export const McpNameSchema = z.enum([
     "websearch",
     "context7",
     "grep_app",
     "new_service"  // 添加新服务
   ])
   ```

3. **注册到主入口**: 在 `index.ts` 中导入并添加到 `allBuiltinMcps`：
   ```typescript
   import { new_service } from "./new-service"
   
   const allBuiltinMcps: Record<McpName, RemoteMcpConfig> = {
     websearch,
     context7,
     grep_app,
     new_service,  // 添加新服务
   }
   ```

4. **创建文档**: 创建对应的 `.md` 文档文件

---

## 架构说明

### 三层 MCP 架构

根据项目文档，OpenCode 支持三种 MCP 配置方式：

1. **内置 MCP** (本目录): 预配置的远程服务（websearch, context7, grep_app）
2. **Claude Code 兼容**: 通过 `.mcp.json` 文件配置，支持 `${VAR}` 变量扩展
3. **Skill 嵌入**: 在 skill YAML frontmatter 中定义 MCP 配置

本目录实现的是第一层：内置 MCP 服务配置。

### 配置对象结构

所有内置 MCP 服务都遵循 `RemoteMcpConfig` 类型：

```typescript
{
  type: "remote",           // 服务类型
  url: string,              // MCP 服务端点
  enabled: boolean,         // 是否启用
  headers?: Record<string, string>,  // 认证头（可选）
  oauth?: false             // 禁用 OAuth（可选）
}
```

---

## 依赖关系

```
index.ts
├── websearch.ts
├── context7.ts
├── grep-app.ts
└── types.ts
    └── zod (外部依赖)
```

---

## 注意事项

1. **API Key 安全**: 永远不要将 API Key 硬编码在代码中，使用环境变量
2. **网络依赖**: 所有内置 MCP 服务都需要网络连接
3. **错误处理**: 建议在调用层实现适当的错误处理和重试逻辑
4. **服务限制**: 注意各服务的使用限制和速率限制
5. **向后兼容**: 修改枚举或配置结构可能影响现有用户，需谨慎处理

---

## 相关文档

- [MCP 协议官方文档](https://modelcontextprotocol.io)
- [项目 AGENTS.md](../../AGENTS.md) - 项目整体架构说明
- [MCP 架构说明](../../AGENTS.md#mcp-architecture) - 三层 MCP 系统详解
