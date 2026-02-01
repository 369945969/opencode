# migration.ts

## 文件信息

- **路径**: src/shared/migration.ts
- **目录**: src/shared
- **行数**: 232

## 文件功能

提供了 5 个函数/工具,用于实现特定功能。

## 函数定义

### migrateAgentNames()

- **定义位置**: 第93行
- **参数**: `agents: Record<string, unknown>`

### migrateHookNames()

- **定义位置**: 第108行
- **参数**: `hooks: string[]`

### migrateAgentConfigToCategory()

- **定义位置**: 第132行
- **参数**: `config: Record<string, unknown>`

### shouldDeleteAgentConfig()

- **定义位置**: 第152行
- **参数**: `config: Record<string, unknown>,
  category: string`
- **返回值**: `boolean`

### migrateConfigFile()

- **定义位置**: 第171行
- **参数**: `configPath: string, rawConfig: Record<string, unknown>`
- **返回值**: `boolean`

## 常量定义

### BUILTIN_AGENT_NAMES

- **定义位置**: 第46行
- **值**: `new Set([`

## 依赖关系

- `./logger`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 5
- 常量数量: 1
- 类型定义数量: 0
- 导入模块数量: 1

