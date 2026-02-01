# cli.ts

## 文件信息

- **路径**: src/hooks/comment-checker/cli.ts
- **目录**: src/hooks/comment-checker
- **行数**: 222

## 文件功能

提供了 9 个函数/工具,用于实现特定功能。

## 接口定义

### HookInput

- **定义位置**: 第124行
- **属性**: session_id, ession_id, ssion_id, sion_id, ion_id, on_id, n_id, _id, id, d

### CheckResult

- **定义位置**: 第140行
- **属性**: hasComments, asComments, sComments, Comments, omments, mments, ments, ents, nts, ts

## 函数定义

### debugLog()

- **定义位置**: 第12行
- **参数**: `...args: unknown[]`

### getBinaryName()

- **定义位置**: 第19行
- **返回值**: `string`

### findCommentCheckerPathSync()

- **定义位置**: 第23行
- **返回值**: `string | null`

### getCommentCheckerPath()

- **定义位置**: 第65行
- **描述**: Asynchronously get comment-checker binary path. Will trigger lazy download if binary not found. /
- **返回值**: `Promise<string | null>`

### getCommentCheckerPathSync()

- **定义位置**: 第105行
- **描述**: Synchronously get comment-checker path (no download). Returns cached path or searches known locations. /
- **返回值**: `string | null`

### startBackgroundInit()

- **定义位置**: 第113行
- **描述**: Start background initialization. Call this early to trigger download while other init happens. /

### runCommentChecker()

- **定义位置**: 第151行
- **描述**: Run comment-checker CLI with given input. /
- **参数**: `input: HookInput, cliPath?: string, customPrompt?: string`
- **返回值**: `Promise<CheckResult>`

### isCliAvailable()

- **定义位置**: 第210行
- **描述**: Check if CLI is available (sync check, no download). /
- **返回值**: `boolean`

### ensureCliAvailable()

- **定义位置**: 第218行
- **描述**: Check if CLI will be available (async, may trigger download). /
- **返回值**: `Promise<boolean>`

## 常量定义

### DEBUG

- **定义位置**: 第9行
- **值**: `process.env.COMMENT_CHECKER_DEBUG === "1"`

### DEBUG_FILE

- **定义位置**: 第10行
- **值**: `join(tmpdir(), "comment-checker-debug.log")`

## 依赖关系

- `bun`
- `module`
- `path`
- `fs`
- `os`
- `./downloader`

## 代码统计

- 接口数量: 2
- 类数量: 0
- 函数数量: 9
- 常量数量: 2
- 类型定义数量: 0
- 导入模块数量: 6

