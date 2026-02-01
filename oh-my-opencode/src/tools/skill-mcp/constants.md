# skill-mcp/constants.ts

## 文件功能概述

Skill MCP 工具的常量定义文件，定义了工具名称和描述等静态字符串常量。

## 主要常量

### SKILL_MCP_TOOL_NAME
工具名称标识符。

```typescript
export const SKILL_MCP_TOOL_NAME = "skill_mcp";
```

**用途**：
- 工具注册标识
- 日志记录前缀
- 错误消息引用

### SKILL_MCP_DESCRIPTION
工具描述字符串。

```typescript
export const SKILL_MCP_DESCRIPTION = `Invoke MCP server operations from skill-embedded MCPs. Requires mcp_name plus exactly one of: tool_name, resource_name, or prompt_name.`;
```

**用途**：
- 向 LLM 解释工具用途
- 说明必需参数和互斥规则

## 依赖关系

### 无内部依赖
纯常量定义文件。

### 无外部依赖
不依赖其他模块。

## 使用示例

```typescript
import { SKILL_MCP_TOOL_NAME, SKILL_MCP_DESCRIPTION } from './constants';

// 工具注册
const tool = {
  name: SKILL_MCP_TOOL_NAME,
  description: SKILL_MCP_DESCRIPTION
};

// 日志记录
console.log(`[${SKILL_MCP_TOOL_NAME}] Invoking MCP operation...`);
```

## 注意事项

1. **常量值**：工具名称为 `"skill_mcp"`，用于标识工具
2. **描述内容**：强调了参数互斥性（只能选一个操作类型）
3. **不可变性**：虽然未使用 `as const`，但这些值不应修改
4. **国际化**：当前为英文描述

