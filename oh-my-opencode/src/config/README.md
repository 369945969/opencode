# config 目录

## 目录概述

`src/config/` 目录是 `oh-my-opencode` 插件的配置系统核心模块，负责定义、验证和管理所有配置项的类型安全和结构规范。

该模块使用 **Zod** 作为运行时类型验证库，提供了完整的配置验证机制和 TypeScript 类型支持。

## 文件列表

| 文件 | 说明 | 行数 |
|------|------|------|
| [schema.ts](./schema.ts) | 核心配置 schema 定义 | 419 |
| [index.ts](./index.ts) | 模块入口，统一导出 | 31 |
| [schema.test.ts](./schema.test.ts) | schema 单元测试 | - |

## 架构设计

### 配置系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                    配置系统架构                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐     ┌──────────────┐     ┌─────────────┐ │
│  │  User Config │────▶│  Zod Schema  │────▶│ TS Types    │ │
│  │  (JSON/JSONC)│     │  (schema.ts) │     │ (type infer)│ │
│  └──────────────┘     └──────────────┘     └─────────────┘ │
│                              │                              │
│                              ▼                              │
│                       ┌──────────────┐                      │
│                       │  Validation  │                      │
│                       │  Runtime     │                      │
│                       └──────────────┘                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 模块职责

#### schema.ts
- **职责**: 定义所有配置项的 Zod schema 和 TypeScript 类型
- **内容**: 
  - 35+ 个 schema 定义
  - 27+ 个 TypeScript 类型导出
  - 权限系统、代理配置、钩子配置、技能配置等
- **关键特性**:
  - 运行时类型验证
  - 默认值支持
  - 详细的错误信息
  - 向后兼容设计

#### index.ts
- **职责**: 模块入口，统一导出公共 API
- **内容**:
  - 12 个 schema 对象导出
  - 13 个 TypeScript 类型导出
- **关键特性**:
  - Barrel Pattern 设计
  - 简化导入路径
  - 隐藏内部实现

## 配置分类

### 1. 权限配置 (Permission)
- `PermissionValue`: 权限级别枚举 (ask/allow/deny)
- `BashPermission`: Bash 命令权限
- `AgentPermissionSchema`: 代理权限集合

### 2. 代理配置 (Agents)
- `BuiltinAgentNameSchema`: 10 个内置代理
- `OverridableAgentNameSchema`: 13 个可覆盖代理
- `AgentOverrideConfigSchema`: 代理详细配置
- `AgentOverridesSchema`: 代理覆盖集合

### 3. 钩子配置 (Hooks)
- `HookNameSchema`: 32 个生命周期钩子
- 分类：监控类、会话管理类、工具处理类、注入类、代理特定类

### 4. 类别配置 (Categories)
- `BuiltinCategoryNameSchema`: 8 个内置类别
- `CategoryConfigSchema`: 类别详细配置
- `CategoriesConfigSchema`: 类别集合

### 5. 技能配置 (Skills)
- `BuiltinSkillNameSchema`: 4 个内置技能
- `SkillSourceSchema`: 技能源定义
- `SkillDefinitionSchema`: 技能定义
- `SkillsConfigSchema`: 技能配置

### 6. 实验性功能 (Experimental)
- `ExperimentalConfigSchema`: 实验性功能开关
- `DynamicContextPruningConfigSchema`: 动态上下文修剪
- `RalphLoopConfigSchema`: Ralph Loop 功能

### 7. 集成配置 (Integration)
- `ClaudeCodeConfigSchema`: Claude Code 兼容
- `BrowserAutomationConfigSchema`: 浏览器自动化
- `TmuxConfigSchema`: Tmux 集成
- `GitMasterConfigSchema`: Git 集成

### 8. 任务系统 (Task System)
- `SisyphusAgentConfigSchema`: Sisyphus 代理配置
- `SisyphusTasksConfigSchema`: 任务系统配置
- `SisyphusSwarmConfigSchema`: Swarm 系统配置
- `BackgroundTaskConfigSchema`: 后台任务配置

### 9. 主配置 (Main Config)
- `OhMyOpenCodeConfigSchema`: 完整配置 schema
- 包含所有子配置的集合

