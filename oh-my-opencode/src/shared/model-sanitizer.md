# model-sanitizer.ts

## 文件功能概述

该文件提供了模型字段的清理功能，用于处理不同命令来源（claude-code 或 opencode）的模型配置。

## 主要函数/类详细说明

### 类型定义

#### `CommandSource`
- **类型**: `"claude-code" | "opencode"`
- **说明**: 命令来源类型

### 函数

#### `sanitizeModelField(model, source): string | undefined`
清理模型字段值。
- **参数**:
  - `model`: 模型值（任意类型）
  - `source`: 命令来源，默认 `"claude-code"`
- **返回值**: 清理后的模型字符串，或 `undefined`
- **处理逻辑**:
  - **claude-code**: 始终返回 `undefined`（不处理）
  - **opencode**: 如果是非空字符串，返回 trim 后的值

## 使用示例

```typescript
import { sanitizeModelField } from './model-sanitizer';

// Claude Code 来源 - 始终返回 undefined
const result1 = sanitizeModelField("gpt-4", "claude-code");
// undefined

// OpenCode 来源 - 处理字符串
const result2 = sanitizeModelField("  gpt-4  ", "opencode");
// "gpt-4"

const result3 = sanitizeModelField("", "opencode");
// undefined

const result4 = sanitizeModelField(123, "opencode");
// undefined
```

## 依赖关系

- **无外部依赖**

## 注意事项

1. **Claude Code 兼容**: 对于 claude-code 来源，始终返回 `undefined` 以保持兼容
2. **空值处理**: 空字符串和非字符串值都返回 `undefined`
3. **字符串清理**: 对有效字符串进行 `trim()` 处理
