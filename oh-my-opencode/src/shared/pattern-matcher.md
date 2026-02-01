# pattern-matcher.ts

## 文件功能概述

该文件提供了工具名称模式匹配功能，用于 Claude Code Hooks 系统中匹配工具事件和对应的钩子处理程序。

## 主要函数/类详细说明

### `matchesToolMatcher(toolName, matcher): boolean`
检查工具名称是否匹配给定的匹配器模式。
- **参数**:
  - `toolName`: 工具名称
  - `matcher`: 匹配器模式（支持 `*` 通配符和多模式 `|` 分隔）
- **匹配规则**:
  - 空匹配器匹配所有工具
  - `*` 作为通配符（如 `"read*"` 匹配 `"readFile"`, `"readDir"`）
  - 多个模式用 `|` 分隔（如 `"read|write"`）
  - 不区分大小写

#### 匹配示例

| 匹配器 | 工具名 | 结果 |
|--------|--------|------|
| `"*"` | 任意 | true |
| `"read*"` | `"readFile"` | true |
| `"read\|write"` | `"writeFile"` | true |
| `"ReadFile"` | `"readfile"` | true（不区分大小写） |

### `findMatchingHooks(config, eventName, toolName?): HookMatcher[]`
从配置中查找匹配指定事件和工具的钩子。
- **参数**:
  - `config`: Claude Hooks 配置
  - `eventName`: 事件名称（如 `"PreToolUse"`）
  - `toolName`: 可选的工具名称
- **返回值**: 匹配的钩子数组

## 使用示例

```typescript
import { matchesToolMatcher, findMatchingHooks } from './pattern-matcher';

// 模式匹配
console.log(matchesToolMatcher("readFile", "read*"));     // true
console.log(matchesToolMatcher("writeFile", "read|write*")); // true
console.log(matchesToolMatcher("delete", ""));          // true

// 查找钩子
const hooks = findMatchingHooks(config, "PreToolUse", "readFile");
// 返回所有匹配 "readFile" 的 PreToolUse 钩子
```

## 依赖关系

- `../hooks/claude-code-hooks/types`: 类型定义

## 注意事项

1. **通配符**: `*` 匹配任意字符序列（包括空）
2. **多模式**: 使用 `|` 分隔多个模式
3. **大小写**: 匹配时不区分大小写
