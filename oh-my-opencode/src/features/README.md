# Features 模块总览

## 概述

`src/features/` 目录包含 oh-my-opencode 插件的所有核心功能模块。这些模块提供了与 Claude Code 的兼容性、后台任务管理、技能系统、命令系统等功能。

## 模块列表

### 1. Background Agent (`background-agent/`)

后台任务管理模块，负责任务的完整生命周期管理。

**核心功能：**
- 任务队列管理（pending → running → completed/error/cancelled）
- 并发控制（按模型/代理限制并发数）
- 状态轮询和稳定性检测
- 事件处理（session.idle, session.deleted）
- 任务完成通知机制
- Tmux 集成支持

**主要文件：**
- `manager.ts`: BackgroundManager 核心类（1419行）
- `concurrency.ts`: ConcurrencyManager 并发控制
- `types.ts`: 类型定义

**使用场景：**
```typescript
const manager = new BackgroundManager(ctx, config)
const task = await manager.launch({
  description: "分析代码",
  prompt: "分析 src/ 目录",
  agent: "analyzer",
  parentSessionID: "session-123",
})
```

---

### 2. Boulder State (`boulder-state/`)

Sisyphus 编排器的工作计划状态管理模块。

**核心功能：**
- 活动计划跟踪（存储在 `.sisyphus/boulder.json`）
- 进度计算（解析 Markdown 复选框）
- 会话历史记录
- Prometheus 计划文件发现

**主要文件：**
- `storage.ts`: 状态读写操作
- `types.ts`: BoulderState, PlanProgress 类型
- `constants.ts`: 路径常量

**使用场景：**
```typescript
const state = createBoulderState("/plans/feature.md", "session-123")
writeBoulderState("/project", state)
const progress = getPlanProgress("/plans/feature.md")
```

---

### 3. Builtin Commands (`builtin-commands/`)

内置命令系统，提供预定义的命令模板。

**核心功能：**
- 6个内置命令：init-deep, ralph-loop, ulw-loop, cancel-ralph, refactor, start-work
- 命令模板系统
- 参数提示

**主要文件：**
- `commands.ts`: 命令加载器
- `types.ts`: 类型定义
- `templates/`: 命令模板目录

**可用命令：**
| 命令 | 功能 |
|------|------|
| `/init-deep` | 初始化分层 AGENTS.md |
| `/ralph-loop` | 自引用开发循环 |
| `/refactor` | 智能重构（LSP + AST-grep） |
| `/start-work` | 从 Prometheus 计划开始工作 |

---

### 4. Builtin Skills (`builtin-skills/`)

内置技能系统，提供预定义的技能模板。

**核心功能：**
- 5个内置技能：playwright, agent-browser, frontend-ui-ux, git-master, dev-browser
- 技能模板管理
- MCP 配置支持

**主要文件：**
- `skills.ts`: 技能定义（1729行）
- `types.ts`: 技能类型

**技能列表：**
| 技能 | 用途 |
|------|------|
| `playwright` | 浏览器自动化（Playwright MCP） |
| `agent-browser` | 浏览器自动化（CLI） |
| `frontend-ui-ux` | UI/UX 设计 |
| `git-master` | Git 专家（提交、变基、搜索） |
| `dev-browser` | 开发浏览器（持久状态） |

---

### 5. Claude Code Agent Loader (`claude-code-agent-loader/`)

Claude Code 代理加载器，支持从 Markdown 文件加载代理配置。

**核心功能：**
- 从 `~/.claude/agents/` 加载用户代理
- 从 `.claude/agents/` 加载项目代理
- Frontmatter 解析
- 工具配置解析

**主要文件：**
- `loader.ts`: 加载逻辑
- `types.ts`: AgentConfig, AgentFrontmatter 类型

---

### 6. Claude Code Command Loader (`claude-code-command-loader/`)

Claude Code 命令加载器，支持分层命令系统。

**核心功能：**
- 4个作用域：user, project, opencode, opencode-project
- 子目录命令命名空间（`dir:command`）
- Handoff 工作流支持
- 模型字段清理

**主要文件：**
- `loader.ts`: 异步加载逻辑
- `types.ts`: CommandDefinition, HandoffDefinition 类型

**加载顺序：**
```
opencode-project → opencode → project → user
（后面的覆盖前面的）
```

---

### 7. Claude Code MCP Loader (`claude-code-mcp-loader/`)

Claude Code MCP 配置加载器，兼容 `.mcp.json` 格式。

**核心功能：**
- 3个作用域：user, project, local
- 环境变量扩展（`${VAR:-default}`）
- 配置转换（Claude Code → OpenCode）
- HTTP/SSE 和 stdio 类型支持

**主要文件：**
- `loader.ts`: 配置加载
- `transformer.ts`: 配置转换
- `env-expander.ts`: 环境变量扩展
- `types.ts`: MCP 类型定义

---

### 8. Claude Code Plugin Loader (`claude-code-plugin-loader/`)

Claude Code 插件系统加载器，支持完整的插件生态。

**核心功能：**
- 插件发现（`installed_plugins.json`）
- 命令加载
- 代理加载
- 技能加载
- MCP 服务器加载
- Hooks 配置加载
- 路径解析（`${CLAUDE_PLUGIN_ROOT}`）

**主要文件：**
- `loader.ts`: 完整加载逻辑（487行）
- `types.ts`: PluginManifest, LoadedPlugin 类型

---

### 9. Claude Code Session State (`claude-code-session-state/`)

会话状态管理模块，跟踪子代理会话。

**核心功能：**
- 子会话集合管理
- 主会话 ID 跟踪
- 会话代理映射

