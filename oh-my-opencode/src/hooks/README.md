# Hooks 目录

本目录包含 OpenCode 插件的所有生命周期钩子（Hooks），用于增强和定制 OpenCode 的行为。

## 目录概述

`src/hooks/` 目录包含 32+ 个生命周期钩子，涵盖以下功能领域：

- **任务协调与管理**: Atlas、TODO 强制执行、Ralph 循环等
- **上下文注入**: 规则注入、AGENTS.md、README.md 自动注入
- **错误恢复**: 会话恢复、上下文窗口恢复、编辑错误恢复
- **工具增强**: 输出截断、委托任务重试、问题标签截断
- **代理管理**: Prometheus 限制、子代理控制、使用提醒
- **会话管理**: 通知、后台任务、交互式 Bash
- **智能检测**: 关键词检测、思考模式、自动斜杠命令
- **Claude Code 兼容**: 完整的 Claude Code 钩子兼容层

## 主要 Hooks 分类

### 1. 协调与任务管理

| Hook | 文件 | 功能描述 |
|------|------|----------|
| **Atlas** | `atlas/index.ts` | 主协调器，管理任务委托、验证和进度跟踪 |
| **TODO 强制执行器** | `todo-continuation-enforcer.ts` | 当有待办事项时自动继续执行 |
| **Ralph 循环** | `ralph-loop/index.ts` | 自动循环直到任务完成 |
| **开始工作** | `start-work/index.ts` | 处理 /start-work 命令，加载工作计划 |

### 2. 上下文注入

| Hook | 文件 | 功能描述 |
|------|------|----------|
| **规则注入器** | `rules-injector/index.ts` | 自动注入 .cursor/rules、.claude/rules 等规则文件 |
| **目录 Agents 注入** | `directory-agents-injector/index.ts` | 自动注入目录中的 AGENTS.md |
| **目录 README 注入** | `directory-readme-injector/index.ts` | 自动注入目录中的 README.md |
| **压缩上下文注入** | `compaction-context-injector/index.ts` | 在会话压缩时注入关键上下文 |

### 3. 错误恢复与监控

| Hook | 文件 | 功能描述 |
|------|------|----------|
| **会话恢复** | `session-recovery/index.ts` | 自动恢复损坏的会话 |
| **Anthropic 上下文恢复** | `anthropic-context-window-limit-recovery/index.ts` | 自动压缩和恢复超出上下文限制 |
| **编辑错误恢复** | `edit-error-recovery/index.ts` | 检测 Edit 工具错误并提供恢复提示 |
| **思考块验证器** | `thinking-block-validator/index.ts` | 验证和修复思考块结构 |
| **上下文窗口监控** | `context-window-monitor.ts` | 监控上下文窗口使用情况 |

### 4. 工具增强

| Hook | 文件 | 功能描述 |
|------|------|----------|
| **工具输出截断** | `tool-output-truncator.ts` | 截断过长的工具输出 |
| **问题标签截断** | `question-label-truncator/index.ts` | 截断问题选项标签 |
| **委托任务重试** | `delegate-task-retry/index.ts` | 检测委托任务错误并提供重试指导 |
| **空任务响应检测** | `empty-task-response-detector.ts` | 检测空任务响应 |

### 5. 代理管理与限制

