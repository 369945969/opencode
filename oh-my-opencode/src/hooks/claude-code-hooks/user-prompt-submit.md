# user-prompt-submit.ts

## 文件信息

- **路径**: src/hooks/claude-code-hooks/user-prompt-submit.ts
- **目录**: src/hooks/claude-code-hooks
- **行数**: 118

## 文件功能

提供了 1 个函数/工具,用于实现特定功能。

## 接口定义

### MessagePart

- **定义位置**: 第13行
- **属性**: type, ype, pe, e, text, ext, xt, t, key, ey

### UserPromptSubmitContext

- **定义位置**: 第19行
- **属性**: sessionId, essionId, ssionId, sionId, ionId, onId, nId, Id, d, parentSessionId

### UserPromptSubmitResult

- **定义位置**: 第28行
- **属性**: block, lock, ock, ck, k, reason, eason, ason, son, on

## 函数定义

### executeUserPromptSubmitHooks()

- **定义位置**: 第35行
- **参数**: `ctx: UserPromptSubmitContext,
  config: ClaudeHooksConfig | null,
  extendedConfig?: PluginExtendedConfig | null`
- **返回值**: `Promise<UserPromptSubmitResult>`

## 常量定义

### USER_PROMPT_SUBMIT_TAG_OPEN

- **定义位置**: 第10行
- **值**: `"<user-prompt-submit-hook>"`

### USER_PROMPT_SUBMIT_TAG_CLOSE

- **定义位置**: 第11行
- **值**: `"</user-prompt-submit-hook>"`

## 依赖关系

- `./types`
- `../../shared`
- `./plugin-config`
- `./config-loader`

## 代码统计

- 接口数量: 3
- 类数量: 0
- 函数数量: 1
- 常量数量: 2
- 类型定义数量: 0
- 导入模块数量: 4

