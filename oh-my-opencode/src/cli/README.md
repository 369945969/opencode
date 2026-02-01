# CLI 模块

## 模块概述

CLI 模块是 oh-my-opencode 的命令行接口实现，提供了完整的安装、运行、诊断和配置管理功能。该模块使用 Commander.js 构建，支持交互式和非交互式两种操作模式。

## 目录结构

```
src/cli/
├── index.ts                    # CLI 入口，命令注册
├── types.ts                    # 安装相关类型定义
├── install.ts                  # 安装功能实现
├── config-manager.ts           # 配置管理核心
├── model-fallback.ts           # 模型回退配置生成
├── run/                        # 运行命令模块
│   ├── index.ts               # 运行模块导出
│   ├── types.ts               # 运行相关类型
│   ├── runner.ts              # 任务运行器
│   ├── completion.ts          # 完成条件检查
│   └── events.ts              # 事件处理
├── get-local-version/          # 版本查询模块
│   ├── index.ts               # 版本查询主逻辑
│   ├── types.ts               # 版本相关类型
│   └── formatter.ts           # 版本信息格式化
├── doctor/                     # 诊断模块
│   ├── index.ts               # 诊断入口
│   ├── types.ts               # 诊断类型定义
│   ├── runner.ts              # 诊断运行器
│   ├── formatter.ts           # 结果格式化
│   ├── constants.ts           # 诊断常量
│   └── checks/                # 各类检查实现
│       ├── index.ts           # 检查注册
│       ├── opencode.ts        # OpenCode 安装检查
│       ├── plugin.ts          # 插件注册检查
│       ├── config.ts          # 配置验证
│       ├── model-resolution.ts # 模型解析检查
│       ├── auth.ts            # 认证状态检查
│       ├── dependencies.ts    # 依赖检查
│       ├── gh.ts              # GitHub CLI 检查
│       ├── lsp.ts             # LSP 服务器检查
│       ├── mcp.ts             # MCP 服务器检查
│       ├── mcp-oauth.ts       # MCP OAuth 检查
│       └── version.ts         # 版本状态检查
└── mcp-oauth/                  # MCP OAuth 管理
    ├── index.ts               # OAuth 命令注册
    ├── login.ts               # 登录功能
    ├── logout.ts              # 登出功能
    └── status.ts              # 状态查询
```

## 核心功能

### 1. 安装系统 (`install.ts`)

提供交互式和非交互式两种安装模式：

- **交互式模式**: 使用 @clack/prompts 提供友好的 TUI 界面
- **非交互式模式**: 通过命令行参数快速配置

支持的模型提供商配置：
- Claude (标准/Max20 模式)
- OpenAI/ChatGPT
- Google Gemini
- GitHub Copilot
- OpenCode Zen
- Z.ai Coding Plan

### 2. 配置管理 (`config-manager.ts`)

核心配置管理功能：
- OpenCode 配置文件读写（支持 JSON/JSONC）
- 插件自动注册和版本管理
- 认证插件配置（Antigravity）
- 提供商配置生成
- 配置合并和深度合并

### 3. 模型回退 (`model-fallback.ts`)

根据用户配置的提供商自动生成模型配置：
- 智能模型分配（基于提供商优先级）
- 多层级回退链
- Agent 和 Category 模型配置
- 特殊 Agent 处理（librarian, explore, Sisyphus）

### 4. 任务运行 (`run/`)

增强的 OpenCode 运行器：
- 会话创建和管理
- 事件流处理
- 完成条件检查（todos + 子会话）
- 超时控制
- 优雅关闭

### 5. 诊断系统 (`doctor/`)

全面的健康检查系统：
- 6 大检查类别
- 16+ 项检查项目
- JSON/文本双输出格式
- 详细错误报告和修复建议

### 6. 版本管理 (`get-local-version/`)

版本查询和更新检查：
- 本地版本检测
- NPM 最新版本查询
- 开发模式检测
- 固定版本检测

### 7. MCP OAuth (`mcp-oauth/`)

MCP 服务器 OAuth 管理：
- 登录认证流程
- 令牌存储和刷新
- 状态查询
- 令牌清理

## 命令列表

| 命令 | 功能 | 示例 |
|------|------|------|
| `install` | 安装和配置插件 | `bunx oh-my-opencode install` |
| `run` | 运行任务并等待完成 | `bunx oh-my-opencode run "fix bug"` |
| `get-local-version` | 查询版本信息 | `bunx oh-my-opencode get-local-version --json` |
| `doctor` | 运行健康检查 | `bunx oh-my-opencode doctor --verbose` |
| `version` | 显示版本 | `bunx oh-my-opencode version` |
| `mcp oauth login` | MCP OAuth 登录 | `bunx oh-my-opencode mcp oauth login server --server-url URL` |
| `mcp oauth logout` | MCP OAuth 登出 | `bunx oh-my-opencode mcp oauth logout server --server-url URL` |
| `mcp oauth status` | 查询 OAuth 状态 | `bunx oh-my-opencode mcp oauth status` |

## 依赖关系

### 外部依赖
- `commander`: CLI 框架
- `@clack/prompts`: 交互式提示
- `picocolors`: 终端颜色

### 内部依赖
- `../shared`: 共享工具函数
- `../config`: 配置类型和验证
- `../hooks`: 钩子功能（自动更新检查）
- `../features`: 功能模块（MCP OAuth）
- `../tools`: 工具模块（LSP 配置）

## 使用示例

### 完整安装流程

```bash
# 交互式安装
bunx oh-my-opencode install

# 非交互式安装（CI/CD）
bunx oh-my-opencode install \
  --no-tui \
  --claude=max20 \
  --gemini=yes \
  --copilot=no \
  --opencode-zen=yes \
  --zai-coding-plan=no
```

### 运行任务

```bash
# 基本用法
bunx oh-my-opencode run "Implement user authentication"

# 指定 Agent 和超时
bunx oh-my-opencode run \
  --agent Sisyphus \
  --timeout 3600000 \
  "Large refactoring task"

# 指定工作目录
bunx oh-my-opencode run \
  --directory /path/to/project \
  "Fix bugs in this project"
```

### 诊断检查

```bash
# 完整诊断
bunx oh-my-opencode doctor

# 仅检查特定类别
bunx oh-my-opencode doctor --category authentication

# JSON 输出（脚本使用）
bunx oh-my-opencode doctor --json > doctor-report.json
```

### 版本管理

```bash
# 查看版本信息
bunx oh-my-opencode get-local-version

# JSON 格式（脚本使用）
bunx oh-my-opencode get-local-version --json

# 检查特定目录
bunx oh-my-opencode get-local-version --directory /path/to/project
```

## 注意事项

1. **Bun 依赖**: CLI 需要 Bun 运行时环境
2. **OpenCode 版本**: 需要 OpenCode >= 1.0.150
3. **配置文件**: 支持 JSON 和 JSONC 格式
4. **权限**: 某些操作可能需要文件系统写权限
5. **网络**: 版本检查和 NPM 查询需要网络连接
6. **超时**: bun install 有 60 秒超时保护
