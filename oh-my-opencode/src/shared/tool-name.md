# tool-name.ts

## 文件功能概述

该文件提供了工具名称转换功能，将各种格式的工具名称（如 snake_case、kebab-case）转换为 PascalCase 格式。主要用于统一处理不同来源的工具名称，确保在插件系统中工具名称的一致性。

## 主要函数/类详细说明

### 常量

#### `SPECIAL_TOOL_MAPPINGS`
- **类型**: `Record<string, string>`
- **说明**: 特殊工具名称的映射表，用于处理需要特定转换的工具名
- **内容**:
  - `webfetch` → `"WebFetch"`
  - `websearch` → `"WebSearch"`
  - `todoread` → `"TodoRead"`
  - `todowrite` → `"TodoWrite"`
- **用途**: 这些工具名有特定的 PascalCase 格式要求，不遵循通用转换规则

### 函数

#### `toPascalCase(str: string): string`
将字符串转换为 PascalCase 格式（私有辅助函数）。
- **参数**: `str` - 输入字符串
- **返回值**: PascalCase 格式的字符串
- **转换步骤**:
  1. 按 `-`, `_`, `\s`（空格）分割字符串
  2. 每个单词首字母大写，其余小写
  3. 连接所有单词
- **示例**:
  - `"my-tool-name"` → `"MyToolName"`
  - `"my_tool_name"` → `"MyToolName"`
  - `"my tool name"` → `"MyToolName"`

#### `transformToolName(toolName: string): string`
转换工具名称为统一的 PascalCase 格式。
- **参数**: `toolName` - 原始工具名称
- **返回值**: 转换后的 PascalCase 工具名称
- **转换逻辑**:
  1. **特殊映射检查**: 首先检查小写后的名称是否在 `SPECIAL_TOOL_MAPPINGS` 中
  2. **分隔符检查**: 如果名称包含 `-` 或 `_`，使用 `toPascalCase` 转换
  3. **首字母大写**: 如果没有分隔符，仅首字母大写
- **转换示例**:
  | 输入 | 输出 | 说明 |
  |------|------|------|
  | `"webfetch"` | `"WebFetch"` | 特殊映射 |
  | `"my-tool"` | `"MyTool"` | kebab-case 转 PascalCase |
  | `"my_tool"` | `"MyTool"` | snake_case 转 PascalCase |
  | `"read"` | `"Read"` | 仅首字母大写 |
  | `"WebSearch"` | `"WebSearch"` | 已经是 PascalCase |

## 代码逻辑流程

```
transformToolName(toolName)
├── 转为小写
├── 检查特殊映射表
│   └── 如果匹配 → 返回映射值
├── 检查是否包含分隔符 (- 或 _)
│   └── 如果包含 → 调用 toPascalCase()
└── 默认处理 → 首字母大写
```

## 使用示例

```typescript
import { transformToolName } from './tool-name';

// 特殊映射
console.log(transformToolName("webfetch"));    // "WebFetch"
console.log(transformToolName("websearch"));   // "WebSearch"
console.log(transformToolName("todoread"));    // "TodoRead"
console.log(transformToolName("todowrite"));   // "TodoWrite"

// kebab-case 转换
console.log(transformToolName("read-file"));   // "ReadFile"
console.log(transformToolName("write-file"));  // "WriteFile"
console.log(transformToolName("git-status"));  // "GitStatus"

// snake_case 转换
console.log(transformToolName("read_file"));   // "ReadFile"
console.log(transformToolName("write_file"));  // "WriteFile"

// 简单名称
console.log(transformToolName("read"));        // "Read"
console.log(transformToolName("write"));       // "Write"
console.log(transformToolName("edit"));        // "Edit"

// 已经是 PascalCase
console.log(transformToolName("WebFetch"));    // "WebFetch"
console.log(transformToolName("ReadFile"));    // "ReadFile"

// 实际应用场景：统一工具名称
const toolNames = [
  "read-file",
  "write_file",
  "webfetch",
  "git-status",
  "edit"
];

const normalized = toolNames.map(transformToolName);
// ["ReadFile", "WriteFile", "WebFetch", "GitStatus", "Edit"]
```

## 依赖关系

- **无外部依赖**: 纯字符串处理函数

## 注意事项

1. **大小写不敏感的特殊映射**: 特殊映射表检查时先将输入转为小写，所以 `"WebFetch"` 和 `"webfetch"` 都会映射到 `"WebFetch"`
2. **分隔符处理**: 支持 `-`（连字符）、`_`（下划线）和空格作为单词分隔符
3. **性能**: 转换逻辑简单，性能开销极小
4. **幂等性**: 对已经是 PascalCase 的字符串（不含分隔符），仅首字母大写，可能改变原格式（如 `"WebFetch"` → `"Webfetch"`）
5. **扩展性**: 如需添加新的特殊映射，只需在 `SPECIAL_TOOL_MAPPINGS` 中添加条目
