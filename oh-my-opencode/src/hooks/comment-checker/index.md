# index.ts

## 文件信息

- **路径**: src/hooks/comment-checker/index.ts
- **目录**: src/hooks/comment-checker
- **行数**: 172

## 文件功能

这是模块的入口文件,统一导出本模块的所有公共 API。

## 函数定义

### debugLog()

- **定义位置**: 第13行
- **参数**: `...args: unknown[]`

### cleanupOldPendingCalls()

- **定义位置**: 第26行

### createCommentCheckerHooks()

- **定义位置**: 第35行
- **参数**: `config?: CommentCheckerConfig`

### processWithCli()

- **定义位置**: 第139行
- **参数**: `input: { tool: string; sessionID: string; callID: string },
  pendingCall: PendingCall,
  output: { output: string },
  cliPath: string,
  customPrompt?: string`
- **返回值**: `Promise<void>`

## 常量定义

### DEBUG

- **定义位置**: 第10行
- **值**: `process.env.COMMENT_CHECKER_DEBUG === "1"`

### DEBUG_FILE

- **定义位置**: 第11行
- **值**: `join(tmpdir(), "comment-checker-debug.log")`

### pendingCalls

- **定义位置**: 第20行
- **值**: `new Map<string, PendingCall>()`

### PENDING_CALL_TTL

- **定义位置**: 第21行
- **值**: `60_000`

## 依赖关系

- `./types`
- `./cli`
- `../../config/schema`
- `fs`
- `os`
- `path`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 4
- 常量数量: 4
- 类型定义数量: 0
- 导入模块数量: 6

