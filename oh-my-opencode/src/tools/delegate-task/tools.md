# tools.ts

## 文件信息

- **路径**: src/tools/delegate-task/tools.ts
- **目录**: src/tools/delegate-task
- **行数**: 1128

## 文件功能

提供了 7 个函数/工具,用于实现特定功能。

## 接口定义

### ErrorContext

- **定义位置**: 第58行
- **属性**: operation, peration, eration, ration, ation, tion, ion, on, n, args

### SyncSessionCreatedEvent

- **定义位置**: 第155行
- **属性**: sessionID, essionID, ssionID, sionID, ionID, onID, nID, ID, D, parentID

### DelegateTaskToolOptions

- **定义位置**: 第161行
- **属性**: manager, anager, nager, ager, ger, er, r, client, lient, ient

### BuildSystemContentInput

- **定义位置**: 第172行
- **属性**: skillContent, killContent, illContent, llContent, lContent, Content, ontent, ntent, tent, ent

## 函数定义

### parseModelString()

- **定义位置**: 第25行
- **参数**: `model: string`

### getMessageDir()

- **定义位置**: 第33行
- **参数**: `sessionID: string`
- **返回值**: `string | null`

### formatDuration()

- **定义位置**: 第47行
- **参数**: `start: Date, end?: Date`
- **返回值**: `string`

### formatDetailedError()

- **定义位置**: 第66行
- **参数**: `error: unknown, ctx: ErrorContext`
- **返回值**: `string`

### resolveCategoryConfig()

- **定义位置**: 第114行
- **参数**: `categoryName: string,
  options: {
    userCategories?: CategoriesConfig
    inheritedModel?: string
    systemDefaultModel?: string
  }`

### buildSystemContent()

- **定义位置**: 第178行
- **参数**: `input: BuildSystemContentInput`
- **返回值**: `string | undefined`

### createDelegateTask()

- **定义位置**: 第204行
- **参数**: `options: DelegateTaskToolOptions`
- **返回值**: `ToolDefinition`

## 常量定义

### SISYPHUS_JUNIOR_AGENT

- **定义位置**: 第23行
- **值**: `"sisyphus-junior"`

## 类型定义

- `OpencodeClient`
- `ToolContextWithMetadata`

## 依赖关系

- `@opencode-ai/plugin`
- `node:fs`
- `node:path`
- `../../features/background-agent`
- `./types`
- `../../config/schema`
- `./constants`
- `./timing`
- `../../features/hook-message-injector`
- `../../features/opencode-skill-loader/skill-content`
- `../../features/opencode-skill-loader`
- `../../features/task-toast-manager`
- `../../features/task-toast-manager/types`
- `../../features/claude-code-session-state`
- `../../shared`
- ... 还有 4 个依赖

## 代码统计

- 接口数量: 4
- 类数量: 0
- 函数数量: 7
- 常量数量: 1
- 类型定义数量: 2
- 导入模块数量: 19

