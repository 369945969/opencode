# mcp.ts

## 文件信息

- **路径**: src/cli/doctor/checks/mcp.ts
- **目录**: src/cli/doctor/checks
- **行数**: 129

## 文件功能

提供了 6 个函数/工具,用于实现特定功能。

## 接口定义

### McpConfig

- **定义位置**: 第16行
- **属性**: mcpServers, cpServers, pServers, Servers, ervers, rvers, vers, ers, rs, s

## 函数定义

### loadUserMcpConfig()

- **定义位置**: 第20行
- **返回值**: `Record<string, unknown>`

### getBuiltinMcpInfo()

- **定义位置**: 第40行
- **返回值**: `McpServerInfo[]`

### getUserMcpInfo()

- **定义位置**: 第49行
- **返回值**: `McpServerInfo[]`

### checkBuiltinMcpServers()

- **定义位置**: 第67行
- **返回值**: `Promise<CheckResult>`

### checkUserMcpServers()

- **定义位置**: 第78行
- **返回值**: `Promise<CheckResult>`

### getMcpCheckDefinitions()

- **定义位置**: 第111行
- **返回值**: `CheckDefinition[]`

## 常量定义

### BUILTIN_MCP_SERVERS

- **定义位置**: 第8行
- **值**: `["context7", "grep_app"]`

### MCP_CONFIG_PATHS

- **定义位置**: 第10行
- **值**: `[`

## 依赖关系

- `node:fs`
- `node:os`
- `node:path`
- `../types`
- `../constants`
- `../../../shared`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 6
- 常量数量: 2
- 类型定义数量: 0
- 导入模块数量: 6

