# types.ts - MCP 类型定义

## 文件功能概述

该文件定义了 MCP (Model Context Protocol) 相关的类型和 Zod 验证模式。它是整个 MCP 模块的基础类型定义文件，为内置 MCP 服务提供类型安全和运行时验证。

## 主要类型和模式

### 1. McpNameSchema

```typescript
export const McpNameSchema = z.enum(["websearch", "context7", "grep_app"])
```

**描述**: 内置 MCP 服务名称的 Zod 枚举模式

**枚举值**:
- `websearch` - Exa 网络搜索服务
- `context7` - Context7 文档检索服务
- `grep_app` - Grep.app 代码搜索服务

**用途**: 用于验证和限制可用的内置 MCP 服务名称

### 2. McpName

```typescript
export type McpName = z.infer<typeof McpNameSchema>
```

**描述**: 从 `McpNameSchema` 推断出的 TypeScript 类型

**类型**: `"websearch" | "context7" | "grep_app"`

### 3. AnyMcpNameSchema

```typescript
export const AnyMcpNameSchema = z.string().min(1)
```

**描述**: 任意 MCP 服务名称的 Zod 验证模式

**验证规则**:
- 必须是字符串类型
- 最小长度为 1（非空字符串）

**用途**: 用于验证外部或自定义 MCP 服务名称

### 4. AnyMcpName

```typescript
export type AnyMcpName = z.infer<typeof AnyMcpNameSchema>
```

**描述**: 从 `AnyMcpNameSchema` 推断出的 TypeScript 类型

**类型**: `string`

## 代码逻辑流程

```
┌─────────────────────────────────────────────────────────────┐
│                    types.ts 加载                             │
├─────────────────────────────────────────────────────────────┤
│  1. 导入 zod 库                                              │
│  2. 定义 McpNameSchema (内置 MCP 枚举)                        │
│  3. 推断 McpName 类型                                        │
│  4. 定义 AnyMcpNameSchema (通用字符串验证)                     │
│  5. 推断 AnyMcpName 类型                                     │
│  6. 导出所有定义                                             │
└─────────────────────────────────────────────────────────────┘
```

## 使用示例

### 类型导入

```typescript
import { McpName, McpNameSchema, AnyMcpName } from "./types"

// 使用内置 MCP 名称类型
const builtinMcp: McpName = "websearch" // ✓ 有效
// const invalidMcp: McpName = "unknown" // ✗ 类型错误

// 使用通用 MCP 名称类型
const customMcp: AnyMcpName = "my-custom-mcp" // ✓ 有效
```

### 运行时验证

```typescript
import { McpNameSchema, AnyMcpNameSchema } from "./types"

// 验证内置 MCP 名称
const result1 = McpNameSchema.safeParse("websearch")
console.log(result1.success) // true

const result2 = McpNameSchema.safeParse("unknown")
console.log(result2.success) // false

// 验证通用 MCP 名称
const result3 = AnyMcpNameSchema.safeParse("my-mcp")
console.log(result3.success) // true

const result4 = AnyMcpNameSchema.safeParse("")
console.log(result4.success) // false (空字符串)
```

## 依赖关系

### 导入依赖

| 模块 | 用途 |
|------|------|
| `zod` | 运行时类型验证和模式定义 |

### 被依赖模块

| 模块 | 用途 |
|------|------|
| `index.ts` | 导入 McpName 类型和 McpNameSchema |
| 其他 MCP 配置模块 | 可能使用这些类型进行类型注解 |

## 注意事项

1. **类型安全**: 使用 Zod 模式确保运行时类型安全，不仅限于编译时检查

2. **扩展性**: 添加新的内置 MCP 服务时，需要更新 `McpNameSchema` 枚举

3. **命名规范**: 
   - 内置 MCP 使用 kebab-case (如 `grep_app`)
   - 自定义 MCP 可以使用任何非空字符串

4. **验证时机**: 
   - `McpNameSchema` 用于验证已知内置服务
   - `AnyMcpNameSchema` 用于验证外部或动态 MCP 名称

5. **向后兼容**: 修改枚举值可能影响现有配置，需要谨慎处理
