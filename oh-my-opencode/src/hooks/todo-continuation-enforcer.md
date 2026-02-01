# todo-continuation-enforcer.ts

## 文件信息

- **路径**: src/hooks/todo-continuation-enforcer.ts
- **目录**: src/hooks
- **行数**: 494

## 文件功能

提供了 4 个函数/工具,用于实现特定功能。

## 接口定义

### TodoContinuationEnforcerOptions

- **定义位置**: 第18行
- **属性**: backgroundManager, ackgroundManager, ckgroundManager, kgroundManager, groundManager, roundManager, oundManager, undManager, ndManager, dManager

### TodoContinuationEnforcer

- **定义位置**: 第23行
- **属性**: handler, andler, ndler, dler, ler, er, r, input, nput, put

### Todo

- **定义位置**: 第29行
- **属性**: content, ontent, ntent, tent, ent, nt, t, status, tatus, atus

### SessionState

- **定义位置**: 第36行
- **属性**: countdownTimer, ountdownTimer, untdownTimer, ntdownTimer, tdownTimer, downTimer, ownTimer, wnTimer, nTimer, Timer

### MessageInfo

- **定义位置**: 第74行
- **属性**: id, d, role, ole, le, e, error, rror, ror, or

## 函数定义

### getMessageDir()

- **定义位置**: 第56行
- **参数**: `sessionID: string`
- **返回值**: `string | null`

### getIncompleteCount()

- **定义位置**: 第70行
- **参数**: `todos: Todo[]`
- **返回值**: `number`

### isLastAssistantMessageAborted()

- **定义位置**: 第80行
- **参数**: `messages: Array<{ info?: MessageInfo }>`
- **返回值**: `boolean`

### createTodoContinuationEnforcer()

- **定义位置**: 第94行
- **参数**: `ctx: PluginInput,
  options: TodoContinuationEnforcerOptions = {}`
- **返回值**: `TodoContinuationEnforcer`

## 常量定义

### HOOK_NAME

- **定义位置**: 第14行
- **值**: `"todo-continuation-enforcer"`

### DEFAULT_SKIP_AGENTS

- **定义位置**: 第16行
- **值**: `["prometheus", "compaction"]`

### CONTINUATION_PROMPT

- **定义位置**: 第44行
- **值**: ``${createSystemDirective(SystemDirectiveTypes.TODO_CONTINUATION)}`

### COUNTDOWN_SECONDS

- **定义位置**: 第52行
- **值**: `2`

### TOAST_DURATION_MS

- **定义位置**: 第53行
- **值**: `900`

### COUNTDOWN_GRACE_PERIOD_MS

- **定义位置**: 第54行
- **值**: `500`

## 依赖关系

- `@opencode-ai/plugin`
- `node:fs`
- `node:path`
- `../features/background-agent`
- `../features/claude-code-session-state`
- `../features/hook-message-injector`
- `../shared/logger`
- `../shared/system-directive`

## 代码统计

- 接口数量: 5
- 类数量: 0
- 函数数量: 4
- 常量数量: 6
- 类型定义数量: 0
- 导入模块数量: 8