## 使用方式

### 验证配置

```typescript
import { OhMyOpenCodeConfigSchema } from "./config"

const config = {
  disabled_agents: ["explore"],
  agents: {
    sisyphus: {
      temperature: 0.1
    }
  }
}

const result = OhMyOpenCodeConfigSchema.safeParse(config)
if (result.success) {
  console.log("配置有效")
} else {
  console.error("配置错误:", result.error.errors)
}
```

### 使用类型

```typescript
import type { OhMyOpenCodeConfig, AgentName } from "./config"

function processConfig(config: OhMyOpenCodeConfig): void {
  // 类型安全的配置处理
}

const agent: AgentName = "sisyphus"
```

### 组合使用

```typescript
import {
  AgentOverrideConfigSchema,
  type AgentOverrideConfig,
  type HookName
} from "./config"

// 验证和类型注解结合使用
const config: AgentOverrideConfig = AgentOverrideConfigSchema.parse({
  temperature: 0.5,
  skills: ["git-master"]
})

const hooks: HookName[] = ["session-recovery", "context-window-monitor"]
```

## 配置示例

### 完整配置示例

```json
{
  "$schema": "https://opencode.ai/schema.json",
  "disabled_agents": ["explore"],
  "disabled_hooks": ["comment-checker"],
  "agents": {
    "sisyphus": {
      "temperature": 0.1,
      "skills": ["git-master", "playwright"],
      "maxTokens": 8192
    }
  },
  "categories": {
    "ultrabrain": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.1
    }
  },
  "experimental": {
    "dynamic_context_pruning": {
      "enabled": true,
      "notification": "detailed"
    }
  },
  "tmux": {
    "enabled": true,
    "layout": "main-vertical",
    "main_pane_size": 60
  }
}
```

## 依赖关系

### 外部依赖
- **zod**: 运行时类型验证库 (^3.x)

### 内部依赖
- `../mcp/types`: MCP 名称相关类型

### 被依赖模块
- `src/cli/config-manager.ts`: 配置管理器
- `src/index.ts`: 主入口
- `src/agents/`: 代理系统
- `src/hooks/`: 钩子系统
- `src/tools/`: 工具系统
- 其他所有需要配置验证的模块

## 开发指南

### 添加新配置项

1. **在 schema.ts 中定义 schema**:
```typescript
export const NewFeatureConfigSchema = z.object({
  enabled: z.boolean().default(false),
  option: z.string().optional()
})
```

2. **导出类型**:
```typescript
export type NewFeatureConfig = z.infer<typeof NewFeatureConfigSchema>
```

3. **添加到主配置**:
```typescript
export const OhMyOpenCodeConfigSchema = z.object({
  // ... 其他配置
  new_feature: NewFeatureConfigSchema.optional()
})
```

4. **在 index.ts 中导出**:
```typescript
export { NewFeatureConfigSchema } from "./schema"
export type { NewFeatureConfig } from "./schema"
```

### 最佳实践

1. **使用 `.optional()`**: 新字段默认使用可选，保持向后兼容
2. **提供 `.default()`**: 为字段提供合理的默认值
3. **范围验证**: 使用 `.min()` 和 `.max()` 限制数值范围
4. **正则验证**: 使用 `.regex()` 验证格式（如颜色、URL）
5. **文档注释**: 使用 JSDoc 注释说明字段用途
6. **弃用标记**: 使用 `@deprecated` 标记弃用字段

## 注意事项

1. **Schema 修改后重建**: 修改 schema 后运行 `bun run build:schema`
2. **类型同步**: 始终使用 `z.infer` 生成类型，不要手动定义
3. **测试覆盖**: 新配置项需要添加单元测试
4. **文档更新**: 修改配置后更新相关文档
5. **JSON Schema**: 配置会生成对应的 JSON Schema 供 IDE 使用

## 相关文档

- [Zod 文档](https://zod.dev/)
- [schema.ts 详细文档](./schema.md)
- [index.ts 详细文档](./index.md)
- [项目 AGENTS.md](../../AGENTS.md)
