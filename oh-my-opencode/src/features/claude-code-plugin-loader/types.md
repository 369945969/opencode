# types.ts

## 文件信息

- **路径**: src/features/claude-code-plugin-loader/types.ts
- **目录**: src/features/claude-code-plugin-loader
- **行数**: 211

## 文件功能

TypeScript 模块文件,包含类型定义和常量导出。

## 接口定义

### PluginInstallation

- **定义位置**: 第13行
- **描述**: Plugin installation entry in installed_plugins.json /
- **属性**: scope, cope, ope, pe, e, installPath, nstallPath, stallPath, tallPath, allPath

### InstalledPluginsDatabaseV1

- **定义位置**: 第27行
- **描述**: Installed plugins database v1 (legacy) plugins stored as direct objects /
- **属性**: version, ersion, rsion, sion, ion, on, n, plugins, lugins, ugins

### InstalledPluginsDatabaseV2

- **定义位置**: 第36行
- **描述**: Installed plugins database v2 (current) plugins stored as arrays /
- **属性**: version, ersion, rsion, sion, ion, on, n, plugins, lugins, ugins

### PluginAuthor

- **定义位置**: 第50行
- **描述**: Plugin author information /
- **属性**: name, ame, me, e, email, mail, ail, il, l, url

### PluginManifest

- **定义位置**: 第60行
- **描述**: Plugin manifest (plugin.json) Located at <plugin_root>/.claude-plugin/plugin.json /
- **属性**: name, ame, me, e, version, ersion, rsion, sion, ion, on

### HookEntry

- **定义位置**: 第83行
- **描述**: Hooks configuration /
- **属性**: type, ype, pe, e, command, ommand, mmand, mand, and, nd

### HookMatcher

- **定义位置**: 第90行
- **属性**: matcher, atcher, tcher, cher, her, er, r, hooks, ooks, oks

### HooksConfig

- **定义位置**: 第95行
- **属性**: hooks, ooks, oks, ks, s

### PluginMcpServer

- **定义位置**: 第115行
- **描述**: MCP servers configuration in plugin /
- **属性**: command, ommand, mmand, mand, and, nd, d, args, rgs, gs

### McpServersConfig

- **定义位置**: 第125行
- **属性**: mcpServers, cpServers, pServers, Servers, ervers, rvers, vers, ers, rs, s

### LspServerConfig

- **定义位置**: 第132行
- **描述**: LSP server configuration /
- **属性**: command, ommand, mmand, mand, and, nd, d, args, rgs, gs

### LspServersConfig

- **定义位置**: 第151行
- **属性**: language, anguage, nguage, guage, uage, age, ge, e

### LoadedPlugin

- **定义位置**: 第158行
- **描述**: Loaded plugin with all resolved components /
- **属性**: name, ame, me, e, version, ersion, rsion, sion, ion, on

### PluginLoadResult

- **定义位置**: 第178行
- **描述**: Plugin load result with all components /
- **属性**: plugins, lugins, ugins, gins, ins, ns, s, errors, rrors, rors

### PluginLoadError

- **定义位置**: 第183行
- **描述**: /
- **属性**: pluginKey, luginKey, uginKey, ginKey, inKey, nKey, Key, ey, y, installPath

### ClaudeSettings

- **定义位置**: 第192行
- **描述**: Claude settings from ~/.claude/settings.json /
- **属性**: enabledPlugins, nabledPlugins, abledPlugins, bledPlugins, ledPlugins, edPlugins, dPlugins, Plugins, lugins, ugins

### PluginLoaderOptions

- **定义位置**: 第201行
- **描述**: Plugin loader options /
- **属性**: format, ormat, rmat, mat, at, t, Value, alue, lue, ue

## 类型定义

- `PluginScope`
- `InstalledPluginsDatabase`

## 代码统计

- 接口数量: 17
- 类数量: 0
- 函数数量: 0
- 常量数量: 0
- 类型定义数量: 2
- 导入模块数量: 0