**主要文件：**
- `state.ts`: 状态管理

---

### 10. Context Injector (`context-injector/`)

上下文注入器，用于在消息中注入额外上下文。

**核心功能：**
- 上下文收集
- 消息注入
- 类型定义

**主要文件：**
- `collector.ts`: 上下文收集
- `injector.ts`: 注入逻辑
- `types.ts`: 类型定义

---

### 11. Hook Message Injector (`hook-message-injector/`)

钩子消息注入器，支持在生命周期钩子中注入消息。

**核心功能：**
- 消息字段查找
- 消息存储操作
- 常量定义

**主要文件：**
- `injector.ts`: 注入逻辑
- `constants.ts`: 常量
- `types.ts`: 类型定义

---

### 12. MCP OAuth (`mcp-oauth/`)

MCP OAuth 认证模块，支持 OAuth 2.0 流程。

**核心功能：**
- OAuth 发现（well-known 端点）
- 动态客户端注册（DCR）
- 回调服务器
- Token 存储
- Step-up 认证
- 资源指示器

**主要文件：**
- `discovery.ts`: OAuth 服务器发现
- `dcr.ts`: 动态客户端注册
- `callback-server.ts`: 回调处理
- `storage.ts`: Token 存储
- `provider.ts`: 提供商管理
- `step-up.ts`: Step-up 流程
- `resource-indicator.ts`: 资源指示器
- `schema.ts`: 类型定义

---

### 13. OpenCode Skill Loader (`opencode-skill-loader/`)

OpenCode 技能加载器，支持异步技能发现和加载。

**核心功能：**
- 异步技能加载
- 阻塞技能加载
- Worker 线程发现
- 技能内容合并

**主要文件：**
- `async-loader.ts`: 异步加载
- `blocking.ts`: 阻塞加载
- `loader.ts`: 主加载器
- `discover-worker.ts`: Worker 发现
- `merger.ts`: 内容合并
- `skill-content.ts`: 技能内容处理

---

### 14. Sisyphus Swarm (`sisyphus-swarm/`)

Sisyphus 蜂群模块，多代理协调系统。

**核心功能：**
- Mailbox 系统（消息传递）
- 类型定义

**主要文件：**
- `mailbox/types.ts`: Mailbox 类型

---

### 15. Sisyphus Tasks (`sisyphus-tasks/`)

Sisyphus 任务模块，任务存储和管理。

**核心功能：**
- 任务类型定义
- 任务存储

**主要文件：**
- `types.ts`: 任务类型
- `storage.ts`: 存储实现

---

### 16. Skill MCP Manager (`skill-mcp-manager/`)

技能 MCP 管理器，管理技能相关的 MCP 服务器。

**核心功能：**
- MCP 服务器生命周期管理
- 环境变量清理
- 类型定义

**主要文件：**
- `manager.ts`: 管理器实现
- `env-cleaner.ts`: 环境清理
- `types.ts`: 类型定义

---

### 17. Task Toast Manager (`task-toast-manager/`)

任务通知管理器，显示任务状态通知。

**核心功能：**
- 任务通知显示
- 完成通知
- 队列管理

**主要文件：**
- `manager.ts`: 通知管理
- `types.ts`: 类型定义

---

### 18. Tmux Subagent (`tmux-subagent/`)

Tmux 子代理模块，在 Tmux 环境中管理子会话。

**核心功能：**
- 窗格状态查询
- 动作执行
- 决策引擎
- 管理器协调

**主要文件：**
- `decision-engine.ts`: 决策逻辑
- `pane-state-querier.ts`: 状态查询
- `action-executor.ts`: 动作执行
- `manager.ts`: 管理器
- `types.ts`: 类型定义

---

## 模块依赖关系

```
background-agent
├── task-toast-manager
├── claude-code-session-state
├── hook-message-injector
└── ../config/schema

claude-code-plugin-loader
├── claude-code-command-loader
├── claude-code-agent-loader
├── claude-code-mcp-loader
└── opencode-skill-loader

boulder-state
└── sisyphus-tasks

builtin-commands
└── claude-code-command-loader

builtin-skills
└── skill-mcp-manager
```

## 配置集成

所有功能模块都通过 `../config/schema` 进行配置：

```typescript
interface OhMyOpencodeConfig {
  backgroundTasks?: BackgroundTaskConfig
  boulderState?: BoulderStateConfig
  builtinCommands?: BuiltinCommandConfig
  builtinSkills?: BuiltinSkillsConfig
  // ... 其他配置
}
```

## 使用建议

1. **后台任务**: 使用 `background-agent` 执行长时间运行的任务
2. **Claude Code 兼容**: 使用 `claude-code-*` 模块实现兼容层
3. **技能系统**: 使用 `builtin-skills` 或 `opencode-skill-loader` 扩展能力
4. **计划管理**: 使用 `boulder-state` 跟踪长期工作计划
5. **OAuth 认证**: 使用 `mcp-oauth` 处理第三方认证

## 测试

每个模块都包含对应的 `.test.ts` 测试文件，使用 Bun 测试框架：

```bash
bun test src/features/background-agent/
bun test src/features/boulder-state/
```

## 注意事项

1. **并发安全**: BackgroundManager 和 ConcurrencyManager 都实现了竞态条件防护
2. **资源清理**: 所有管理器都提供 `shutdown()` 方法进行优雅关闭
3. **错误处理**: 使用 try/catch 和日志记录处理错误
4. **类型安全**: 所有模块都使用 TypeScript 严格模式
5. **Claude Code 兼容**: 保持与 Claude Code 生态系统的兼容性