| Hook | 文件 | 功能描述 |
|------|------|----------|
| **Prometheus MD 限制** | `prometheus-md-only/index.ts` | 限制 Prometheus 只能写入 .sisyphus/*.md |
| **Sisyphus Junior 记事本** | `sisyphus-junior-notepad/index.ts` | 为子代理注入记事本指令 |
| **子代理问题阻止器** | `subagent-question-blocker/index.ts` | 阻止子代理使用 question 工具 |
| **Agent 使用提醒** | `agent-usage-reminder/index.ts` | 提醒使用 Agent 而非直接调用工具 |
| **类别技能提醒** | `category-skill-reminder/index.ts` | 提醒使用 category+skill 委托 |

### 6. 会话管理

| Hook | 文件 | 功能描述 |
|------|------|----------|
| **会话通知** | `session-notification.ts` | 会话空闲时发送桌面通知 |
| **后台通知** | `background-notification/index.ts` | 后台任务完成通知 |
| **交互式 Bash 会话** | `interactive-bash-session/index.ts` | 管理交互式 Bash 会话 |
| **非交互式环境** | `non-interactive-env/index.ts` | 为非交互式环境设置环境变量 |

### 7. 智能检测与模式

| Hook | 文件 | 功能描述 |
|------|------|----------|
| **关键词检测** | `keyword-detector/index.ts` | 检测 ultrawork、search、analyze 等关键词 |
| **思考模式** | `think-mode/index.ts` | 检测 think 关键词并启用思考模式 |
| **自动斜杠命令** | `auto-slash-command/index.ts` | 自动检测和执行斜杠命令 |

### 8. 代码质量

| Hook | 文件 | 功能描述 |
|------|------|----------|
| **注释检查器** | `comment-checker/index.ts` | 检查文件中的 TODO 注释 |

### 9. 维护与更新

| Hook | 文件 | 功能描述 |
|------|------|----------|
| **自动更新检查** | `auto-update-checker/index.ts` | 检查并自动更新插件 |

### 10. Claude Code 兼容

| Hook | 文件 | 功能描述 |
|------|------|----------|
| **Claude Code Hooks** | `claude-code-hooks/index.ts` | 完整的 Claude Code 钩子兼容层 |

## 文件列表

### 根目录文件
- [index.ts](./index.md) - 主入口文件，导出所有 hooks
- [context-window-monitor.ts](./context-window-monitor.md) - 上下文窗口监控
- [empty-task-response-detector.ts](./empty-task-response-detector.md) - 空任务响应检测
- [session-notification.ts](./session-notification.md) - 会话通知
- [session-notification-utils.ts](./session-notification-utils.md) - 会话通知工具
- [todo-continuation-enforcer.ts](./todo-continuation-enforcer.md) - TODO 强制执行
- [tool-output-truncator.ts](./tool-output-truncator.md) - 工具输出截断

### 子目录
- [agent-usage-reminder/](./agent-usage-reminder/) - Agent 使用提醒
- [anthropic-context-window-limit-recovery/](./anthropic-context-window-limit-recovery/) - Anthropic 上下文恢复
- [atlas/](./atlas/) - Atlas 主协调器
- [auto-slash-command/](./auto-slash-command/) - 自动斜杠命令
- [auto-update-checker/](./auto-update-checker/) - 自动更新检查
- [background-notification/](./background-notification/) - 后台通知
- [category-skill-reminder/](./category-skill-reminder/) - 类别技能提醒
- [claude-code-hooks/](./claude-code-hooks/) - Claude Code 兼容层
- [comment-checker/](./comment-checker/) - 注释检查器
- [compaction-context-injector/](./compaction-context-injector/) - 压缩上下文注入
- [delegate-task-retry/](./delegate-task-retry/) - 委托任务重试
- [directory-agents-injector/](./directory-agents-injector/) - 目录 Agents 注入
- [directory-readme-injector/](./directory-readme-injector/) - 目录 README 注入
- [edit-error-recovery/](./edit-error-recovery/) - 编辑错误恢复
- [interactive-bash-session/](./interactive-bash-session/) - 交互式 Bash 会话
- [keyword-detector/](./keyword-detector/) - 关键词检测
- [non-interactive-env/](./non-interactive-env/) - 非交互式环境
- [prometheus-md-only/](./prometheus-md-only/) - Prometheus MD 限制
- [question-label-truncator/](./question-label-truncator/) - 问题标签截断
- [ralph-loop/](./ralph-loop/) - Ralph 循环
- [rules-injector/](./rules-injector/) - 规则注入器
- [session-recovery/](./session-recovery/) - 会话恢复
- [sisyphus-junior-notepad/](./sisyphus-junior-notepad/) - Sisyphus Junior 记事本
- [start-work/](./start-work/) - 开始工作
- [subagent-question-blocker/](./subagent-question-blocker/) - 子代理问题阻止器
- [task-resume-info/](./task-resume-info/) - 任务恢复信息
- [think-mode/](./think-mode/) - 思考模式
- [thinking-block-validator/](./thinking-block-validator/) - 思考块验证器

## 使用说明

所有 hooks 都通过 `index.ts` 统一导出：

```typescript
import { 
  createAtlasHook,
  createTodoContinuationEnforcer,
  createRulesInjectorHook,
  // ... 其他 hooks
} from "./hooks";
```

每个 hook 都是一个工厂函数，接收 `PluginInput` 和可选配置参数，返回包含事件处理器和工具钩子的对象。

## 架构设计

- **事件驱动**: 所有 hooks 都响应 OpenCode 的事件系统（session.idle, session.error, message.updated 等）
- **工具拦截**: 通过 `tool.execute.before` 和 `tool.execute.after` 拦截工具调用
- **状态管理**: 使用内存 Map 和文件存储管理状态
- **上下文注入**: 在关键点自动注入相关上下文信息
- **错误恢复**: 自动检测和恢复各种错误场景

## 注意事项

1. 所有 hooks 都遵循 OpenCode 插件 API 规范
2. 状态持久化存储在 `~/.config/opencode/` 或 `~/.cache/opencode/` 目录
3. 部分 hooks 依赖外部二进制文件（如 comment-checker）
4. 所有 hooks 都支持配置启用/禁用
5. 详细文档请查看各子目录下的 README.md 和 .md 文件

