# discovery.ts

## 文件信息

- **路径**: src/features/mcp-oauth/discovery.ts
- **目录**: src/features/mcp-oauth
- **行数**: 124

## 文件功能

提供了 7 个函数/工具,用于实现特定功能。

## 接口定义

### OAuthServerMetadata

- **定义位置**: 第1行
- **属性**: authorizationEndpoint, uthorizationEndpoint, thorizationEndpoint, horizationEndpoint, orizationEndpoint, rizationEndpoint, izationEndpoint, zationEndpoint, ationEndpoint, tionEndpoint

## 函数定义

### parseHttpsUrl()

- **定义位置**: 第11行
- **参数**: `value: string, label: string`
- **返回值**: `URL`

### readStringField()

- **定义位置**: 第19行
- **参数**: `source: Record<string, unknown>, field: string`
- **返回值**: `string`

### fetchMetadata()

- **定义位置**: 第27行
- **参数**: `url: string`
- **返回值**: `Promise<`

### fetchAuthorizationServerMetadata()

- **定义位置**: 第39行
- **参数**: `issuer: string, resource: string`
- **返回值**: `Promise<OAuthServerMetadata>`

### parseAuthorizationServers()

- **定义位置**: 第74行
- **参数**: `metadata: Record<string, unknown>`
- **返回值**: `string[]`

### discoverOAuthServerMetadata()

- **定义位置**: 第80行
- **参数**: `resource: string`
- **返回值**: `Promise<OAuthServerMetadata>`

### resetDiscoveryCache()

- **定义位置**: 第120行

## 常量定义

### discoveryCache

- **定义位置**: 第8行
- **值**: `new Map<string, OAuthServerMetadata>()`

### pendingDiscovery

- **定义位置**: 第9行
- **值**: `new Map<string, Promise<OAuthServerMetadata>>()`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 7
- 常量数量: 2
- 类型定义数量: 0
- 导入模块数量: 0

