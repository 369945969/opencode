# transcript.ts

## 文件信息

- **路径**: src/hooks/claude-code-hooks/transcript.ts
- **目录**: src/hooks/claude-code-hooks
- **行数**: 253

## 文件功能

提供了 9 个函数/工具,用于实现特定功能。

## 接口定义

### OpenCodeMessagePart

- **定义位置**: 第88行
- **描述**: OpenCode API response type (loosely typed) /
- **属性**: type, ype, pe, e, tool, ool, ol, l, state, tate

### OpenCodeMessage

- **定义位置**: 第97行
- **属性**: info, nfo, fo, o, parts, arts, rts, ts, s

### DisabledTranscriptEntry

- **定义位置**: 第107行
- **描述**: Claude Code compatible transcript entry (from disabled file) /
- **属性**: type, ype, pe, e, message, essage, ssage, sage, age, ge

## 函数定义

### getTranscriptPath()

- **定义位置**: 第11行
- **参数**: `sessionId: string`
- **返回值**: `string`

### ensureTranscriptDir()

- **定义位置**: 第15行

### appendTranscriptEntry()

- **定义位置**: 第21行
- **参数**: `sessionId: string,
  entry: TranscriptEntry`

### recordToolUse()

- **定义位置**: 第31行
- **参数**: `sessionId: string,
  toolName: string,
  toolInput: Record<string, unknown>`

### recordToolResult()

- **定义位置**: 第44行
- **参数**: `sessionId: string,
  toolName: string,
  toolInput: Record<string, unknown>,
  toolOutput: Record<string, unknown>`

### recordUserMessage()

- **定义位置**: 第59行
- **参数**: `sessionId: string,
  content: string`

### recordAssistantMessage()

- **定义位置**: 第70行
- **参数**: `sessionId: string,
  content: string`

### buildTranscriptFromSession()

- **定义位置**: 第132行
- **描述**: /
- **参数**: `client: {
    session: {
      messages: (opts: { path: { id: string }; query?: { directory: string } }`

### deleteTempTranscript()

- **定义位置**: 第245行
- **描述**: Delete temp transcript file (call in finally block) PORT FROM DISABLED: Cleanup mechanism to avoid disk accumulation /
- **参数**: `path: string | null`

## 常量定义

### TRANSCRIPT_DIR

- **定义位置**: 第9行
- **值**: `join(getClaudeConfigDir(), "transcripts")`

## 依赖关系

- `path`
- `fs`
- `os`
- `crypto`
- `./types`
- `../../shared/tool-name`
- `../../shared`

## 代码统计

- 接口数量: 3
- 类数量: 0
- 函数数量: 9
- 常量数量: 1
- 类型定义数量: 0
- 导入模块数量: 7

