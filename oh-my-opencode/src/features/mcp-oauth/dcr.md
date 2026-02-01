# dcr.ts

## 文件信息

- **路径**: src/features/mcp-oauth/dcr.ts
- **目录**: src/features/mcp-oauth
- **行数**: 99

## 文件功能

提供了 3 个函数/工具,用于实现特定功能。

## 函数定义

### getOrRegisterClient()

- **定义位置**: 第38行
- **参数**: `options: DynamicClientRegistrationOptions`
- **返回值**: `Promise<ClientCredentials | null>`

### parseRegistrationResponse()

- **定义位置**: 第83行
- **参数**: `data: unknown`
- **返回值**: `ClientCredentials | null`

### isRecord()

- **定义位置**: 第96行
- **参数**: `value: unknown`
- **返回值**: `value is Record<string, unknown>`

## 类型定义

- `ClientRegistrationRequest`
- `ClientCredentials`
- `ClientRegistrationStorage`
- `DynamicClientRegistrationOptions`
- `DcrFetch`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 3
- 常量数量: 0
- 类型定义数量: 5
- 导入模块数量: 0

