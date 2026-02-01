# model-resolver.ts

## 文件功能概述

该文件提供了 AI 模型选择解析功能。实现了一个分层的模型选择策略，支持用户覆盖、回退链和系统默认等多种选择方式。

## 主要函数/类详细说明

### 类型定义

#### `ModelResolutionInput`
- **属性**:
  - `userModel?`: 用户指定的模型
  - `inheritedModel?`: 继承的模型
  - `systemDefault?`: 系统默认模型

#### `ModelSource`
- **类型**: `"override" | "provider-fallback" | "system-default"`
- **说明**: 模型来源类型

#### `ModelResolutionResult`
- **属性**:
  - `model`: 解析后的模型名称
  - `source`: 模型来源
  - `variant?`: 模型变体

#### `ExtendedModelResolutionInput`
- **属性**:
  - `uiSelectedModel?`: UI 选择的模型
  - `userModel?`: 用户指定的模型
  - `fallbackChain?`: 回退链
  - `availableModels`: 可用模型集合
  - `systemDefaultModel?`: 系统默认模型

### 函数

#### `resolveModel(input): string | undefined`
基础模型解析（简单优先级）。
- **优先级**:
  1. `userModel`
  2. `inheritedModel`
  3. `systemDefault`

#### `resolveModelWithFallback(input): ModelResolutionResult | undefined`
高级模型解析（带回退链）。
- **解析步骤**:
  1. **UI 选择**（最高优先级）: 使用用户在 OpenCode UI 中选择的模型
  2. **配置覆盖**: 使用 `oh-my-opencode.json` 中的配置
  3. **回退链**: 按优先级尝试回退链中的模型
     - 首先检查已连接的提供商
     - 然后检查模型可用性缓存
  4. **系统默认**: 使用配置的默认模型

## 使用示例

```typescript
import { resolveModel, resolveModelWithFallback } from './model-resolver';

// 简单解析
const model = resolveModel({
  userModel: 'gpt-4',
  inheritedModel: 'claude-3',
  systemDefault: 'gpt-3.5'
});
// 结果: "gpt-4"

// 高级解析（带回退链）
const result = resolveModelWithFallback({
  uiSelectedModel: undefined,
  userModel: undefined,
  fallbackChain: [
    { providers: ['anthropic'], model: 'claude-opus-4' },
    { providers: ['openai'], model: 'gpt-4' }
  ],
  availableModels: new Set(['anthropic/claude-opus-4', 'openai/gpt-4']),
  systemDefaultModel: 'openai/gpt-3.5'
});

// 结果: { model: "anthropic/claude-opus-4", source: "provider-fallback" }
```

## 依赖关系

- `./logger`: 日志记录
- `./model-availability`: 模型可用性检查
- `./model-requirements`: 模型需求定义
- `./connected-providers-cache`: 已连接提供商缓存

## 注意事项

1. **优先级**: UI 选择 > 配置覆盖 > 回退链 > 系统默认
2. **回退链**: 按顺序尝试每个提供商的模型
3. **可用性检查**: 使用模糊匹配检查模型是否可用
4. **缓存利用**: 优先使用已连接的提供商缓存
