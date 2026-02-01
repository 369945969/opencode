# OhMyOpenCode - Source Directory

## 目录概述

这是 **OhMyOpenCode** 插件的核心源代码目录，实现了多模型代理编排系统（Claude Opus 4.5、GPT-5.2、Gemini 3 Flash、Grok Code），提供 32 个生命周期钩子和 20+ 工具。

## 架构总览

```
src/
├── index.ts              # 插件主入口 (717行)
├── plugin-config.ts      # 配置加载与合并
├── plugin-state.ts       # 运行时状态管理
├── types/                # 全局类型定义
├── config/               # Zod Schema 配置系统
├── agents/               # 10个AI代理定义
├── hooks/                # 32个生命周期钩子
├── tools/                # 20+工具实现
├── features/             # 核心功能模块
├── shared/               # 55个共享工具函数
├── cli/                  # CLI安装器和诊断工具
├── mcp/                  # 内置MCP服务器
└── plugin-handlers/      # 插件处理器
```

## 模块详解

### 1. 入口文件

#### [index.ts](./index.ts) - 插件主入口
- **717行** - OpenCode 插件接口实现
- 初始化 32 个 Hook 和 20+ 工具
- 事件处理系统（chat.message, tool.execute 等）
- 技能系统整合（6层优先级）
- 会话生命周期管理

#### [plugin-config.ts](./plugin-config.ts) - 配置管理
- **133行** - 多级配置系统
- 用户级 + 项目级配置合并
- Zod Schema 验证
- JSONC 格式支持

#### [plugin-state.ts](./plugin-state.ts) - 状态管理
- **31行** - 运行时状态
- 模型上下文限制缓存
- Anthropic 1M 上下文支持

### 2. [agents/](./agents/) - AI 代理系统

**10个专业化代理：**

| 代理 | 模型 | 用途 | 复杂度 |
|------|------|------|--------|
| **Sisyphus** | Claude Opus 4.5 | 主代理，任务编排 | ⭐⭐⭐⭐⭐ |
| **Atlas** | Claude Opus 4.5 | 主协调器，TODO管理 | ⭐⭐⭐⭐⭐ |
| **Prometheus** | Claude Opus 4.5 | 战略规划 | ⭐⭐⭐⭐⭐ |
| **Oracle** | GPT-5.2 | 战略顾问，只读 | ⭐⭐⭐ |
| **Librarian** | big-pickle | 多仓库研究 | ⭐⭐⭐⭐ |
| **Explore** | GPT-5-nano | 代码库搜索 | ⭐⭐ |
| **Multimodal-Looker** | Gemini 3 Flash | 媒体文件分析 | ⭐⭐ |
| **Metis** | Claude Sonnet 4.5 | 预规划分析 | ⭐⭐⭐ |
| **Momus** | Claude Sonnet 4.5 | 计划审核 | ⭐⭐⭐ |
| **Sisyphus-Junior** | Claude Sonnet 4.5 | 轻量级执行 | ⭐⭐ |

**核心文件：**
- `types.ts` - 代理类型定义
- `utils.ts` - 代理创建工具
- `sisyphus.ts` - 主代理配置 (451行)
- `prometheus-prompt.ts` - 战略规划提示 (1284行)
- `dynamic-agent-prompt-builder.ts` - 动态提示构建

### 3. [hooks/](./hooks/) - 生命周期钩子系统

**32个钩子，分为10个类别：**

#### 协调与任务管理
- `atlas/` - 主协调器钩子 (752行)
- `todo-continuation-enforcer/` - TODO强制执行
- `ralph-loop/` - Ralph循环任务
- `start-work/` - 工作启动

#### 上下文注入
- `rules-injector/` - 规则注入系统
- `compaction-context-injector/` - 压缩上下文注入
- `directory-agents-injector/` - AGENTS.md 注入
- `directory-readme-injector/` - README.md 注入

#### 错误恢复与监控
- `anthropic-context-window-limit-recovery/` - 上下文窗口恢复
- `session-recovery/` - 会话恢复
- `edit-error-recovery/` - 编辑错误恢复
- `delegate-task-retry/` - 任务委托重试

