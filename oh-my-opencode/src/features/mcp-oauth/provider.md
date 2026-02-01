# provider.ts

## 文件信息

- **路径**: src/features/mcp-oauth/provider.ts
- **目录**: src/features/mcp-oauth
- **行数**: 296

## 文件功能

定义了 1 个类,提供相关的功能实现。

## 类定义

### McpOAuthProvider

- **定义位置**: 第133行
- **方法**: onstructor, nstructor, structor, tructor, ructor, uctor, ctor, tor, or, r

## 函数定义

### generateCodeVerifier()

- **定义位置**: 第23行
- **返回值**: `string`

### generateCodeChallenge()

- **定义位置**: 第27行
- **参数**: `verifier: string`
- **返回值**: `string`

### buildAuthorizationUrl()

- **定义位置**: 第31行
- **参数**: `authorizationEndpoint: string,
  options: {
    clientId: string
    redirectUri: string
    codeChallenge: string
    state: string
    scopes?: string[]
    resource?: string
  }`
- **返回值**: `string`

### startCallbackServer()

- **定义位置**: 第60行
- **参数**: `port: number`
- **返回值**: `Promise<CallbackResult>`

### openBrowser()

- **定义位置**: 第108行
- **参数**: `url: string`

## 常量定义

### CALLBACK_TIMEOUT_MS

- **定义位置**: 第58行
- **值**: `5 * 60 * 1000`

## 类型定义

- `McpOAuthProviderOptions`
- `CallbackResult`

## 依赖关系

- `node:crypto`
- `node:http`
- `node:child_process`
- `./storage`
- `./discovery`
- `./dcr`
- `./callback-server`

## 代码统计

- 接口数量: 0
- 类数量: 1
- 函数数量: 5
- 常量数量: 1
- 类型定义数量: 2
- 导入模块数量: 7

