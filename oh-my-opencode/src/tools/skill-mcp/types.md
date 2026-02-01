# skill-mcp/types.ts

## 文件功能概述

Skill MCP 工具的类型定义文件，定义了 MCP 调用参数接口。这些参数用于调用技能嵌入的 MCP 服务器的工具、资源和提示。

## 主要类型定义

### SkillMcpArgs
MCP 调用参数接口。

```typescript
interface SkillMcpArgs {
  mcp_name: string;                          // MCP 服务器名称
  tool_name?: string;                        // 要调用的工具名称（可选）
  resource_name?: string;                    // 要读取的资源 URI（可选）
  prompt_name?: string;                      // 要获取的提示名称（可选）
  arguments?: string | Record<string, unknown>; // 参数（JSON 字符串或对象，可选）
  grep?: string;                             // 输出过滤正则模式（可选）
}
```

**参数说明**：
- **mcp_name** (必需): 技能配置中定义的 MCP 服务器名称
- **tool_name** (可选): 调用 MCP 工具时使用
- **resource_name** (可选): 读取 MCP 资源时使用
- **prompt_name** (可选): 获取 MCP 提示时使用
- **arguments** (可选): 传递给工具或提示的参数
- **grep** (可选): 过滤输出的正则表达式模式

**互斥规则**：
- `tool_name`、`resource_name`、`prompt_name` 三者互斥，只能指定其中一个
- 不指定任何操作参数会报错
- 同时指定多个操作参数会报错

## 依赖关系

### 无内部依赖
纯类型定义文件。

### 无外部依赖
不依赖其他模块。

## 使用示例

```typescript
import type { SkillMcpArgs } from './types';

// 调用工具
const toolArgs: SkillMcpArgs = {
  mcp_name: 'sqlite',
  tool_name: 'query',
  arguments: { sql: 'SELECT * FROM users' }
};

// 读取资源
const resourceArgs: SkillMcpArgs = {
  mcp_name: 'memory',
  resource_name: 'memory://notes'
};

// 获取提示
const promptArgs: SkillMcpArgs = {
  mcp_name: 'helper',
  prompt_name: 'summarize',
  arguments: { text: 'Long text to summarize...' }
};

// 带过滤的调用
const filteredArgs: SkillMcpArgs = {
  mcp_name: 'search',
  tool_name: 'search',
  arguments: { query: 'test' },
  grep: 'error|warning'  // 只返回包含 error 或 warning 的行
};
```

## 注意事项

1. **必需参数**：mcp_name 是唯一必需参数
2. **互斥参数**：tool_name、resource_name、prompt_name 只能选一个
3. **参数格式**：arguments 可以是 JSON 字符串或对象
4. **过滤模式**：grep 参数使用 JavaScript 正则表达式
5. **大小写敏感**：grep 默认不区分大小写（使用 'i' 标志）
6. **错误处理**：无效参数会返回详细的错误信息

