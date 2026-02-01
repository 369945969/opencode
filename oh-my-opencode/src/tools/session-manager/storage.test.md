# storage.test.ts

## 文件信息

- **路径**: src/tools/session-manager/storage.test.ts
- **目录**: src/tools/session-manager
- **行数**: 316

## 文件功能

这是一个测试文件,使用 Bun 测试框架编写。

## 常量定义

### TEST_DIR

- **定义位置**: 第6行
- **值**: `join(tmpdir(), "omo-test-session-manager")`

### TEST_MESSAGE_STORAGE

- **定义位置**: 第7行
- **值**: `join(TEST_DIR, "message")`

### TEST_PART_STORAGE

- **定义位置**: 第8行
- **值**: `join(TEST_DIR, "part")`

### TEST_SESSION_STORAGE

- **定义位置**: 第9行
- **值**: `join(TEST_DIR, "session")`

### TEST_TODO_DIR

- **定义位置**: 第10行
- **值**: `join(TEST_DIR, "todos")`

### TEST_TRANSCRIPT_DIR

- **定义位置**: 第11行
- **值**: `join(TEST_DIR, "transcripts")`

### storage

- **定义位置**: 第31行
- **值**: `await import("./storage")`

## 依赖关系

- `bun:test`
- `node:fs`
- `node:path`
- `node:os`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 0
- 常量数量: 7
- 类型定义数量: 0
- 导入模块数量: 4

