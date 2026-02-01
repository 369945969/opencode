# grep-app.ts - Grep.app 代码搜索 MCP 配置

## 文件功能概述

该文件定义了 Grep.app 代码搜索服务的 MCP (Model Context Protocol) 配置。Grep.app 是一个强大的代码搜索引擎，允许在大量开源代码库中搜索特定代码模式。

## 主要配置对象

### grep_app

```typescript
export const grep_app = {
  type: "remote" as const,
  url: "https://mcp.grep.app",
  enabled: true,
  oauth: false as const,
}
```

**描述**: Grep.app 代码搜索服务的远程 MCP 配置

**配置属性**:

| 属性 | 类型 | 值 | 说明 |
|------|------|-----|------|
| `type` | `"remote"` | `"remote"` | 远程 MCP 服务类型 |
| `url` | `string` | `"https://mcp.grep.app"` | Grep.app MCP 服务端点 |
| `enabled` | `boolean` | `true` | 默认启用该服务 |
| `oauth` | `false` | `false` | 禁用 OAuth 自动检测 |

## 代码逻辑流程

```
┌─────────────────────────────────────────────────────────────┐
│                 grep-app.ts 加载                             │
├─────────────────────────────────────────────────────────────┤
│  1. 定义 grep_app 配置对象（无动态逻辑）                       │
│     - type: "remote"                                        │
│     - url: "https://mcp.grep.app"                           │
│     - enabled: true                                         │
│     - oauth: false                                          │
│  2. 导出 grep_app 配置对象                                    │
└─────────────────────────────────────────────────────────────┘
```

## 与其他 MCP 配置的区别

### 无 API Key 要求

与 `websearch.ts` 和 `context7.ts` 不同，`grep-app.ts` **不需要 API Key**:

| 配置 | 需要 API Key | 认证方式 |
|------|-------------|----------|
| `websearch` | 是 | `x-api-key` 头 |
| `context7` | 是 | `Authorization: Bearer` 头 |
| `grep_app` | 否 | 无需认证（或服务器端处理） |

这种差异反映了不同服务的商业模式和访问策略。

## 使用示例

### 基本使用

```typescript
import { grep_app } from "./grep-app"
import { createBuiltinMcps } from "./index"

// 直接使用配置
console.log(grep_app.url) // "https://mcp.grep.app"

// 通过工厂函数创建（包含 grep_app）
const mcps = createBuiltinMcps()
console.log(mcps.grep_app) // { type: "remote", url: "...", ... }
```

### 禁用服务

```typescript
import { createBuiltinMcps } from "./index"

// 禁用 grep_app 服务
const mcps = createBuiltinMcps(["grep_app"])
console.log(mcps.grep_app) // undefined
```

## Grep.app 服务特性

### 代码搜索能力

Grep.app 提供以下搜索功能：
- **模式匹配**: 使用正则表达式搜索代码
- **语言过滤**: 按编程语言筛选结果
- **仓库范围**: 在特定仓库或全局搜索
- **语义理解**: 理解代码结构和上下文

### 使用场景

- 查找特定函数或类的使用示例
- 发现代码模式的实现方式
- 学习开源项目的最佳实践
- 验证代码片段的来源和可靠性

## 依赖关系

### 导入依赖

该文件无外部导入依赖，纯配置对象定义。

### 被依赖模块

| 模块 | 用途 |
|------|------|
| `index.ts` | 导入 grep_app 配置并注册到内置 MCP 列表 |

## 注意事项

1. **无需环境变量**: 
   - grep_app 不需要设置任何环境变量
   - 这使得部署和配置更加简单

2. **服务可用性**: 
   - 需要网络连接才能访问 Grep.app 服务
   - 服务可能因网络问题或服务器维护而暂时不可用

3. **使用限制**: 
   - 虽然不需要 API Key，但可能有使用频率限制
   - 大量或频繁的查询可能需要考虑速率限制

4. **OAuth 禁用**: 
   - 显式设置 `oauth: false` 确保 OpenCode 不会尝试 OAuth 流程
   - 即使服务未来支持 OAuth，此配置也会保持向后兼容

5. **命名规范**: 
   - 文件名使用 kebab-case: `grep-app.ts`
   - 导出变量名使用 snake_case: `grep_app`
   - 这种命名方式与 `types.ts` 中定义的 `McpName` 枚举保持一致

6. **错误处理**: 
   - 建议在调用层实现适当的错误处理
   - 网络超时、服务不可用等情况需要优雅处理

## 相关链接

- Grep.app 官网: https://grep.app
- MCP 协议文档: https://modelcontextprotocol.io
