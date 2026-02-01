# command-executor.ts

## 文件信息

- **路径**: src/shared/command-executor.ts
- **目录**: src/shared
- **行数**: 226

## 文件功能

提供了 8 个函数/工具,用于实现特定功能。

## 接口定义

### CommandResult

- **定义位置**: 第36行
- **属性**: exitCode, xitCode, itCode, tCode, Code, ode, de, e, stdout, tdout

### ExecuteHookOptions

- **定义位置**: 第42行
- **属性**: forceZsh, orceZsh, rceZsh, ceZsh, eZsh, Zsh, sh, h, zshPath, shPath

### CommandMatch

- **定义位置**: 第154行
- **描述**: Find and execute embedded commands in text (!`command`) /
- **属性**: fullMatch, ullMatch, llMatch, lMatch, Match, atch, tch, ch, h, command

## 函数定义

### getHomeDir()

- **定义位置**: 第10行
- **返回值**: `string`

### findShellPath()

- **定义位置**: 第14行
- **参数**: `defaultPaths: string[], customPath?: string`
- **返回值**: `string | null`

### findZshPath()

- **定义位置**: 第26行
- **参数**: `customZshPath?: string`
- **返回值**: `string | null`

### findBashPath()

- **定义位置**: 第30行
- **返回值**: `string | null`

### executeHookCommand()

- **定义位置**: 第50行
- **描述**: Execute a hook command with stdin input /
- **参数**: `command: string,
  stdin: string,
  cwd: string,
  options?: ExecuteHookOptions`
- **返回值**: `Promise<CommandResult>`

### executeCommand()

- **定义位置**: 第123行
- **描述**: Execute a simple command and return output /
- **参数**: `command: string`
- **返回值**: `Promise<string>`

### findCommands()

- **定义位置**: 第163行
- **参数**: `text: string`
- **返回值**: `CommandMatch[]`

### resolveCommandsInText()

- **定义位置**: 第184行
- **描述**: Resolve embedded commands in text recursively /
- **参数**: `text: string,
  depth: number = 0,
  maxDepth: number = 3`
- **返回值**: `Promise<string>`

## 常量定义

### DEFAULT_ZSH_PATHS

- **定义位置**: 第7行
- **值**: `["/bin/zsh", "/usr/bin/zsh", "/usr/local/bin/zsh"]`

### DEFAULT_BASH_PATHS

- **定义位置**: 第8行
- **值**: `["/bin/bash", "/usr/bin/bash", "/usr/local/bin/bash"]`

### execAsync

- **定义位置**: 第34行
- **值**: `promisify(exec)`

### COMMAND_PATTERN

- **定义位置**: 第161行
- **值**: `/!`([^`]+)`/g`

## 依赖关系

- `child_process`
- `util`
- `fs`
- `os`

## 代码统计

- 接口数量: 3
- 类数量: 0
- 函数数量: 8
- 常量数量: 4
- 类型定义数量: 0
- 导入模块数量: 4

