# types.ts

## 文件信息

- **路径**: src/hooks/claude-code-hooks/types.ts
- **目录**: src/hooks/claude-code-hooks
- **行数**: 205

## 文件功能

TypeScript 模块文件,包含类型定义和常量导出。

## 接口定义

### HookMatcher

- **定义位置**: 第13行
- **属性**: matcher, atcher, tcher, cher, her, er, r, hooks, ooks, oks

### HookCommand

- **定义位置**: 第18行
- **属性**: type, ype, pe, e, command, ommand, mmand, mand, and, nd

### ClaudeHooksConfig

- **定义位置**: 第23行
- **属性**: PreToolUse, reToolUse, eToolUse, ToolUse, oolUse, olUse, lUse, Use, se, e

### PreToolUseInput

- **定义位置**: 第31行
- **属性**: session_id, ession_id, ssion_id, sion_id, ion_id, on_id, n_id, _id, id, d

### PostToolUseInput

- **定义位置**: 第43行
- **属性**: session_id, ession_id, ssion_id, sion_id, ion_id, on_id, n_id, _id, id, d

### UserPromptSubmitInput

- **定义位置**: 第60行
- **属性**: session_id, ession_id, ssion_id, sion_id, ion_id, on_id, n_id, _id, id, d

### StopInput

- **定义位置**: 第76行
- **属性**: session_id, ession_id, ssion_id, sion_id, ion_id, on_id, n_id, _id, id, d

### PreCompactInput

- **定义位置**: 第87行
- **属性**: session_id, ession_id, ssion_id, sion_id, ion_id, on_id, n_id, _id, id, d

### HookCommonOutput

- **定义位置**: 第99行
- **描述**: Common JSON fields for all hook outputs (Claude Code spec) /
- **属性**: continue, ontinue, ntinue, tinue, inue, nue, ue, e, stopReason, topReason

### PreToolUseOutput

- **定义位置**: 第110行
- **属性**: Deprecated, eprecated, precated, recated, ecated, cated, ated, ted, ed, d

### PostToolUseOutput

- **定义位置**: 第123行
- **属性**: decision, ecision, cision, ision, sion, ion, on, n, reason, eason

### HookResult

- **定义位置**: 第133行
- **属性**: exitCode, xitCode, itCode, tCode, Code, ode, de, e, stdout, tdout

### TranscriptEntry

- **定义位置**: 第139行
- **属性**: type, ype, pe, e, timestamp, imestamp, mestamp, estamp, stamp, tamp

### TodoItem

- **定义位置**: 第148行
- **属性**: id, d, content, ontent, ntent, tent, ent, nt, t, status

### ClaudeCodeTodoItem

- **定义位置**: 第157行
- **属性**: content, ontent, ntent, tent, ent, nt, t, status, tatus, atus

### TodoFile

- **定义位置**: 第163行
- **属性**: session_id, ession_id, ssion_id, sion_id, ion_id, on_id, n_id, _id, id, d

### StopOutput

- **定义位置**: 第170行
- **属性**: decision, ecision, cision, ision, sion, ion, on, n, reason, eason

### PreCompactOutput

- **定义位置**: 第178行
- **属性**: context, ontext, ntext, text, ext, xt, t, hookSpecificOutput, ookSpecificOutput, okSpecificOutput

### ClaudeCodeMessage

- **定义位置**: 第193行
- **属性**: type, ype, pe, e, message, essage, ssage, sage, age, ge

### PluginConfig

- **定义位置**: 第201行
- **属性**: disabledHooks, isabledHooks, sabledHooks, abledHooks, bledHooks, ledHooks, edHooks, dHooks, Hooks, ooks

## 类型定义

- `ClaudeHookEvent`
- `PermissionMode`
- `HookSource`
- `PermissionDecision`
- `ClaudeCodeContent`

## 代码统计

- 接口数量: 20
- 类数量: 0
- 函数数量: 0
- 常量数量: 0
- 类型定义数量: 5
- 导入模块数量: 0

