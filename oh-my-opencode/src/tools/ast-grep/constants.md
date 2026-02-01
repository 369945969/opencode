# constants.ts

## 文件信息

- **路径**: src/tools/ast-grep/constants.ts
- **目录**: src/tools/ast-grep
- **行数**: 262

## 文件功能

提供了 7 个函数/工具,用于实现特定功能。

## 接口定义

### EnvironmentCheckResult

- **定义位置**: 第168行
- **属性**: cli, li, i, napi, api, pi

## 函数定义

### isValidBinary()

- **定义位置**: 第8行
- **参数**: `filePath: string`
- **返回值**: `boolean`

### getPlatformPackageName()

- **定义位置**: 第16行
- **返回值**: `string | null`

### findSgCliPathSync()

- **定义位置**: 第33行
- **返回值**: `string | null`

### getSgCliPath()

- **定义位置**: 第85行
- **返回值**: `string`

### setSgCliPath()

- **定义位置**: 第99行
- **参数**: `path: string`

### checkEnvironment()

- **定义位置**: 第184行
- **描述**: Check if ast-grep CLI and NAPI are available. Call this at startup to provide early feedback about missing dependencies. /
- **返回值**: `EnvironmentCheckResult`

### formatEnvironmentCheck()

- **定义位置**: 第231行
- **描述**: Format environment check result as user-friendly message. /
- **参数**: `result: EnvironmentCheckResult`
- **返回值**: `string`

## 常量定义

### CLI_LANGUAGES

- **定义位置**: 第104行
- **值**: `[`

### NAPI_LANGUAGES

- **定义位置**: 第133行
- **值**: `["html", "javascript", "tsx", "css", "typescript"] as const`

### DEFAULT_TIMEOUT_MS

- **定义位置**: 第136行
- **值**: `300_000`

### DEFAULT_MAX_OUTPUT_BYTES

- **定义位置**: 第137行
- **值**: `1 * 1024 * 1024`

### DEFAULT_MAX_MATCHES

- **定义位置**: 第138行
- **值**: `500`

## 类型定义

- `Platform`

## 依赖关系

- `module`
- `path`
- `fs`
- `./downloader`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 7
- 常量数量: 5
- 类型定义数量: 1
- 导入模块数量: 4

