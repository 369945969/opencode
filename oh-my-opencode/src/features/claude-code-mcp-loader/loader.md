# loader.ts

## 文件信息

- **路径**: src/features/claude-code-mcp-loader/loader.ts
- **目录**: src/features/claude-code-mcp-loader
- **行数**: 120

## 文件功能

提供了 5 个函数/工具,用于实现特定功能。

## 接口定义

### McpConfigPath

- **定义位置**: 第13行
- **属性**: path, ath, th, h, scope, cope, ope, pe, e

## 函数定义

### getMcpConfigPaths()

- **定义位置**: 第18行
- **返回值**: `McpConfigPath[]`

### loadMcpConfigFile()

- **定义位置**: 第29行
- **参数**: `filePath: string`
- **返回值**: `Promise<ClaudeCodeMcpConfig | null>`

### getSystemMcpServerNames()

- **定义位置**: 第45行
- **返回值**: `Set<string>`

### loadMcpConfigs()

- **定义位置**: 第69行
- **返回值**: `Promise<McpLoadResult>`

### formatLoadedServersForToast()

- **定义位置**: 第111行
- **参数**: `loadedServers: LoadedMcpServer[]`
- **返回值**: `string`

## 依赖关系

- `fs`
- `path`
- `../../shared`
- `./types`
- `./transformer`
- `../../shared/logger`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 5
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 6

