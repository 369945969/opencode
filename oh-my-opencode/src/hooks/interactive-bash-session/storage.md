# storage.ts

## 文件信息

- **路径**: src/hooks/interactive-bash-session/storage.ts
- **目录**: src/hooks/interactive-bash-session
- **行数**: 60

## 文件功能

提供了 4 个函数/工具,用于实现特定功能。

## 函数定义

### getStoragePath()

- **定义位置**: 第15行
- **参数**: `sessionID: string`
- **返回值**: `string`

### loadInteractiveBashSessionState()

- **定义位置**: 第19行
- **参数**: `sessionID: string,`
- **返回值**: `InteractiveBashSessionState | null`

### saveInteractiveBashSessionState()

- **定义位置**: 第38行
- **参数**: `state: InteractiveBashSessionState,`

### clearInteractiveBashSessionState()

- **定义位置**: 第54行
- **参数**: `sessionID: string`

## 依赖关系

- `node:fs`
- `node:path`
- `./constants`
- `./types`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 4
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 4