#### 工具增强
- `tool-output-truncator/` - 输出截断
- `thinking-block-validator/` - 思考块验证
- `question-label-truncator/` - 问题标签截断

#### 代理管理
- `agent-usage-reminder/` - 代理使用提醒
- `category-skill-reminder/` - 分类技能提醒
- `subagent-question-blocker/` - 子代理问题拦截
- `prometheus-md-only/` - Prometheus 限制

#### 会话管理
- `session-notification/` - 会话通知
- `background-notification/` - 后台通知
- `interactive-bash-session/` - 交互式Bash

#### 智能检测
- `keyword-detector/` - 关键词检测
- `think-mode/` - 思考模式
- `empty-task-response-detector/` - 空响应检测

#### 代码质量
- `comment-checker/` - 注释检查器

#### 维护更新
- `auto-update-checker/` - 自动更新检查

#### Claude Code 兼容
- `claude-code-hooks/` - 完整兼容层 (16个文件)

### 4. [tools/](./tools/) - 工具系统

**20+工具，分为6个类别：**

#### 代码搜索
- `grep/` - 内容搜索
- `glob/` - 文件查找
- `ast-grep/` - AST分析

#### 代码分析
- `lsp/` - LSP客户端 (定义跳转、引用查找)

#### 会话管理
- `session-manager/` - 会话列表、消息读取、搜索

#### 任务委托
- `delegate-task/` - 任务委托 (1070行)
- `call-omo-agent/` - OMO代理调用
- `background-task/` - 后台任务

#### 技能命令
- `skill/` - 技能工具
- `skill-mcp/` - MCP技能
- `slashcommand/` - 斜杠命令

#### 其他
- `look-at/` - 多媒体分析
- `interactive-bash/` - 交互式Bash

### 5. [features/](./features/) - 核心功能模块

**18个功能模块：**

#### 后台任务
- `background-agent/` - 后台任务管理器 (1377行)
  - 任务生命周期管理
  - 并发控制
  - Tmux集成

#### 技能系统
- `builtin-skills/` - 内置技能 (1729行)
  - 技能定义和加载
  - MCP配置
- `opencode-skill-loader/` - OpenCode技能加载
- `skill-mcp-manager/` - 技能MCP管理

#### 命令系统
- `builtin-commands/` - 内置斜杠命令
  - `/refactor` - 重构命令 (619行)
  - `/commit` - 提交命令

#### 上下文注入
- `context-injector/` - 上下文注入系统

#### 会话状态
- `claude-code-session-state/` - Claude Code会话状态
- `task-toast-manager/` - 任务通知管理

#### Tmux集成
- `tmux-subagent/` - Tmux子代理管理

### 6. [shared/](./shared/) - 共享工具函数

**55个工具函数，分为12个类别：**

#### 系统指令
- `system-directive.ts` - 系统指令前缀
- `session-utils.ts` - 会话工具
- `session-cursor.ts` - 消息游标
- `first-message-variant.ts` - 首消息变体

#### 命名转换
- `snake-case.ts` - 命名转换
- `tool-name.ts` - 工具名称格式
- `case-insensitive.ts` - 大小写不敏感

#### 配置管理
- `opencode-config-dir.ts` - 配置目录
- `jsonc-parser.ts` - JSONC解析
- `frontmatter.ts` - YAML frontmatter
- `deep-merge.ts` - 深度合并
- `migration.ts` - 配置迁移

#### 版本兼容
- `opencode-version.ts` - 版本检测
- `permission-compat.ts` - 权限兼容

#### 模型管理
- `model-requirements.ts` - 模型需求
- `model-resolver.ts` - 模型解析
- `model-availability.ts` - 可用性检测
- `agent-variant.ts` - 代理变体
- `agent-tool-restrictions.ts` - 工具限制

#### 文件操作
- `file-utils.ts` - 文件工具
- `file-reference-resolver.ts` - 文件引用
- `zip-extractor.ts` - ZIP解压

#### Shell环境
- `shell-env.ts` - Shell环境
- `command-executor.ts` - 命令执行

