# loader.ts

## 文件信息

- **路径**: src/features/claude-code-plugin-loader/loader.ts
- **目录**: src/features/claude-code-plugin-loader
- **行数**: 487

## 文件功能

提供了 18 个函数/工具,用于实现特定功能。

## 接口定义

### PluginComponentsResult

- **定义位置**: 第454行
- **属性**: commands, ommands, mmands, mands, ands, nds, ds, s, skills, kills

## 函数定义

### getPluginsBaseDir()

- **定义位置**: 第30行
- **返回值**: `string`

### getInstalledPluginsPath()

- **定义位置**: 第38行
- **返回值**: `string`

### resolvePluginPath()

- **定义位置**: 第42行
- **参数**: `path: string, pluginRoot: string`
- **返回值**: `string`

### loadInstalledPlugins()

- **定义位置**: 第64行
- **返回值**: `InstalledPluginsDatabase | null`

### getClaudeSettingsPath()

- **定义位置**: 第79行
- **返回值**: `string`

### loadClaudeSettings()

- **定义位置**: 第86行
- **返回值**: `ClaudeSettings | null`

### loadPluginManifest()

- **定义位置**: 第101行
- **参数**: `installPath: string`
- **返回值**: `PluginManifest | null`

### derivePluginNameFromKey()

- **定义位置**: 第116行
- **参数**: `pluginKey: string`
- **返回值**: `string`

### isPluginEnabled()

- **定义位置**: 第124行
- **参数**: `pluginKey: string,
  settingsEnabledPlugins: Record<string, boolean> | undefined,
  overrideEnabledPlugins: Record<string, boolean> | undefined`
- **返回值**: `boolean`

### extractPluginEntries()

- **定义位置**: 第138行
- **参数**: `db: InstalledPluginsDatabase`
- **返回值**: `Array<[string, PluginInstallation | undefined]>`

### discoverInstalledPlugins()

- **定义位置**: 第147行
- **参数**: `options?: PluginLoaderOptions`
- **返回值**: `PluginLoadResult`

### loadPluginCommands()

- **定义位置**: 第218行
- **参数**: `plugins: LoadedPlugin[]`
- **返回值**: `Record<string, CommandDefinition>`

### loadPluginSkillsAsCommands()

- **定义位置**: 第271行
- **参数**: `plugins: LoadedPlugin[]`
- **返回值**: `Record<string, CommandDefinition>`

### parseToolsConfig()

- **定义位置**: 第330行
- **参数**: `toolsStr?: string`
- **返回值**: `Record<string, boolean> | undefined`

### loadPluginAgents()

- **定义位置**: 第343行
- **参数**: `plugins: LoadedPlugin[]`
- **返回值**: `Record<string, AgentConfig>`

### loadPluginMcpServers()

- **定义位置**: 第390行
- **参数**: `plugins: LoadedPlugin[]`
- **返回值**: `Promise<Record<string, McpServerConfig>>`

### loadPluginHooksConfigs()

- **定义位置**: 第430行
- **参数**: `plugins: LoadedPlugin[]`
- **返回值**: `HooksConfig[]`

### loadAllPluginComponents()

- **定义位置**: 第464行
- **参数**: `options?: PluginLoaderOptions`
- **返回值**: `Promise<PluginComponentsResult>`

## 常量定义

### CLAUDE_PLUGIN_ROOT_VAR

- **定义位置**: 第28行
- **值**: `"${CLAUDE_PLUGIN_ROOT}"`

## 依赖关系

- `fs`
- `os`
- `path`
- `@opencode-ai/sdk`
- `../../shared/frontmatter`
- `../../shared/model-sanitizer`
- `../../shared/file-utils`
- `../../shared/logger`
- `../claude-code-mcp-loader/env-expander`
- `../claude-code-mcp-loader/transformer`
- `../claude-code-command-loader/types`
- `../opencode-skill-loader/types`
- `../claude-code-agent-loader/types`
- `../claude-code-mcp-loader/types`
- `./types`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 18
- 常量数量: 1
- 类型定义数量: 0
- 导入模块数量: 15

