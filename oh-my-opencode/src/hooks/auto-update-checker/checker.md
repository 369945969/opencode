# checker.ts

## 文件信息

- **路径**: src/hooks/auto-update-checker/checker.ts
- **目录**: src/hooks/auto-update-checker
- **行数**: 299

## 文件功能

提供了 11 个函数/工具,用于实现特定功能。

## 接口定义

### PluginEntryInfo

- **定义位置**: 第119行
- **属性**: entry, ntry, try, ry, y, isPinned, sPinned, Pinned, inned, nned

## 函数定义

### isLocalDevMode()

- **定义位置**: 第18行
- **参数**: `directory: string`
- **返回值**: `boolean`

### stripJsonComments()

- **定义位置**: 第22行
- **参数**: `json: string`
- **返回值**: `string`

### getConfigPaths()

- **定义位置**: 第28行
- **参数**: `directory: string`
- **返回值**: `string[]`

### getLocalDevPath()

- **定义位置**: 第57行
- **参数**: `directory: string`
- **返回值**: `string | null`

### findPackageJsonUp()

- **定义位置**: 第82行
- **参数**: `startPath: string`
- **返回值**: `string | null`

### getLocalDevVersion()

- **定义位置**: 第104行
- **参数**: `directory: string`
- **返回值**: `string | null`

### findPluginEntry()

- **定义位置**: 第126行
- **参数**: `directory: string`
- **返回值**: `PluginEntryInfo | null`

### getCachedVersion()

- **定义位置**: 第152行
- **返回值**: `string | null`

### updatePinnedVersion()

- **定义位置**: 第195行
- **描述**: Updates a pinned version entry in the config file. Only replaces within the "plugin" array to avoid unintended edits. Preserves JSONC comments and formatting via string replacement. /
- **参数**: `configPath: string, oldEntry: string, newVersion: string`
- **返回值**: `boolean`

### getLatestVersion()

- **定义位置**: 第248行
- **参数**: `channel: string = "latest"`
- **返回值**: `Promise<string | null>`

### checkForUpdate()

- **定义位置**: 第269行
- **参数**: `directory: string`
- **返回值**: `Promise<UpdateCheckResult>`

## 依赖关系

- `node:url`
- `./types`
- `./constants`
- `../../shared/logger`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 11
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 4