#### Tmux工具
- `tmux/` - Tmux工具集

#### 缓存连接
- `connected-providers-cache.ts` - 提供者缓存
- `external-plugin-detector.ts` - 外部插件检测

#### 内容处理
- `dynamic-truncator.ts` - 动态截断
- `pattern-matcher.ts` - 模式匹配

### 7. [cli/](./cli/) - CLI工具

**安装器和诊断工具：**

- `install.ts` - 交互式安装器
- `config-manager.ts` - 配置管理 (664行)
- `model-fallback.ts` - 模型回退
- `run/` - 任务运行器
- `doctor/` - 诊断工具 (16项检查)
- `mcp-oauth/` - MCP OAuth认证

### 8. [mcp/](./mcp/) - 内置MCP服务器

**3个内置服务：**

| 服务 | 认证 | 功能 |
|------|------|------|
| **websearch** | API Key | Exa AI Web搜索 |
| **context7** | Bearer Token | 文档检索 |
| **grep-app** | 无需认证 | 代码搜索 |

### 9. [config/](./config/) - 配置系统

**Zod Schema配置：**

- `schema.ts` - 35+ Zod Schema定义
- 27+ TypeScript类型导出
- 权限、代理、钩子、类别、技能等配置验证

### 10. [types/](./types/) - 全局类型

- OpenCode 插件类型扩展
- 全局类型声明

## 代码统计

| 目录 | 文件数 | 主要文件行数 | 复杂度 |
|------|--------|--------------|--------|
| agents | 14 | prometheus-prompt.ts (1284) | ⭐⭐⭐⭐⭐ |
| hooks | 100+ | atlas/index.ts (752) | ⭐⭐⭐⭐⭐ |
| tools | 75+ | delegate-task/tools.ts (1070) | ⭐⭐⭐⭐ |
| features | 75+ | builtin-skills/skills.ts (1729) | ⭐⭐⭐⭐⭐ |
| shared | 41 | - | ⭐⭐⭐ |
| cli | 20+ | config-manager.ts (664) | ⭐⭐⭐ |
| config | 2 | schema.ts (400+) | ⭐⭐⭐ |

**总计：470+ TypeScript 文件**

## 设计原则

1. **模块化** - 每个目录职责单一
2. **类型安全** - 全面使用 TypeScript 和 Zod
3. **可配置** - 所有功能都可通过配置开关
4. **兼容性** - 完整的 Claude Code 兼容层
5. **可扩展** - 插件化架构，易于添加新功能

## 依赖关系

```
index.ts (入口)
├── agents/ (代理定义)
├── hooks/ (生命周期钩子)
├── tools/ (工具实现)
├── features/ (核心功能)
├── shared/ (共享工具)
├── cli/ (CLI工具)
├── mcp/ (MCP服务器)
└── config/ (配置系统)
```

## 快速导航

- **[插件入口](./index.ts)** - 从这里开始了解插件
- **[配置系统](./config/)** - 了解所有配置选项
- **[代理系统](./agents/)** - 了解10个AI代理
- **[钩子系统](./hooks/)** - 了解32个生命周期钩子
- **[工具系统](./tools/)** - 了解20+工具
- **[核心功能](./features/)** - 了解后台任务、技能系统等

## 注意事项

1. **不要从 index.ts 导出函数** - OpenCode 会将所有导出视为插件实例
2. **使用 bun-types** - 不要使用 @types/node
3. **TDD开发** - RED-GREEN-REFACTOR 流程
4. **GitHub Actions发布** - 不要直接运行 `bun publish`
5. **PR目标分支** - 所有 PR 必须指向 `dev` 分支

## 相关文档

- [AGENTS.md](./agents/AGENTS.md) - 代理知识库
- [HOOKS.md](./hooks/HOOKS.md) - 钩子知识库
- [TOOLS.md](./tools/TOOLS.md) - 工具知识库
- [FEATURES.md](./features/FEATURES.md) - 功能知识库
- [SHARED.md](./shared/SHARED.md) - 共享工具知识库
