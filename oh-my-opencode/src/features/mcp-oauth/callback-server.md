# callback-server.ts

## 文件信息

- **路径**: src/features/mcp-oauth/callback-server.ts
- **目录**: src/features/mcp-oauth
- **行数**: 125

## 文件功能

提供了 3 个函数/工具,用于实现特定功能。

## 函数定义

### isPortAvailable()

- **定义位置**: 第36行
- **参数**: `port: number`
- **返回值**: `Promise<boolean>`

### findAvailablePort()

- **定义位置**: 第50行
- **参数**: `startPort: number = DEFAULT_PORT`
- **返回值**: `Promise<number>`

### startCallbackServer()

- **定义位置**: 第60行
- **参数**: `startPort: number = DEFAULT_PORT`
- **返回值**: `Promise<CallbackServer>`

## 常量定义

### DEFAULT_PORT

- **定义位置**: 第1行
- **值**: `19877`

### MAX_PORT_ATTEMPTS

- **定义位置**: 第2行
- **值**: `20`

### TIMEOUT_MS

- **定义位置**: 第3行
- **值**: `5 * 60 * 1000`

### SUCCESS_HTML

- **定义位置**: 第16行
- **值**: ``<!DOCTYPE html>`

## 类型定义

- `OAuthCallbackResult`
- `CallbackServer`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 3
- 常量数量: 4
- 类型定义数量: 2
- 导入模块数量: 0

