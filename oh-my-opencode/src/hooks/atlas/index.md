# index.ts

## 文件信息

- **路径**: src/hooks/atlas/index.ts
- **目录**: src/hooks/atlas
- **行数**: 758

## 文件功能

这是模块的入口文件,统一导出本模块的所有公共 API。

## 接口定义

### GitFileStat

- **定义位置**: 第265行
- **属性**: path, ath, th, h, added, dded, ded, ed, d, removed

### ToolExecuteAfterInput

- **定义位置**: 第372行
- **属性**: tool, ool, ol, l, sessionID, essionID, ssionID, sionID, ionID, onID

### ToolExecuteAfterOutput

- **定义位置**: 第378行
- **属性**: title, itle, tle, le, e, output, utput, tput, put, ut

### SessionState

- **定义位置**: 第384行
- **属性**: lastEventWasAbortError, astEventWasAbortError, stEventWasAbortError, tEventWasAbortError, EventWasAbortError, ventWasAbortError, entWasAbortError, ntWasAbortError, tWasAbortError, WasAbortError

### AtlasHookOptions

- **定义位置**: 第391行
- **属性**: directory, irectory, rectory, ectory, ctory, tory, ory, ry, y, backgroundManager

## 函数定义

### isSisyphusPath()

- **定义位置**: 第23行
- **描述**: Cross-platform check if a path is inside .sisyphus/ directory. Handles both forward slashes (Unix) and backslashes (Windows). /
- **参数**: `filePath: string`
- **返回值**: `boolean`

### buildVerificationReminder()

- **定义位置**: 第182行
- **描述**: *REFUSE multi-task requests. DEMAND single-task clarity.**
- **参数**: `sessionId: string`
- **返回值**: `string`

### buildOrchestratorReminder()

- **定义位置**: 第193行
- **描述**: *If ANY verification fails, use this immediately:**
- **参数**: `planName: string, progress: { total: number; completed: number }, sessionId: string`
- **返回值**: `string`

### buildStandaloneVerificationReminder()

- **定义位置**: 第229行
- **描述**: *${remaining} tasks remain. Keep bouldering.**`
- **参数**: `sessionId: string`
- **返回值**: `string`

### extractSessionIdFromOutput()

- **定义位置**: 第260行
- **描述**: *NO TODO = NO TRACKING = INCOMPLETE WORK. Use todowrite aggressively.**`
- **参数**: `output: string`
- **返回值**: `string`

### getGitDiffStats()

- **定义位置**: 第272行
- **参数**: `directory: string`
- **返回值**: `GitFileStat[]`

### formatFileChanges()

- **定义位置**: 第327行
- **参数**: `stats: GitFileStat[], notepadPath?: string`
- **返回值**: `string`

### isAbortError()

- **定义位置**: 第396行
- **参数**: `error: unknown`
- **返回值**: `boolean`

### createAtlasHook()

- **定义位置**: 第417行
- **参数**: `ctx: PluginInput,
  options?: AtlasHookOptions`

## 常量定义

### HOOK_NAME

- **定义位置**: 第17行
- **值**: `"atlas"`

### WRITE_EDIT_TOOLS

- **定义位置**: 第27行
- **描述**: Handles both forward slashes (Unix) and backslashes (Windows). /
- **值**: `["Write", "Edit", "write", "edit"]`

### DIRECT_WORK_REMINDER

- **定义位置**: 第29行
- **值**: ```

### BOULDER_CONTINUATION_PROMPT

- **定义位置**: 第57行
- **值**: ``${createSystemDirective(SystemDirectiveTypes.BOULDER_CONTINUATION)}`

### VERIFICATION_REMINDER

- **定义位置**: 第68行
- **值**: ``**MANDATORY: WHAT YOU MUST DO RIGHT NOW**`

### ORCHESTRATOR_DELEGATION_REQUIRED

- **定义位置**: 第107行
- **描述**: *BLOCKING: DO NOT proceed to Step 4 until Steps 1-3 are VERIFIED.**`
- **值**: ```

### SINGLE_TASK_DIRECTIVE

- **定义位置**: 第157行
- **值**: ```

### CONTINUATION_COOLDOWN_MS

- **定义位置**: 第389行
- **值**: `5000`

## 依赖关系

- `@opencode-ai/plugin`
- `node:child_process`
- `node:fs`
- `node:path`
- `../../features/boulder-state`
- `../../features/claude-code-session-state`
- `../../features/hook-message-injector`
- `../../shared/logger`
- `../../shared/system-directive`
- `../../shared/session-utils`
- `../../features/background-agent`

## 代码统计

- 接口数量: 5
- 类数量: 0
- 函数数量: 9
- 常量数量: 8
- 类型定义数量: 0
- 导入模块数量: 11

