# index.test.ts

## 文件信息

- **路径**: src/hooks/auto-slash-command/index.test.ts
- **目录**: src/hooks/auto-slash-command
- **行数**: 255

## 文件功能

这是一个测试文件,使用 Bun 测试框架编写。

## 函数定义

### createMockInput()

- **定义位置**: 第17行
- **参数**: `sessionID: string, messageID?: string`
- **返回值**: `AutoSlashCommandHookInput`

### createMockOutput()

- **定义位置**: 第26行
- **参数**: `text: string`
- **返回值**: `AutoSlashCommandHookOutput`

## 常量定义

### logMock

- **定义位置**: 第11行
- **值**: `spyOn(shared, "log").mockImplementation(() => {})`

## 依赖关系

- `bun:test`
- `./types`
- `../../shared`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 2
- 常量数量: 1
- 类型定义数量: 0
- 导入模块数量: 3

