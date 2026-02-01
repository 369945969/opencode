# slashcommand/tools.ts

## 文件功能概述

Slashcommand 工具的核心实现文件，提供命令发现、加载、格式化和执行功能。支持从多个来源（内置、用户配置、项目配置、OpenCode 配置）发现和管理斜杠命令。

## 主要函数/类

### discoverCommandsFromDir(dir, scope)
从指定目录发现命令
- **参数**：
  - `dir: string` - 命令目录路径
  - `scope: CommandScope` - 命令作用域
- **返回**：`CommandInfo[]` - 发现的命令列表
- **逻辑**：
  1. 检查目录是否存在
  2. 遍历目录中的 Markdown 文件
  3. 解析 frontmatter 获取元数据
  4. 返回命令信息数组

### discoverCommandsSync()
同步发现所有来源的命令
- **返回**：`CommandInfo[]` - 所有命令（按优先级排序）
- **搜索路径**：
  1. `~/.claude/commands/` - 用户命令
  2. `~/.config/opencode/command/` - OpenCode 全局命令
  3. `./.claude/commands/` - 项目命令
  4. `./.opencode/command/` - OpenCode 项目命令
  5. 内置命令

### skillToCommandInfo(skill)
将技能转换为命令信息格式
- **参数**：`skill: LoadedSkill` - 加载的技能
- **返回**：`CommandInfo` - 命令信息

### formatLoadedCommand(cmd)
格式化单个命令为可读文本
- **输出格式**：
  ```markdown
  # /command-name Command
  **Description**: ...
  **Usage**: /command-name [args]
  **Model**: ...
  **Agent**: ...
  **Scope**: ...
  ---
  ## Command Instructions
  [解析后的内容]
  ```

### formatCommandList(items)
格式化命令列表为表格形式

### buildDescriptionFromItems(items)
构建工具描述字符串，包含可用技能列表

### createSlashcommandTool(options)
创建斜杠命令工具实例
- **参数**：`SlashcommandToolOptions`
- **返回**：`ToolDefinition` - 工具定义
- **功能**：
  - 缓存命令和技能
  - 支持精确匹配和模糊匹配
  - 动态构建工具描述

## 代码逻辑流程

```
discoverCommandsSync()
├── discoverCommandsFromDir(userDir, "user")
├── discoverCommandsFromDir(opencodeGlobalDir, "opencode")
├── discoverCommandsFromDir(projectDir, "project")
├── discoverCommandsFromDir(opencodeProjectDir, "opencode-project")
├── loadBuiltinCommands() - 加载内置命令
└── 合并并按优先级排序

createSlashcommandTool()
├── 初始化缓存
├── 构建描述字符串
└── 返回 ToolDefinition
    ├── execute(args)
    │   ├── 获取所有项目（命令+技能）
    │   ├── 精确匹配命令名
    │   ├── 模糊匹配（如无精确匹配）
    │   └── 返回格式化结果或错误
    └── get description() - 动态描述
```

## 依赖关系

### 内部依赖
- `./types` - 类型定义
- `../../shared` - 共享工具函数
- `../../features/claude-code-command-loader/types` - 命令 frontmatter 类型
- `../../features/opencode-skill-loader` - 技能加载
- `../../features/builtin-commands` - 内置命令

### 外部依赖
- `@opencode-ai/plugin` - OpenCode 插件 API
- `fs` - 文件系统
- `path` - 路径处理

## 使用示例

```typescript
// 发现所有命令
const commands = discoverCommandsSync();
console.log(`Found ${commands.length} commands`);

// 创建自定义工具
const tool = createSlashcommandTool({
  commands: [{
    name: 'custom',
    metadata: { name: 'custom', description: 'Custom command' },
    scope: 'builtin',
    content: '# Custom Command\nDo something...'
  }]
});

// 执行命令
const result = await tool.execute({ command: 'commit' });
```

## 注意事项

1. **命令格式**：命令必须是 Markdown 文件，包含 YAML frontmatter
2. **Frontmatter 字段**：
   - `description`: 命令描述
   - `argument-hint`: 参数提示
   - `model`: 指定模型
   - `agent`: 指定代理
   - `subtask`: 是否作为子任务
3. **优先级**：builtin < opencode < project < opencode-project < user
4. **性能**：使用缓存避免重复发现命令
5. **错误处理**：解析失败的命令会被静默跳过

