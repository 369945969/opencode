# loader.ts

## 文件信息

- **路径**: src/features/claude-code-command-loader/loader.ts
- **目录**: src/features/claude-code-command-loader
- **行数**: 145

## 文件功能

提供了 7 个函数/工具,用于实现特定功能。

## 函数定义

### loadCommandsFromDir()

- **定义位置**: 第10行
- **参数**: `commandsDir: string,
  scope: CommandScope,
  visited: Set<string> = new Set(`

### commandsToRecord()

- **定义位置**: 第102行
- **参数**: `commands: LoadedCommand[]`
- **返回值**: `Record<string, CommandDefinition>`

### loadUserCommands()

- **定义位置**: 第111行
- **返回值**: `Promise<Record<string, CommandDefinition>>`

### loadProjectCommands()

- **定义位置**: 第117行
- **返回值**: `Promise<Record<string, CommandDefinition>>`

### loadOpencodeGlobalCommands()

- **定义位置**: 第123行
- **返回值**: `Promise<Record<string, CommandDefinition>>`

### loadOpencodeProjectCommands()

- **定义位置**: 第130行
- **返回值**: `Promise<Record<string, CommandDefinition>>`

### loadAllCommands()

- **定义位置**: 第136行
- **返回值**: `Promise<Record<string, CommandDefinition>>`

## 依赖关系

- `fs`
- `path`
- `../../shared/frontmatter`
- `../../shared/model-sanitizer`
- `../../shared/file-utils`
- `../../shared`
- `../../shared/logger`
- `./types`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 7
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 8

