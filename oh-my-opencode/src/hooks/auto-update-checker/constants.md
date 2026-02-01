# constants.ts

## 文件信息

- **路径**: src/hooks/auto-update-checker/constants.ts
- **目录**: src/hooks/auto-update-checker
- **行数**: 34

## 文件功能

提供了 2 个函数/工具,用于实现特定功能。

## 函数定义

### getCacheDir()

- **定义位置**: 第10行
- **返回值**: `string`

### getWindowsAppdataDir()

- **定义位置**: 第26行
- **返回值**: `string | null`

## 常量定义

### PACKAGE_NAME

- **定义位置**: 第6行
- **值**: `"oh-my-opencode"`

### NPM_REGISTRY_URL

- **定义位置**: 第7行
- **值**: ``https://registry.npmjs.org/-/package/${PACKAGE_NAME}/dist-tags``

### NPM_FETCH_TIMEOUT

- **定义位置**: 第8行
- **值**: `5000`

### CACHE_DIR

- **定义位置**: 第17行
- **值**: `getCacheDir()`

### VERSION_FILE

- **定义位置**: 第18行
- **值**: `path.join(CACHE_DIR, "version")`

### INSTALLED_PACKAGE_JSON

- **定义位置**: 第19行
- **值**: `path.join(`

### USER_CONFIG_DIR

- **定义位置**: 第31行
- **值**: `getOpenCodeConfigDir({ binary: "opencode" })`

### USER_OPENCODE_CONFIG

- **定义位置**: 第32行
- **值**: `path.join(USER_CONFIG_DIR, "opencode.json")`

### USER_OPENCODE_CONFIG_JSONC

- **定义位置**: 第33行
- **值**: `path.join(USER_CONFIG_DIR, "opencode.jsonc")`

## 依赖关系

- `../../shared`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 2
- 常量数量: 9
- 类型定义数量: 0
- 导入模块数量: 1

