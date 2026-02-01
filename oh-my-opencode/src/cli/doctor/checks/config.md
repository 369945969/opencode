# config.ts

## 文件信息

- **路径**: src/cli/doctor/checks/config.ts
- **目录**: src/cli/doctor/checks
- **行数**: 123

## 文件功能

提供了 5 个函数/工具,用于实现特定功能。

## 函数定义

### findConfigPath()

- **定义位置**: 第12行

### validateConfig()

- **定义位置**: 第26行
- **参数**: `configPath: string`

### getConfigInfo()

- **定义位置**: 第48行
- **返回值**: `ConfigInfo`

### checkConfigValidity()

- **定义位置**: 第82行
- **返回值**: `Promise<CheckResult>`

### getConfigCheckDefinition()

- **定义位置**: 第114行
- **返回值**: `CheckDefinition`

## 常量定义

### USER_CONFIG_DIR

- **定义位置**: 第8行
- **值**: `getOpenCodeConfigDir({ binary: "opencode" })`

### USER_CONFIG_BASE

- **定义位置**: 第9行
- **值**: `join(USER_CONFIG_DIR, `${PACKAGE_NAME}`)`

### PROJECT_CONFIG_BASE

- **定义位置**: 第10行
- **值**: `join(process.cwd(), ".opencode", PACKAGE_NAME)`

## 依赖关系

- `node:fs`
- `node:path`
- `../types`
- `../constants`
- `../../../shared`
- `../../../config`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 5
- 常量数量: 3
- 类型定义数量: 0
- 导入模块数量: 6

