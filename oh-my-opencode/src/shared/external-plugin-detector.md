# external-plugin-detector.ts

## 文件信息

- **路径**: src/shared/external-plugin-detector.ts
- **目录**: src/shared
- **行数**: 138

## 文件功能

提供了 6 个函数/工具,用于实现特定功能。

## 接口定义

### OpencodeConfig

- **定义位置**: 第12行
- **属性**: plugin, lugin, ugin, gin, in, n

### ExternalNotifierResult

- **定义位置**: 第91行
- **属性**: detected, etected, tected, ected, cted, ted, ed, d, pluginName, luginName

## 函数定义

### getWindowsAppdataDir()

- **定义位置**: 第27行
- **返回值**: `string | null`

### getConfigPaths()

- **定义位置**: 第31行
- **参数**: `directory: string`
- **返回值**: `string[]`

### loadOpencodePlugins()

- **定义位置**: 第51行
- **参数**: `directory: string`
- **返回值**: `string[]`

### matchesNotificationPlugin()

- **定义位置**: 第71行
- **描述**: Check if a plugin entry matches a known notification plugin. Handles various formats: "name", "name@version", "npm:name", "file://path/name" /
- **参数**: `entry: string`
- **返回值**: `string | null`

### detectExternalNotificationPlugin()

- **定义位置**: 第101行
- **描述**: Detect if any external notification plugin is configured. Returns information about detected plugins for logging/warning. /
- **参数**: `directory: string`
- **返回值**: `ExternalNotifierResult`

### getNotificationConflictWarning()

- **定义位置**: 第126行
- **描述**: Generate a warning message for users with conflicting notification plugins. /
- **参数**: `pluginName: string`
- **返回值**: `string`

## 常量定义

### KNOWN_NOTIFICATION_PLUGINS

- **定义位置**: 第21行
- **描述**: Known notification plugins that conflict with oh-my-opencode's session-notification. Both plugins listen to session.idle and send notifications simultaneously, which can cause crashes on Windows due to resource contention. /
- **值**: `[`

## 依赖关系

- `./logger`
- `./jsonc-parser`

## 代码统计

- 接口数量: 2
- 类数量: 0
- 函数数量: 6
- 常量数量: 1
- 类型定义数量: 0
- 导入模块数量: 2

