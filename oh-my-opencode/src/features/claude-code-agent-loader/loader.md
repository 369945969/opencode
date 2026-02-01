# loader.ts

## 文件信息

- **路径**: src/features/claude-code-agent-loader/loader.ts
- **目录**: src/features/claude-code-agent-loader
- **行数**: 91

## 文件功能

提供了 4 个函数/工具,用于实现特定功能。

## 函数定义

### parseToolsConfig()

- **定义位置**: 第9行
- **参数**: `toolsStr?: string`
- **返回值**: `Record<string, boolean> | undefined`

### loadAgentsFromDir()

- **定义位置**: 第22行
- **参数**: `agentsDir: string, scope: AgentScope`
- **返回值**: `LoadedAgent[]`

### loadUserAgents()

- **定义位置**: 第70行
- **返回值**: `Record<string, AgentConfig>`

### loadProjectAgents()

- **定义位置**: 第81行
- **返回值**: `Record<string, AgentConfig>`

## 依赖关系

- `fs`
- `path`
- `@opencode-ai/sdk`
- `../../shared/frontmatter`
- `../../shared/file-utils`
- `../../shared`
- `./types`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 4
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 7

