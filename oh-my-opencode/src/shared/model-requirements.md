# model-requirements.ts

## 文件功能概述

该文件定义了各代理和类别的模型需求配置，包括模型回退链（fallback chain）。当首选模型不可用时，系统会按照回退链顺序尝试其他模型。

## 主要类型定义

### `FallbackEntry`
- **属性**:
  - `providers`: 提供商列表（按优先级排序）
  - `model`: 模型名称
  - `variant?`: 模型变体（如 "max", "high", "medium"）

### `ModelRequirement`
- **属性**:
  - `fallbackChain`: 回退链数组
  - `variant?`: 默认变体

## 代理模型配置

### AGENT_MODEL_REQUIREMENTS

| 代理 | 首选模型 | 回退链 |
|------|---------|--------|
| **sisyphus** | anthropic/claude-opus-4-5 (max) | zai-coding-plan/glm-4.7 → openai/gpt-5.2-codex → google/gemini-3-pro |
| **oracle** | openai/gpt-5.2 (high) | anthropic/claude-opus-4-5 → google/gemini-3-pro |
| **librarian** | zai-coding-plan/glm-4.7 | opencode/big-pickle → anthropic/claude-sonnet-4-5 |
| **explore** | anthropic/claude-haiku-4-5 | github-copilot/gpt-5-mini → opencode/gpt-5-nano |
| **multimodal-looker** | google/gemini-3-flash | openai/gpt-5.2 → zai-coding-plan/glm-4.6v → anthropic/claude-haiku-4-5 |
| **prometheus** | anthropic/claude-opus-4-5 (max) | openai/gpt-5.2 → google/gemini-3-pro |
| **metis** | anthropic/claude-opus-4-5 (max) | openai/gpt-5.2 → google/gemini-3-pro |
| **momus** | openai/gpt-5.2 (medium) | anthropic/claude-opus-4-5 → google/gemini-3-pro |
| **atlas** | anthropic/claude-sonnet-4-5 | openai/gpt-5.2 → google/gemini-3-pro |

## 类别模型配置

### CATEGORY_MODEL_REQUIREMENTS

| 类别 | 描述 | 首选模型 |
|------|------|---------|
| **visual-engineering** | 视觉工程 | google/gemini-3-pro |
| **ultrabrain** | 超高性能 | openai/gpt-5.2-codex (xhigh) |
| **artistry** | 艺术创作 | google/gemini-3-pro (max) |
| **quick** | 快速响应 | anthropic/claude-haiku-4-5 |
| **unspecified-low** | 未指定-低要求 | anthropic/claude-sonnet-4-5 |
| **unspecified-high** | 未指定-高要求 | anthropic/claude-opus-4-5 (max) |
| **writing** | 写作 | google/gemini-3-flash |

## 使用示例

```typescript
import { AGENT_MODEL_REQUIREMENTS, CATEGORY_MODEL_REQUIREMENTS } from './model-requirements';

// 获取代理的模型需求
const sisyphusReq = AGENT_MODEL_REQUIREMENTS['sisyphus'];
console.log(sisyphusReq.fallbackChain[0]);
// { providers: ['anthropic', 'github-copilot', 'opencode'], model: 'claude-opus-4-5', variant: 'max' }

// 获取类别的模型需求
const quickReq = CATEGORY_MODEL_REQUIREMENTS['quick'];
console.log(quickReq.fallbackChain[0]);
// { providers: ['anthropic', 'github-copilot', 'opencode'], model: 'claude-haiku-4-5' }
```

## 依赖关系

- **无外部依赖**

## 注意事项

1. **回退链顺序**: 按优先级从高到低排列
2. **提供商列表**: 同一模型可在多个提供商使用
3. **变体标记**: 用于指定模型的特定配置（如温度、最大 token 等）
4. **github-copilot**: 作为通用提供商出现在多数回退链中
5. **opencode**: 作为后备提供商提供基础模型
