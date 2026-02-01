# index.ts

## 文件信息

- **路径**: src/hooks/interactive-bash-session/index.ts
- **目录**: src/hooks/interactive-bash-session
- **行数**: 268

## 文件功能

这是模块的入口文件,统一导出本模块的所有公共 API。

## 接口定义

### ToolExecuteInput

- **定义位置**: 第11行
- **属性**: tool, ool, ol, l, sessionID, essionID, ssionID, sionID, ionID, onID

### ToolExecuteOutput

- **定义位置**: 第18行
- **属性**: title, itle, tle, le, e, output, utput, tput, put, ut

### EventInput

- **定义位置**: 第24行
- **属性**: event, vent, ent, nt, t

## 函数定义

### tokenizeCommand()

- **定义位置**: 第35行
- **描述**: Quote-aware command tokenizer with escape handling Handles single/double quotes and backslash escapes /
- **参数**: `cmd: string`
- **返回值**: `string[]`

### normalizeSessionName()

- **定义位置**: 第80行
- **描述**: Normalize session name by stripping :window and .pane suffixes e.g., "omo-x:1" -> "omo-x", "omo-x:1.2" -> "omo-x" /
- **参数**: `name: string`
- **返回值**: `string`

### findFlagValue()

- **定义位置**: 第84行
- **描述**: e.g., "omo-x:1" -> "omo-x", "omo-x:1.2" -> "omo-x" /
- **参数**: `tokens: string[], flag: string`
- **返回值**: `string | null`

### extractSessionNameFromTokens()

- **定义位置**: 第96行
- **描述**: Extract session name from tokens, considering the subCommand For new-session: prioritize -s over -t For other commands: use -t /
- **参数**: `tokens: string[], subCommand: string`
- **返回值**: `string | null`

### findSubcommand()

- **定义位置**: 第117行
- **描述**: tmux allows global options before the subcommand: e.g., `tmux -L socket-name new-session -s omo-x` Global options with args: -L, -S, -f, -c, -T Standalone flags: -C, -v, -V, etc. Special: -- (end of options marker) /
- **参数**: `tokens: string[]`
- **返回值**: `string`

### createInteractiveBashSessionHook()

- **定义位置**: 第150行
- **参数**: `ctx: PluginInput`

## 依赖关系

- `@opencode-ai/plugin`
- `./storage`
- `./constants`
- `./types`
- `../../features/claude-code-session-state`

## 代码统计

- 接口数量: 3
- 类数量: 0
- 函数数量: 6
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 5

