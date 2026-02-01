# data-path.ts

## 文件信息

- **路径**: src/shared/data-path.ts
- **目录**: src/shared
- **行数**: 48

## 文件功能

提供了 5 个函数/工具,用于实现特定功能。

## 函数定义

### getDataDir()

- **定义位置**: 第12行
- **描述**: Matches OpenCode's behavior via xdg-basedir: - All platforms: XDG_DATA_HOME or ~/.local/share Note: OpenCode uses xdg-basedir which returns ~/.local/share on ALL platforms including Windows, so we match that behavior exactly. /
- **返回值**: `string`

### getOpenCodeStorageDir()

- **定义位置**: 第20行
- **描述**: Returns the OpenCode storage directory path. All platforms: ~/.local/share/opencode/storage /
- **返回值**: `string`

### getCacheDir()

- **定义位置**: 第29行
- **描述**: Returns the user-level cache directory. Matches OpenCode's behavior via xdg-basedir: - All platforms: XDG_CACHE_HOME or ~/.cache /
- **返回值**: `string`

### getOmoOpenCodeCacheDir()

- **定义位置**: 第37行
- **描述**: Returns the oh-my-opencode cache directory. All platforms: ~/.cache/oh-my-opencode /
- **返回值**: `string`

### getOpenCodeCacheDir()

- **定义位置**: 第45行
- **描述**: Returns the OpenCode cache directory (for reading OpenCode's cache). All platforms: ~/.cache/opencode /
- **返回值**: `string`

## 依赖关系

- `node:os`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 5
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 1

