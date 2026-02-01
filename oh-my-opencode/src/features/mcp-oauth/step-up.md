# step-up.ts

## 文件信息

- **路径**: src/features/mcp-oauth/step-up.ts
- **目录**: src/features/mcp-oauth
- **行数**: 80

## 文件功能

提供了 4 个函数/工具,用于实现特定功能。

## 接口定义

### StepUpInfo

- **定义位置**: 第1行
- **属性**: requiredScopes, equiredScopes, quiredScopes, uiredScopes, iredScopes, redScopes, edScopes, dScopes, Scopes, copes

## 函数定义

### parseWwwAuthenticate()

- **定义位置**: 第7行
- **参数**: `header: string`
- **返回值**: `StepUpInfo | null`

### extractParam()

- **定义位置**: 第48行
- **参数**: `params: string, name: string`
- **返回值**: `string | null`

### mergeScopes()

- **定义位置**: 第60行
- **参数**: `existing: string[], required: string[]`
- **返回值**: `string[]`

### isStepUpRequired()

- **定义位置**: 第68行
- **参数**: `statusCode: number, headers: Record<string, string>`
- **返回值**: `StepUpInfo | null`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 4
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 0

