# Builtin Commands Module

## 文件功能概述

`builtin-commands` 模块提供内置命令系统，支持预定义的命令模板，包括初始化、重构、工作流循环等功能。

## 模块组成

- `commands.ts`: 命令加载和注册
- `types.ts`: 类型定义
- `templates/`: 命令模板目录
  - `init-deep.ts`: 深度初始化命令
  - `ralph-loop.ts`: Ralph 自引用开发循环
  - `refactor.ts`: 智能重构命令
  - `start-work.ts`: 开始工作任务

## 内置命令列表

| 命令名 | 描述 | 参数 |
|--------|------|------|
| `init-deep` | 初始化分层 AGENTS.md 知识库 | `[--create-new] [--max-depth=N]` |
| `ralph-loop` | 自引用开发循环直到完成 | `"task" [--completion-promise=TEXT] [--max-iterations=N]` |
| `ulw-loop` | 超工作模式循环 | `"task" [--completion-promise=TEXT] [--max-iterations=N]` |
| `cancel-ralph` | 取消活跃的 Ralph Loop | 无 |
| `refactor` | 智能重构（LSP、AST-grep、TDD） | `<target> [--scope=<file\|module\|project>] [--strategy=<safe\|aggressive>]` |
| `start-work` | 从 Prometheus 计划开始工作 | `[plan-name]` |

## 使用示例

```typescript
import { loadBuiltinCommands } from "./commands"

// 加载所有内置命令
const commands = loadBuiltinCommands()

// 禁用特定命令
const commands = loadBuiltinCommands(["ralph-loop", "ulw-loop"])

// 使用命令
// /init-deep --create-new
// /ralph-loop "实现用户认证功能"
// /refactor src/utils.ts --scope=module --strategy=safe
```

## 命令结构

每个命令包含：
- `name`: 命令名称
- `description`: 命令描述
- `template`: 提示词模板
- `agent`: 可选的指定代理
- `model`: 可选的指定模型
- `argumentHint`: 参数提示

## 依赖关系

- `../claude-code-command-loader`: 命令加载器类型
