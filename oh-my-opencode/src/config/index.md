# index.ts

## 文件功能概述

本文件是 `oh-my-opencode` 插件配置模块的入口文件（Barrel File），采用**桶模式**（Barrel Pattern）统一导出 `schema.ts` 中定义的所有 schema 和 TypeScript 类型。

该文件的主要作用是：
1. **简化导入路径**: 其他模块只需从 `config` 目录导入，无需知道具体文件
2. **统一接口**: 提供一致的外部接口，隐藏内部文件结构
3. **类型导出**: 同时导出 schema 对象和 TypeScript 类型

## 导出的 Schema 对象

| 导出名称 | 来源 | 说明 |
|---------|------|------|
| `OhMyOpenCodeConfigSchema` | `./schema` | 主配置 schema |
| `AgentOverrideConfigSchema` | `./schema` | 代理覆盖配置 schema |
| `AgentOverridesSchema` | `./schema` | 代理覆盖集合 schema |
| `McpNameSchema` | `./schema` | MCP 名称 schema |
| `AgentNameSchema` | `./schema` | 代理名称 schema |
| `HookNameSchema` | `./schema` | 钩子名称 schema |
| `BuiltinCommandNameSchema` | `./schema` | 内置命令名称 schema |
| `SisyphusAgentConfigSchema` | `./schema` | Sisyphus 代理配置 schema |
| `ExperimentalConfigSchema` | `./schema` | 实验性功能配置 schema |
| `RalphLoopConfigSchema` | `./schema` | Ralph Loop 配置 schema |
| `TmuxConfigSchema` | `./schema` | Tmux 配置 schema |
| `TmuxLayoutSchema` | `./schema` | Tmux 布局 schema |

## 导出的 TypeScript 类型

| 导出名称 | 来源 | 说明 |
|---------|------|------|
| `OhMyOpenCodeConfig` | `./schema` | 主配置类型 |
| `AgentOverrideConfig` | `./schema` | 代理覆盖配置类型 |
| `AgentOverrides` | `./schema` | 代理覆盖集合类型 |
| `McpName` | `./schema` | MCP 名称类型 |
| `AgentName` | `./schema` | 代理名称类型 |
| `HookName` | `./schema` | 钩子名称类型 |
| `BuiltinCommandName` | `./schema` | 内置命令名称类型 |
| `SisyphusAgentConfig` | `./schema` | Sisyphus 代理配置类型 |
| `ExperimentalConfig` | `./schema` | 实验性功能配置类型 |
| `DynamicContextPruningConfig` | `./schema` | 动态上下文修剪配置类型 |
| `RalphLoopConfig` | `./schema` | Ralph Loop 配置类型 |
| `TmuxConfig` | `./schema` | Tmux 配置类型 |
| `TmuxLayout` | `./schema` | Tmux 布局类型 |

## 代码逻辑流程

```
index.ts (入口文件)
    │
    ├── 从 schema.ts 导入所有 schema 对象
    │   └── schema.ts 使用 Zod 定义验证规则
    │
    ├── 从 schema.ts 导入所有 TypeScript 类型
    │   └── 类型通过 z.infer<typeof Schema> 推断
    │
    └── 统一重新导出
        ├── Schema 对象（用于运行时验证）
        └── TypeScript 类型（用于编译时类型检查）
```

## 使用示例

### 导入 Schema 进行验证

```typescript
// 从配置模块导入 schema
import { OhMyOpenCodeConfigSchema, AgentNameSchema } from "@/config"

// 验证配置对象
const userConfig = {
  disabled_agents: ["explore"],
  experimental: {
    auto_resume: true
  }
}

const result = OhMyOpenCodeConfigSchema.safeParse(userConfig)
if (!result.success) {
  console.error("配置验证失败:", result.error.errors)
}
```

### 导入类型进行类型注解

```typescript
// 从配置模块导入类型
import type { OhMyOpenCodeConfig, AgentName, HookName } from "@/config"

// 使用类型注解
function processConfig(config: OhMyOpenCodeConfig): void {
  // 类型安全的配置处理
  if (config.disabled_agents) {
    config.disabled_agents.forEach((agent: AgentName) => {
      console.log(`禁用代理: ${agent}`)
    })
  }
}

// 类型安全的常量定义
const enabledHooks: HookName[] = [
  "session-recovery",
  "context-window-monitor"
]
```

### 同时导入 Schema 和类型

```typescript
// 同时导入 schema 和类型
import {
  AgentOverrideConfigSchema,
  type AgentOverrideConfig,
  type AgentName
} from "@/config"

// 使用 schema 验证
const rawConfig = { temperature: 0.5 }
const parsed = AgentOverrideConfigSchema.parse(rawConfig)

// 使用类型注解
function updateAgent(name: AgentName, config: AgentOverrideConfig): void {
  // 实现逻辑
}
```

## 依赖关系

### 内部依赖
- `./schema`: 所有导出内容都来自 schema.ts 文件

### 被依赖
本文件作为配置模块的入口，被以下模块使用：
- 配置管理器 (`src/cli/config-manager.ts`)
- 代理系统 (`src/agents/`)
- 钩子系统 (`src/hooks/`)
- 工具系统 (`src/tools/`)
- 主入口 (`src/index.ts`)
- 以及其他需要配置验证和类型的模块

## 设计模式

### Barrel Pattern（桶模式）
本文件采用桶模式，这是 TypeScript/JavaScript 项目中常见的模块组织方式：

**优点**:
- 简化导入语句
- 隐藏内部模块结构
- 便于重构（内部文件移动不影响外部导入）
- 提供统一的公共 API

**示例对比**:
```typescript
// 不使用 barrel pattern（繁琐）
import { OhMyOpenCodeConfigSchema } from "./config/schema"
import type { OhMyOpenCodeConfig } from "./config/schema"

// 使用 barrel pattern（简洁）
import { OhMyOpenCodeConfigSchema, type OhMyOpenCodeConfig } from "./config"
```

## 注意事项

1. **保持同步**: 当 `schema.ts` 添加新的导出时，需要同步更新本文件
2. **命名规范**: 导出的 schema 名称以 `Schema` 结尾，类型名称不使用后缀
3. **类型导出**: 使用 `export type` 明确标记类型导出，有助于某些构建工具进行优化
4. **不要添加逻辑**: 本文件应仅包含导出语句，不应包含任何业务逻辑
5. **循环依赖**: 注意避免与 `schema.ts` 产生循环依赖
