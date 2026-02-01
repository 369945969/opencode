# storage.ts

## 文件信息

- **路径**: src/features/mcp-oauth/storage.ts
- **目录**: src/features/mcp-oauth
- **行数**: 154

## 文件功能

提供了 11 个函数/工具,用于实现特定功能。

## 接口定义

### OAuthTokenData

- **定义位置**: 第5行
- **属性**: accessToken, ccessToken, cessToken, essToken, ssToken, sToken, Token, oken, ken, en

## 函数定义

### getMcpOauthStoragePath()

- **定义位置**: 第19行
- **返回值**: `string`

### normalizeHost()

- **定义位置**: 第23行
- **参数**: `serverHost: string`
- **返回值**: `string`

### normalizeResource()

- **定义位置**: 第52行
- **参数**: `resource: string`
- **返回值**: `string`

### buildKey()

- **定义位置**: 第56行
- **参数**: `serverHost: string, resource: string`
- **返回值**: `string`

### readStore()

- **定义位置**: 第62行
- **返回值**: `TokenStore | null`

### writeStore()

- **定义位置**: 第76行
- **参数**: `store: TokenStore`
- **返回值**: `boolean`

### loadToken()

- **定义位置**: 第93行
- **参数**: `serverHost: string, resource: string`
- **返回值**: `OAuthTokenData | null`

### saveToken()

- **定义位置**: 第101行
- **参数**: `serverHost: string, resource: string, token: OAuthTokenData`
- **返回值**: `boolean`

### deleteToken()

- **定义位置**: 第108行
- **参数**: `serverHost: string, resource: string`
- **返回值**: `boolean`

### listTokensByHost()

- **定义位置**: 第134行
- **参数**: `serverHost: string`
- **返回值**: `TokenStore`

### listAllTokens()

- **定义位置**: 第151行
- **返回值**: `TokenStore`

## 常量定义

### STORAGE_FILE_NAME

- **定义位置**: 第17行
- **值**: `"mcp-oauth.json"`

## 类型定义

- `TokenStore`

## 依赖关系

- `node:fs`
- `node:path`
- `../../shared`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 11
- 常量数量: 1
- 类型定义数量: 1
- 导入模块数量: 3

