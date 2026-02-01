# index.ts

## 文件信息

- **路径**: src/hooks/session-recovery/index.ts
- **目录**: src/hooks/session-recovery
- **行数**: 436

## 文件功能

这是模块的入口文件,统一导出本模块的所有公共 API。

## 接口定义

### SessionRecoveryOptions

- **定义位置**: 第20行
- **属性**: experimental, xperimental, perimental, erimental, rimental, imental, mental, ental, ntal, tal

### MessageInfo

- **定义位置**: 第32行
- **属性**: id, d, role, ole, le, e, sessionID, essionID, ssionID, sionID

### ToolUsePart

- **定义位置**: 第40行
- **属性**: type, ype, pe, e, id, d, name, ame, me, input

### MessagePart

- **定义位置**: 第47行
- **属性**: type, ype, pe, e, id, d, text, ext, xt, t

### SessionRecoveryHook

- **定义位置**: 第317行
- **属性**: handleSessionRecovery, andleSessionRecovery, ndleSessionRecovery, dleSessionRecovery, leSessionRecovery, eSessionRecovery, SessionRecovery, essionRecovery, ssionRecovery, sionRecovery

## 函数定义

### findLastUserMessage()

- **定义位置**: 第58行
- **参数**: `messages: MessageData[]`
- **返回值**: `MessageData | undefined`

### extractResumeConfig()

- **定义位置**: 第67行
- **参数**: `userMessage: MessageData | undefined, sessionID: string`
- **返回值**: `ResumeConfig`

### resumeSession()

- **定义位置**: 第75行
- **参数**: `client: Client, config: ResumeConfig`
- **返回值**: `Promise<boolean>`

### getErrorMessage()

- **定义位置**: 第91行
- **参数**: `error: unknown`
- **返回值**: `string`

### extractMessageIndex()

- **定义位置**: 第119行
- **参数**: `error: unknown`
- **返回值**: `number | null`

### detectErrorType()

- **定义位置**: 第125行
- **参数**: `error: unknown`
- **返回值**: `RecoveryErrorType`

### extractToolUseIds()

- **定义位置**: 第154行
- **参数**: `parts: MessagePart[]`
- **返回值**: `string[]`

### recoverToolResultMissing()

- **定义位置**: 第158行
- **参数**: `client: Client,
  sessionID: string,
  failedAssistantMsg: MessageData`
- **返回值**: `Promise<boolean>`

### recoverThinkingBlockOrder()

- **定义位置**: 第199行
- **参数**: `_client: Client,
  sessionID: string,
  _failedAssistantMsg: MessageData,
  _directory: string,
  error: unknown`
- **返回值**: `Promise<boolean>`

### recoverThinkingDisabledViolation()

- **定义位置**: 第230行
- **参数**: `_client: Client,
  sessionID: string,
  _failedAssistantMsg: MessageData`
- **返回值**: `Promise<boolean>`

### recoverEmptyContentMessage()

- **定义位置**: 第253行
- **参数**: `_client: Client,
  sessionID: string,
  failedAssistantMsg: MessageData,
  _directory: string,
  error: unknown`
- **返回值**: `Promise<boolean>`

### createSessionRecoveryHook()

- **定义位置**: 第324行
- **参数**: `ctx: PluginInput, options?: SessionRecoveryOptions`
- **返回值**: `SessionRecoveryHook`

## 常量定义

### RECOVERY_RESUME_TEXT

- **定义位置**: 第56行
- **值**: `"[session recovered - continuing previous task]"`

### PLACEHOLDER_TEXT

- **定义位置**: 第251行
- **值**: `"[user interrupted]"`

## 类型定义

- `Client`
- `RecoveryErrorType`

## 依赖关系

- `@opencode-ai/plugin`
- `@opencode-ai/sdk`
- `../../config`
- `./storage`
- `./types`

## 代码统计

- 接口数量: 5
- 类数量: 0
- 函数数量: 12
- 常量数量: 2
- 类型定义数量: 2
- 导入模块数量: 5

