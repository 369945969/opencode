# schema.ts

## 文件功能概述

本文件是 `oh-my-opencode` 插件的核心配置文件，使用 [Zod](https://zod.dev/) 库定义了所有配置项的 schema 和类型。它提供了完整的类型安全验证机制，确保用户配置的正确性。

该文件定义了超过 30 个 schema 和对应的 TypeScript 类型，涵盖了代理(Agents)、钩子(Hooks)、技能(Skills)、MCP 服务器、实验性功能等所有配置模块。

## 主要 Schema 定义

### 1. 权限相关 Schema

#### `PermissionValue`
- **类型**: `z.enum(["ask", "allow", "deny"])`
- **描述**: 定义三种权限级别
  - `ask`: 需要询问用户
  - `allow`: 允许执行
  - `deny`: 拒绝执行

#### `BashPermission`
- **类型**: 联合类型，可以是单个权限值或按目录的权限映射
- **描述**: 支持全局权限或针对特定目录的细粒度权限控制

#### `AgentPermissionSchema`
- **字段**:
  - `edit`: 文件编辑权限
  - `bash`: Bash 命令执行权限
  - `webfetch`: 网络请求权限
  - `doom_loop`: 循环检测权限
  - `external_directory`: 外部目录访问权限

### 2. 代理名称 Schema

#### `BuiltinAgentNameSchema`
定义了 10 个内置代理名称：
- `sisyphus`: 主要协调器
- `prometheus`: 战略规划代理
- `oracle`: 咨询和调试代理
- `librarian`: 文档和 GitHub 搜索代理
- `explore`: 快速代码库搜索代理
- `multimodal-looker`: PDF/图像分析代理
- `metis`: 智能代理
- `momus`: 批评代理
- `atlas`: 主协调器

#### `OverridableAgentNameSchema`
定义了 13 个可覆盖配置的代理名称，包括上述代理以及 `build`、`plan`、`sisyphus-junior`、`OpenCode-Builder`。

### 3. 钩子名称 Schema

#### `HookNameSchema`
定义了 32 个生命周期钩子：

**监控类钩子**:
- `todo-continuation-enforcer`: TODO 连续性强制执行
- `context-window-monitor`: 上下文窗口监控
- `comment-checker`: 注释检查器
- `thinking-block-validator`: 思考块验证器
- `empty-task-response-detector`: 空任务响应检测器

**会话管理类钩子**:
- `session-recovery`: 会话恢复
- `session-notification`: 会话通知

**工具处理类钩子**:
- `grep-output-truncator`: Grep 输出截断器
- `tool-output-truncator`: 工具输出截断器
- `edit-error-recovery`: 编辑错误恢复
- `delegate-task-retry`: 任务委托重试

**注入类钩子**:
- `directory-agents-injector`: 目录代理注入器
- `directory-readme-injector`: 目录 README 注入器
- `rules-injector`: 规则注入器
- `compaction-context-injector`: 压缩上下文注入器

**代理特定钩子**:
- `thinking-block-validator`: 思考块验证器
- `ralph-loop`: Ralph 循环
- `prometheus-md-only`: Prometheus Markdown 专用
- `sisyphus-junior-notepad`: Sisyphus Junior 记事本
- `atlas`: Atlas 主协调器

**其他钩子**:
- `think-mode`: 思考模式
- `anthropic-context-window-limit-recovery`: Anthropic 上下文窗口限制恢复
- `background-notification`: 后台通知
- `auto-update-checker`: 自动更新检查器
- `startup-toast`: 启动提示
- `keyword-detector`: 关键词检测器
- `agent-usage-reminder`: 代理使用提醒
- `non-interactive-env`: 非交互式环境
- `interactive-bash-session`: 交互式 Bash 会话
- `category-skill-reminder`: 类别技能提醒
- `claude-code-hooks`: Claude Code 兼容钩子
- `auto-slash-command`: 自动斜杠命令
- `start-work`: 开始工作

### 4. 命令名称 Schema

#### `BuiltinCommandNameSchema`
定义了 2 个内置命令：
- `init-deep`: 深度初始化
- `start-work`: 开始工作

### 5. 代理覆盖配置 Schema

#### `AgentOverrideConfigSchema`
定义了代理的详细配置选项：

**模型配置**:
- `model`: 使用的 AI 模型（已弃用，使用 `category` 替代）
- `variant`: 模型变体
- `category`: 继承的类别名称
- `temperature`: 温度参数 (0-2)
- `top_p`: Top-p 采样参数 (0-1)

**提示词配置**:
- `prompt`: 自定义提示词
- `prompt_append`: 追加提示词
- `skills`: 注入的技能名称数组

**功能配置**:
- `tools`: 工具启用/禁用映射
- `disable`: 是否禁用代理
- `description`: 代理描述
- `mode`: 运行模式 (`subagent`, `primary`, `all`)
- `color`: 代理颜色（十六进制）
- `permission`: 代理权限配置
- `maxTokens`: 最大 token 数

**高级配置**:
- `thinking`: 扩展思考配置（Anthropic）
  - `type`: `enabled` 或 `disabled`
  - `budgetTokens`: 预算 token 数
- `reasoningEffort`: 推理努力程度（OpenAI: `low`, `medium`, `high`, `xhigh`）
- `textVerbosity`: 文本详细程度 (`low`, `medium`, `high`)
- `providerOptions`: 提供商特定选项

### 6. 类别配置 Schema

#### `CategoryConfigSchema`
定义了代理类别的配置：
- `description`: 类别描述
- `model`: 默认模型
- `variant`: 模型变体
- `temperature`: 温度
- `top_p`: Top-p
- `maxTokens`: 最大 token 数
- `thinking`: 思考配置
- `reasoningEffort`: 推理努力程度
- `textVerbosity`: 文本详细程度
- `tools`: 工具映射
- `prompt_append`: 追加提示词
- `is_unstable_agent`: 标记为不稳定代理（强制后台模式）

#### `BuiltinCategoryNameSchema`
定义了 8 个内置类别：
- `visual-engineering`: 视觉工程
- `ultrabrain`: 超级大脑
- `artistry`: 艺术性
- `quick`: 快速
- `unspecified-low`: 未指定（低）
- `unspecified-high`: 未指定（高）
- `writing`: 写作

### 7. Claude Code 兼容配置

#### `ClaudeCodeConfigSchema`
配置 Claude Code 兼容性功能：
- `mcp`: MCP 服务器
- `commands`: 命令
- `skills`: 技能
- `agents`: 代理
- `hooks`: 钩子
- `plugins`: 插件
- `plugins_override`: 插件覆盖配置

### 8. Sisyphus 代理配置

#### `SisyphusAgentConfigSchema`
- `disabled`: 是否禁用
- `default_builder_enabled`: 默认构建器启用
- `planner_enabled`: 规划器启用
- `replace_plan`: 替换计划

### 9. 注释检查器配置

#### `CommentCheckerConfigSchema`
- `custom_prompt`: 自定义提示词，支持 `{{comments}}` 占位符

### 10. 动态上下文修剪配置

#### `DynamicContextPruningConfigSchema`
- `enabled`: 是否启用（默认：false）
- `notification`: 通知级别 (`off`, `minimal`, `detailed`)
- `turn_protection`: 轮次保护配置
  - `enabled`: 是否启用
  - `turns`: 保护轮数 (1-10)
- `protected_tools`: 受保护的工具列表
- `strategies`: 修剪策略
  - `deduplication`: 去重策略
  - `supersede_writes`: 写入替代策略
  - `purge_errors`: 错误清除策略

### 11. 技能配置

#### `SkillSourceSchema`
技能源定义，支持：
- 字符串路径
- 对象配置（path, recursive, glob）

#### `SkillDefinitionSchema`
技能定义：
- `description`: 描述
- `template`: 模板
- `from`: 来源
- `model`: 模型
- `agent`: 代理
- `subtask`: 是否子任务
- `argument-hint`: 参数提示
- `license`: 许可证
- `compatibility`: 兼容性
- `metadata`: 元数据
- `allowed-tools`: 允许的工具
- `disable`: 是否禁用

#### `SkillsConfigSchema`
技能配置，支持两种格式：
- 字符串数组（简单启用）
- 对象配置（详细配置 + sources/enable/disable）

### 12. Ralph Loop 配置

#### `RalphLoopConfigSchema`
- `enabled`: 是否启用（默认：false）
- `default_max_iterations`: 默认最大迭代次数 (1-1000)
- `state_dir`: 状态文件目录

### 13. 后台任务配置

#### `BackgroundTaskConfigSchema`
- `defaultConcurrency`: 默认并发数
- `providerConcurrency`: 按提供商的并发配置
- `modelConcurrency`: 按模型的并发配置
- `staleTimeoutMs`: 任务超时时间（毫秒，最小 60000）

### 14. 通知配置

#### `NotificationConfigSchema`
- `force_enable`: 强制启用会话通知

### 15. Git Master 配置

#### `GitMasterConfigSchema`
- `commit_footer`: 提交消息页脚（默认：true）
- `include_co_authored_by`: 包含共同作者（默认：true）

### 16. 浏览器自动化配置

#### `BrowserAutomationProviderSchema`
提供商选项：
- `playwright`: Playwright MCP 服务器
- `agent-browser`: Vercel 的 agent-browser CLI
- `dev-browser`: dev-browser 技能

#### `BrowserAutomationConfigSchema`
- `provider`: 提供商选择

### 17. Tmux 配置

#### `TmuxLayoutSchema`
布局选项：
- `main-horizontal`: 主窗格在上，代理窗格在下
- `main-vertical`: 主窗格在左，代理窗格在右（默认）
- `tiled`: 所有窗格等大小网格
- `even-horizontal`: 所有窗格水平排列
- `even-vertical`: 所有窗格垂直排列

#### `TmuxConfigSchema`
- `enabled`: 是否启用
- `layout`: 布局类型
- `main_pane_size`: 主窗格大小 (20-80)
- `main_pane_min_width`: 主窗格最小宽度
- `agent_pane_min_width`: 代理窗格最小宽度

### 18. Sisyphus 任务配置

#### `SisyphusTasksConfigSchema`
- `enabled`: 是否启用（默认：false）
- `storage_path`: 存储路径（默认：.sisyphus/tasks）
- `claude_code_compat`: Claude Code 路径兼容模式

#### `SisyphusSwarmConfigSchema`
- `enabled`: 是否启用（默认：false）
- `storage_path`: 存储路径（默认：.sisyphus/teams）
- `ui_mode`: UI 模式 (`toast`, `tmux`, `both`)

### 19. 主配置 Schema

#### `OhMyOpenCodeConfigSchema`
这是整个插件的主配置 schema，包含所有子配置：
- `$schema`: JSON Schema 路径
- `disabled_mcps`: 禁用的 MCP 服务器
- `disabled_agents`: 禁用的代理
- `disabled_skills`: 禁用的技能
- `disabled_hooks`: 禁用的钩子
- `disabled_commands`: 禁用的命令
- `agents`: 代理覆盖配置
- `categories`: 类别配置
- `claude_code`: Claude Code 兼容配置
- `sisyphus_agent`: Sisyphus 代理配置
- `comment_checker`: 注释检查器配置
- `experimental`: 实验性功能配置
- `auto_update`: 自动更新
- `skills`: 技能配置
- `ralph_loop`: Ralph Loop 配置
- `background_task`: 后台任务配置
- `notification`: 通知配置
- `git_master`: Git Master 配置
- `browser_automation_engine`: 浏览器自动化配置
- `tmux`: Tmux 配置
- `sisyphus`: Sisyphus 配置

## TypeScript 类型导出

文件末尾导出了所有 schema 对应的 TypeScript 类型：

```typescript
export type OhMyOpenCodeConfig = z.infer<typeof OhMyOpenCodeConfigSchema>
export type AgentOverrideConfig = z.infer<typeof AgentOverrideConfigSchema>
export type AgentOverrides = z.infer<typeof AgentOverridesSchema>
export type BackgroundTaskConfig = z.infer<typeof BackgroundTaskConfigSchema>
export type AgentName = z.infer<typeof AgentNameSchema>
export type HookName = z.infer<typeof HookNameSchema>
export type BuiltinCommandName = z.infer<typeof BuiltinCommandNameSchema>
export type BuiltinSkillName = z.infer<typeof BuiltinSkillNameSchema>
export type SisyphusAgentConfig = z.infer<typeof SisyphusAgentConfigSchema>
export type CommentCheckerConfig = z.infer<typeof CommentCheckerConfigSchema>
export type ExperimentalConfig = z.infer<typeof ExperimentalConfigSchema>
export type DynamicContextPruningConfig = z.infer<typeof DynamicContextPruningConfigSchema>
export type SkillsConfig = z.infer<typeof SkillsConfigSchema>
export type SkillDefinition = z.infer<typeof SkillDefinitionSchema>
export type RalphLoopConfig = z.infer<typeof RalphLoopConfigSchema>
export type NotificationConfig = z.infer<typeof NotificationConfigSchema>
export type CategoryConfig = z.infer<typeof CategoryConfigSchema>
export type CategoriesConfig = z.infer<typeof CategoriesConfigSchema>
export type BuiltinCategoryName = z.infer<typeof BuiltinCategoryNameSchema>
export type GitMasterConfig = z.infer<typeof GitMasterConfigSchema>
export type BrowserAutomationProvider = z.infer<typeof BrowserAutomationProviderSchema>
export type BrowserAutomationConfig = z.infer<typeof BrowserAutomationConfigSchema>
export type TmuxConfig = z.infer<typeof TmuxConfigSchema>
export type TmuxLayout = z.infer<typeof TmuxLayoutSchema>
export type SisyphusTasksConfig = z.infer<typeof SisyphusTasksConfigSchema>
export type SisyphusSwarmConfig = z.infer<typeof SisyphusSwarmConfigSchema>
export type SisyphusConfig = z.infer<typeof SisyphusConfigSchema>
```

## 代码逻辑流程

1. **导入依赖**: 导入 Zod 库和 MCP 类型定义
2. **定义基础 Schema**: 从权限值开始，逐步构建复杂 schema
3. **定义枚举 Schema**: 代理名称、钩子名称、命令名称等
4. **定义配置 Schema**: 各类配置项的详细 schema
5. **定义主 Schema**: 组合所有子配置到 `OhMyOpenCodeConfigSchema`
6. **导出类型**: 使用 `z.infer` 生成 TypeScript 类型
7. **重新导出**: 导出 MCP 相关类型以保持统一接口

## 使用示例

### 验证配置

```typescript
import { OhMyOpenCodeConfigSchema } from "./schema"

const config = {
  disabled_agents: ["explore"],
  agents: {
    sisyphus: {
      temperature: 0.1,
      skills: ["git-master"]
    }
  },
  experimental: {
    dynamic_context_pruning: {
      enabled: true,
      notification: "detailed"
    }
  }
}

// 验证配置
const result = OhMyOpenCodeConfigSchema.safeParse(config)
if (result.success) {
  console.log("配置有效")
} else {
  console.error("配置错误:", result.error)
}
```

### 类型使用

```typescript
import type { OhMyOpenCodeConfig, AgentOverrideConfig } from "./schema"

function loadConfig(): OhMyOpenCodeConfig {
  // 返回符合类型的配置对象
  return {
    disabled_hooks: ["comment-checker"],
    categories: {
      "ultrabrain": {
        model: "anthropic/claude-opus-4-5",
        temperature: 0.1
      }
    }
  }
}
```

## 依赖关系

### 外部依赖
- **zod**: 运行时类型验证库

### 内部依赖
- `../mcp/types`: MCP 名称相关的 schema 和类型

### 被依赖
- `index.ts`: 导出本文件的所有内容
- 整个插件的配置系统都基于本文件的定义

## 注意事项

1. **Schema 修改**: 修改 schema 后需要运行 `bun run build:schema` 重新生成 JSON Schema
2. **向后兼容**: 添加新字段时应使用 `.optional()` 保持向后兼容
3. **默认值**: 使用 `.default()` 为字段提供合理的默认值
4. **弃用字段**: 使用 JSDoc `@deprecated` 标记弃用字段，并说明替代方案
5. **验证范围**: 数值字段应使用 `.min()` 和 `.max()` 限制范围
6. **正则验证**: 颜色等格式使用 `.regex()` 进行验证
7. **联合类型**: 使用 `z.union()` 和 `z.intersection()` 构建复杂类型
8. **类型推断**: 始终使用 `z.infer` 生成 TypeScript 类型，保持类型与 schema 同步
