# slashcommand/index.ts

## 文件功能概述

Slashcommand 工具的入口文件，负责导出类型定义和工具实现。该模块提供了斜杠命令发现、加载和执行的功能，支持从多个来源（内置、用户配置、项目配置、OpenCode 配置）加载命令。

## 主要导出内容

### 类型定义
- `CommandScope` - 命令作用域类型
- `CommandMetadata` - 命令元数据接口
- `CommandInfo` - 命令信息接口
- `SlashcommandToolOptions` - 工具配置选项

### 函数/类
- `slashcommand` - 默认的斜杠命令工具实例
- `createSlashcommandTool` - 创建自定义配置的斜杠命令工具
- `discoverCommandsSync` - 同步发现所有可用的命令

## 代码逻辑流程

```
index.ts
├── 从 types.ts 导出类型定义
├── 从 tools.ts 导出核心函数
│   ├── discoverCommandsSync() - 发现命令
│   ├── createSlashcommandTool() - 创建工具
│   └── slashcommand (默认实例)
└── 支持的作用域：builtin | config | user | project | opencode | opencode-project
```

## 依赖关系

### 内部依赖
- `./types` - 类型定义
- `./tools` - 工具实现

### 外部依赖
- `@opencode-ai/plugin` - OpenCode 插件 API
- `fs` - 文件系统操作
- `path` - 路径处理

## 使用示例

```typescript
import { slashcommand, createSlashcommandTool, discoverCommandsSync } from './slashcommand';

// 使用默认实例
const result = await slashcommand.execute({ command: 'commit' });

// 创建自定义工具
const customTool = createSlashcommandTool({
  commands: [...], // 预加载命令
  skills: [...]    // 预加载技能
});

// 发现所有命令
const allCommands = discoverCommandsSync();
```

## 注意事项

1. **作用域优先级**：builtin < opencode < opencode-project < project < user
2. **命令发现**：会扫描多个目录查找 .md 格式的命令文件
3. **缓存机制**：createSlashcommandTool 会缓存命令列表以提高性能
4. **懒加载**：支持延迟加载命令内容
