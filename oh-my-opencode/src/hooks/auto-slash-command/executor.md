# executor.ts

## 文件信息

- **路径**: src/hooks/auto-slash-command/executor.ts
- **目录**: src/hooks/auto-slash-command
- **行数**: 207

## 文件功能

提供了 6 个函数/工具,用于实现特定功能。

## 接口定义

### CommandScope

- **定义位置**: 第16行
- **属性**: type, ype, pe, e

### CommandMetadata

- **定义位置**: 第20行
- **属性**: name, ame, me, e, description, escription, scription, cription, ription, iption

### CommandInfo

- **定义位置**: 第29行
- **属性**: name, ame, me, e, path, ath, th, h, metadata, etadata

### ExecutorOptions

- **定义位置**: 第99行
- **属性**: skills, kills, ills, lls, ls, s

### ExecuteResult

- **定义位置**: 第178行
- **属性**: success, uccess, ccess, cess, ess, ss, s, replacementText, eplacementText, placementText

## 函数定义

### discoverCommandsFromDir()

- **定义位置**: 第38行
- **参数**: `commandsDir: string, scope: CommandScope["type"]`
- **返回值**: `CommandInfo[]`

### skillToCommandInfo()

- **定义位置**: 第81行
- **参数**: `skill: LoadedSkill`
- **返回值**: `CommandInfo`

### discoverAllCommands()

- **定义位置**: 第103行
- **参数**: `options?: ExecutorOptions`
- **返回值**: `Promise<CommandInfo[]>`

### findCommand()

- **定义位置**: 第127行
- **参数**: `commandName: string, options?: ExecutorOptions`
- **返回值**: `Promise<CommandInfo | null>`

### formatCommandTemplate()

- **定义位置**: 第134行
- **参数**: `cmd: CommandInfo, args: string`
- **返回值**: `Promise<string>`

### executeSlashCommand()

- **定义位置**: 第184行
- **参数**: `parsed: ParsedSlashCommand, options?: ExecutorOptions`
- **返回值**: `Promise<ExecuteResult>`

## 依赖关系

- `fs`
- `path`
- `../../shared`
- `../../features/claude-code-command-loader/types`
- `../../shared/file-utils`
- `../../features/opencode-skill-loader`
- `./types`

## 代码统计

- 接口数量: 5
- 类数量: 0
- 函数数量: 6
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 7

