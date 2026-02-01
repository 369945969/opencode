# slashcommand/types.ts

## 文件功能概述

Slashcommand 工具的类型定义文件，定义了命令作用域、元数据、信息结构以及工具配置选项等核心类型。

## 主要类型定义

### CommandScope
命令作用域类型，定义命令的来源和优先级。

```typescript
type CommandScope = "builtin" | "config" | "user" | "project" | "opencode" | "opencode-project";
```

**作用域说明**：
- `builtin` - 内置命令，随插件提供
- `config` - 配置文件中的命令
- `user` - 用户级命令（~/.claude/commands/）
- `project` - 项目级命令（./.claude/commands/）
- `opencode` - OpenCode 全局命令（~/.config/opencode/command/）
- `opencode-project` - OpenCode 项目命令（./.opencode/command/）

### CommandMetadata
命令元数据接口，描述命令的基本信息。

```typescript
interface CommandMetadata {
  name: string;           // 命令名称
  description: string;    // 命令描述
  argumentHint?: string;  // 参数提示（可选）
  model?: string;         // 指定模型（可选）
  agent?: string;         // 指定代理（可选）
  subtask?: boolean;      // 是否作为子任务（可选）
}
```

### CommandInfo
命令信息接口，包含完整的命令数据。

```typescript
interface CommandInfo {
  name: string;                    // 命令名称
  path?: string;                   // 文件路径（可选）
  metadata: CommandMetadata;       // 元数据
  content?: string;                // 命令内容（可选）
  scope: CommandScope;             // 作用域
  lazyContentLoader?: LazyContentLoader; // 延迟加载器（可选）
}
```

### SlashcommandToolOptions
斜杠命令工具配置选项。

```typescript
interface SlashcommandToolOptions {
  commands?: CommandInfo[];    // 预加载的命令（跳过发现）
  skills?: LoadedSkill[];      // 预加载的技能（跳过发现）
}
```

## 依赖关系

### 内部依赖
- `../../features/opencode-skill-loader` - 技能加载器类型

### 类型关系图

```
CommandInfo
├── name: string
├── path?: string
├── metadata: CommandMetadata
│   ├── name: string
│   ├── description: string
│   ├── argumentHint?: string
│   ├── model?: string
│   ├── agent?: string
│   └── subtask?: boolean
├── content?: string
├── scope: CommandScope
└── lazyContentLoader?: LazyContentLoader

SlashcommandToolOptions
├── commands?: CommandInfo[]
└── skills?: LoadedSkill[]
```

## 使用示例

```typescript
import type { CommandInfo, CommandMetadata, CommandScope, SlashcommandToolOptions } from './types';

// 定义命令元数据
const metadata: CommandMetadata = {
  name: 'commit',
  description: 'Generate a commit message',
  argumentHint: '[type]',
  model: 'anthropic/claude-sonnet-4-5',
  subtask: true
};

// 定义命令信息
const command: CommandInfo = {
  name: 'commit',
  path: '/path/to/commit.md',
  metadata,
  scope: 'project',
  content: '# Commit Command\nGenerate commit message...'
};

// 配置工具选项
const options: SlashcommandToolOptions = {
  commands: [command],
  skills: []
};
```

## 注意事项

1. **作用域优先级**：builtin < config < opencode < project < user < opencode-project
2. **延迟加载**：大型命令内容应使用 `lazyContentLoader` 避免内存占用
3. **模型字段**：支持 OpenCode 模型格式（provider/model）
4. **子任务标记**：`subtask: true` 表示命令应在子会话中执行
5. **路径可选**：内置命令可能不需要文件路径

