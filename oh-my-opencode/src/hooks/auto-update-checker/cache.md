# cache.ts

## 文件信息

- **路径**: src/hooks/auto-update-checker/cache.ts
- **目录**: src/hooks/auto-update-checker
- **行数**: 94

## 文件功能

提供了 4 个函数/工具,用于实现特定功能。

## 接口定义

### BunLockfile

- **定义位置**: 第6行
- **属性**: workspaces, orkspaces, rkspaces, kspaces, spaces, paces, aces, ces, es, s

## 函数定义

### stripTrailingCommas()

- **定义位置**: 第15行
- **参数**: `json: string`
- **返回值**: `string`

### removeFromBunLock()

- **定义位置**: 第19行
- **参数**: `packageName: string`
- **返回值**: `boolean`

### invalidatePackage()

- **定义位置**: 第49行
- **参数**: `packageName: string = PACKAGE_NAME`
- **返回值**: `boolean`

### invalidateCache()

- **定义位置**: 第90行
- **返回值**: `boolean`

## 依赖关系

- `./constants`
- `../../shared/logger`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 4
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 2

