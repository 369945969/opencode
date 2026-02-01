# index.ts

## 文件信息

- **路径**: src/hooks/category-skill-reminder/index.ts
- **目录**: src/hooks/category-skill-reminder
- **行数**: 166

## 文件功能

这是模块的入口文件,统一导出本模块的所有公共 API。

## 接口定义

### ToolExecuteInput

- **定义位置**: 第65行
- **属性**: tool, ool, ol, l, sessionID, essionID, ssionID, sionID, ionID, onID

### ToolExecuteOutput

- **定义位置**: 第72行
- **属性**: title, itle, tle, le, e, output, utput, tput, put, ut

### SessionState

- **定义位置**: 第78行
- **属性**: delegationUsed, elegationUsed, legationUsed, egationUsed, gationUsed, ationUsed, tionUsed, ionUsed, onUsed, nUsed

## 函数定义

### createCategorySkillReminderHook()

- **定义位置**: 第84行
- **参数**: `_ctx: PluginInput`

## 常量定义

### TARGET_AGENTS

- **定义位置**: 第9行
- **描述**: Target agents that should receive category+skill reminders. These are orchestrator agents that delegate work to specialized agents. /
- **值**: `new Set([`

### DELEGATABLE_WORK_TOOLS

- **定义位置**: 第19行
- **描述**: Tools that indicate the agent is doing work that could potentially be delegated. When these tools are used, we remind the agent about the category+skill system. /
- **值**: `new Set([`

### DELEGATION_TOOLS

- **定义位置**: 第31行
- **描述**: Tools that indicate the agent is already using delegation properly. /
- **值**: `new Set([`

### REMINDER_MESSAGE

- **定义位置**: 第37行
- **值**: ```

## 依赖关系

- `@opencode-ai/plugin`
- `../../features/claude-code-session-state`
- `../../shared`

## 代码统计

- 接口数量: 3
- 类数量: 0
- 函数数量: 1
- 常量数量: 4
- 类型定义数量: 0
- 导入模块数量: 3

