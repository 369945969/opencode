# storage.ts

## 文件信息

- **路径**: src/features/sisyphus-tasks/storage.ts
- **目录**: src/features/sisyphus-tasks
- **行数**: 83

## 文件功能

提供了 6 个函数/工具,用于实现特定功能。

## 函数定义

### getTaskDir()

- **定义位置**: 第7行
- **参数**: `listId: string, config: Partial<OhMyOpenCodeConfig>`
- **返回值**: `string`

### getTaskPath()

- **定义位置**: 第18行
- **参数**: `listId: string, taskId: string, config: Partial<OhMyOpenCodeConfig>`
- **返回值**: `string`

### getTeamDir()

- **定义位置**: 第22行
- **参数**: `teamName: string, config: Partial<OhMyOpenCodeConfig>`
- **返回值**: `string`

### getInboxPath()

- **定义位置**: 第33行
- **参数**: `teamName: string, agentName: string, config: Partial<OhMyOpenCodeConfig>`
- **返回值**: `string`

### ensureDir()

- **定义位置**: 第37行
- **参数**: `dirPath: string`

### writeJsonAtomic()

- **定义位置**: 第63行
- **参数**: `filePath: string, data: unknown`

## 依赖关系

- `path`
- `fs`
- `os`
- `zod`
- `../../config/schema`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 6
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 5

