# plugin-state.ts - 插件状态管理模块

## 文件概述

该模块管理 OhMyOpenCode 插件的运行时状态，特别是模型上下文限制缓存。用于优化模型上下文窗口限制的计算和缓存。

## 核心功能

### 1. 状态接口定义

```typescript
interface ModelCacheState {
  modelContextLimitsCache: Map<string, number>;  // 模型上下文限制缓存
  anthropicContext1MEnabled: boolean;            // Anthropic 1M 上下文是否启用
}
```

### 2. 主要函数

#### 2.1 `createModelCacheState()`

创建新的模型缓存状态实例：

**返回值：**
```typescript
{
  modelContextLimitsCache: new Map<string, number>(),  // 空的缓存映射
  anthropicContext1MEnabled: false                     // 默认禁用 1M 上下文
}
```

**用途：**
- 在插件初始化时创建状态对象
- 用于跨请求缓存模型上下文限制
- 避免重复计算或查询

#### 2.2 `getModelLimit(state, providerID, modelID)`

获取指定模型的上下文限制：

**参数：**
- `state` - 模型缓存状态对象
- `providerID` - 提供者 ID（如 "anthropic", "openai"）
- `modelID` - 模型 ID（如 "claude-sonnet-4", "gpt-5.2"）

**返回值：**
- `number` - 上下文限制（token 数量）
- `undefined` - 未找到限制信息

**查询逻辑：**

```
getModelLimit(state, providerID, modelID)
├── 构造缓存键："{providerID}/{modelID}"
├── 检查缓存
│   ├── 命中：返回缓存值
│   └── 未命中：继续检查
├── 特殊处理 Anthropic Sonnet 模型
│   ├── 检查 anthropicContext1MEnabled 标志
│   ├── 检查模型名是否包含 "sonnet"
│   └── 如果都满足：返回 1,000,000
└── 返回 undefined
```

**缓存键格式：**
```typescript
const key = `${providerID}/${modelID}`;
// 示例："anthropic/claude-sonnet-4", "openai/gpt-5.2"
```

**Anthropic 1M 上下文特殊逻辑：**
```typescript
if (
  providerID === "anthropic" &&
  state.anthropicContext1MEnabled &&
  modelID.includes("sonnet")
) {
  return 1_000_000;  // 100万 token 上下文
}
```

### 3. 使用场景

#### 3.1 插件初始化
```typescript
import { createModelCacheState } from "./plugin-state";

const modelCacheState = createModelCacheState();
```

#### 3.2 获取模型限制
```typescript
import { getModelLimit } from "./plugin-state";

const limit = getModelLimit(
  modelCacheState,
  "anthropic",
  "claude-sonnet-4"
);

if (limit) {
  console.log(`上下文限制: ${limit} tokens`);
}
```

#### 3.3 缓存上下文限制
```typescript
// 查询到限制后缓存
const key = `${providerID}/${modelID}`;
state.modelContextLimitsCache.set(key, contextLimit);
```

### 4. 设计特点

#### 4.1 轻量级状态管理
- 仅包含必要的缓存字段
- 无复杂的状态更新逻辑
- 简单的函数式接口

#### 4.2 缓存优先策略
- 优先从缓存获取
- 减少重复计算
- 提高性能

#### 4.3 特殊模型处理
- 针对 Anthropic Sonnet 的特殊逻辑
- 支持 1M 上下文窗口
- 通过标志位控制启用

### 5. 扩展性

可以轻松扩展以支持：
- 更多提供者的特殊处理
- 其他模型参数缓存
- 状态持久化

## 注意事项

1. **缓存一致性** - 缓存不会自动失效，需要手动管理
2. **内存使用** - 缓存 Map 会持续增长，需要定期清理
3. **特殊逻辑硬编码** - Anthropic 1M 上下文的逻辑是硬编码的
4. **线程安全** - 当前实现未考虑并发访问，单线程环境下使用安全
