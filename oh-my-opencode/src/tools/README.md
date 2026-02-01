# Tools 目录

## 目录概述

本目录包含 oh-my-opencode 插件的所有工具实现，提供代码搜索、文件查找、会话管理、LSP 集成、AST 分析等核心功能。每个工具都是一个独立的模块，通过 OpenCode 插件 API 注册为可用工具。

## 工具分类

### 1. 代码搜索工具

#### grep
- **路径**: `grep/`
- **功能**: 基于正则表达式的文件内容搜索
- **后端**: ripgrep (rg) / grep
- **特点**: 支持正则表达式、文件过滤、上下文显示
- **限制**: 60秒超时，10MB输出限制

#### glob
- **路径**: `glob/`
- **功能**: 基于 glob 模式的文件查找
- **后端**: ripgrep / find / PowerShell
- **特点**: 自动安装 ripgrep，按修改时间排序
- **限制**: 60秒超时，最多100个文件

#### ast-grep
- **路径**: `ast-grep/`
- **功能**: 基于 AST 的代码模式匹配和替换
- **后端**: ast-grep CLI
- **特点**: 支持25种语言，元变量匹配，代码重写
- **限制**: 5分钟超时，500个匹配限制

### 2. 代码分析工具

#### lsp
- **路径**: `lsp/`
- **功能**: Language Server Protocol 集成
- **工具**: 
  - `lsp_goto_definition` - 跳转到定义
  - `lsp_find_references` - 查找引用
  - `lsp_symbols` - 获取符号列表
  - `lsp_diagnostics` - 获取诊断信息
  - `lsp_prepare_rename` - 准备重命名
  - `lsp_rename` - 重命名符号
- **特点**: 支持多种语言服务器配置

### 3. 会话管理工具

#### session-manager
- **路径**: `session-manager/`
- **功能**: OpenCode 会话历史管理
- **工具**:
  - `session_list` - 列出会话
  - `session_read` - 读取会话消息
  - `session_search` - 搜索会话内容
  - `session_info` - 获取会话信息
- **特点**: 支持日期过滤、全文搜索、待办事项查看

### 4. 任务委托工具

#### delegate-task
- **路径**: `delegate-task/`
- **功能**: 基于类别的任务委托
- **特点**: 
  - 支持7个预定义类别（visual-engineering, ultrabrain, artistry, quick, unspecified-low, unspecified-high, writing）
  - 自动选择模型
  - 支持同步/异步执行
  - 技能注入

#### call-omo-agent
- **路径**: `call-omo-agent/`
- **功能**: 调用特定代理（explore, librarian）
- **特点**: 支持后台执行，会话继承

#### background-task
- **路径**: `background-task/`
- **功能**: 后台任务管理
- **工具**:
  - `background_task` - 启动后台任务
  - `background_output` - 获取任务输出
  - `background_cancel` - 取消任务

### 5. 技能和命令工具

#### skill
- **路径**: `skill/`
- **功能**: 技能加载和执行
- **特点**: 支持 MCP 集成，Git Master 配置注入

#### skill-mcp
- **路径**: `skill-mcp/`
- **功能**: 调用技能嵌入的 MCP 服务器
- **操作**: tool, resource, prompt

#### slashcommand
- **路径**: `slashcommand/`
- **功能**: 斜杠命令发现和执行
- **来源**: builtin, user, project, opencode, opencode-project

### 6. 其他工具

#### look-at
- **路径**: `look-at/`
- **功能**: 多媒体文件分析（PDF、图片、视频）
- **后端**: multimodal-looker 代理

#### interactive-bash
- **路径**: `interactive-bash/`
- **功能**: tmux 交互式终端操作
- **用途**: TUI 应用交互（vim, htop 等）

## 模块列表

