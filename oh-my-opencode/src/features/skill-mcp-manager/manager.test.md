# manager.test.ts

## 文件信息

- **路径**: src/features/skill-mcp-manager/manager.test.ts
- **目录**: src/features/skill-mcp-manager
- **行数**: 808

## 文件功能

这是一个测试文件,使用 Bun 测试框架编写。

## 常量定义

### mockHttpConnect

- **定义位置**: 第7行
- **值**: `mock(() => Promise.reject(new Error("Mocked HTTP connection failure")))`

### mockHttpClose

- **定义位置**: 第8行
- **值**: `mock(() => Promise.resolve())`

### mockTokens

- **定义位置**: 第25行
- **值**: `mock(() => null as { accessToken: string`

### mockLogin

- **定义位置**: 第26行
- **值**: `mock(() => Promise.resolve({ accessToken: "new-token" }))`

## 依赖关系

- `bun:test`
- `./manager`
- `./types`
- `../claude-code-mcp-loader/types`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 0
- 常量数量: 4
- 类型定义数量: 0
- 导入模块数量: 4