| 模块 | 文件数 | 主要功能 | 复杂度 |
|------|--------|----------|--------|
| ast-grep | 7 | AST 代码分析 | 高 |
| background-task | 4 | 后台任务管理 | 中 |
| call-omo-agent | 4 | 代理调用 | 中 |
| delegate-task | 5 | 任务委托 | 高 |
| glob | 6 | 文件查找 | 低 |
| grep | 7 | 内容搜索 | 中 |
| interactive-bash | 4 | 终端交互 | 低 |
| look-at | 4 | 多媒体分析 | 中 |
| lsp | 7 | LSP 集成 | 高 |
| session-manager | 7 | 会话管理 | 中 |
| skill | 5 | 技能管理 | 中 |
| skill-mcp | 4 | MCP 调用 | 中 |
| slashcommand | 4 | 命令管理 | 中 |

## 工具总览

### 内置工具（builtinTools）

```typescript
{
  lsp_goto_definition,      // LSP: 跳转到定义
  lsp_find_references,      // LSP: 查找引用
  lsp_symbols,              // LSP: 获取符号
  lsp_diagnostics,          // LSP: 诊断信息
  lsp_prepare_rename,       // LSP: 准备重命名
  lsp_rename,               // LSP: 重命名
  ast_grep_search,          // AST: 代码搜索
  ast_grep_replace,         // AST: 代码替换
  grep,                     // 文本搜索
  glob,                     // 文件查找
  session_list,             // 会话: 列表
  session_read,             // 会话: 读取
  session_search,           // 会话: 搜索
  session_info,             // 会话: 信息
}
```

### 动态创建工具

- `createSlashcommandTool` - 斜杠命令工具
- `createSkillTool` - 技能工具
- `createSkillMcpTool` - MCP 工具
- `createCallOmoAgent` - 代理调用工具
- `createDelegateTask` - 任务委托工具
- `createBackgroundOutput` - 后台输出工具
- `createBackgroundCancel` - 后台取消工具
- `createLookAt` - 多媒体分析工具

## 依赖关系

### 外部依赖
- `@opencode-ai/plugin` - OpenCode 插件 API
- `@modelcontextprotocol/sdk` - MCP SDK
- `vscode-jsonrpc` - LSP 通信

### 内部依赖
- `../shared` - 共享工具函数
- `../features/*` - 功能模块
- `../config` - 配置管理

## 使用示例

```typescript
import { 
  grep, 
  glob, 
  session_list,
  createDelegateTask,
  createSkillTool 
} from './tools';

// 使用内置工具
const matches = await grep.execute({ pattern: 'console\.log', include: '*.ts' });
const files = await glob.execute({ pattern: '**/*.md' });

// 创建自定义工具
const skillTool = createSkillTool({ skills: loadedSkills });
const delegateTool = createDelegateTask({ manager, client, directory });
```

## 注意事项

1. **性能限制**：大多数工具有超时和输出限制
2. **错误处理**：工具内部处理错误，返回错误信息而非抛出异常
3. **平台兼容**：支持 macOS、Linux、Windows
4. **自动安装**：ripgrep、ast-grep 等工具可自动下载安装
5. **缓存机制**：LSP 客户端、命令列表等有缓存优化
6. **并发安全**：后台任务管理支持并发执行

## 文档索引

- [ast-grep](./ast-grep/README.md) - AST 代码分析
- [background-task](./background-task/README.md) - 后台任务管理
- [call-omo-agent](./call-omo-agent/README.md) - 代理调用
- [delegate-task](./delegate-task/README.md) - 任务委托
- [glob](./glob/README.md) - 文件查找
- [grep](./grep/README.md) - 内容搜索
- [interactive-bash](./interactive-bash/README.md) - 终端交互
- [look-at](./look-at/README.md) - 多媒体分析
- [lsp](./lsp/README.md) - LSP 集成
- [session-manager](./session-manager/README.md) - 会话管理
- [skill](./skill/README.md) - 技能管理
- [skill-mcp](./skill-mcp/README.md) - MCP 调用
- [slashcommand](./slashcommand/README.md) - 命令管理

