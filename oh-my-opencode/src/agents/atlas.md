# atlas.ts

## 文件信息

- **路径**: src/agents/atlas.ts
- **目录**: src/agents
- **行数**: 570

## 文件功能

提供了 6 个函数/工具,用于实现特定功能。

## 接口定义

### OrchestratorContext

- **定义位置**: 第19行
- **描述**: Atlas - Master Orchestrator Agent Orchestrates work via delegate_task() to complete ALL tasks in a todo list until fully done. You are the conductor of a symphony of specialized agents. /
- **属性**: model, odel, del, el, l, availableAgents, vailableAgents, ailableAgents, ilableAgents, lableAgents

## 函数定义

### buildAgentSelectionSection()

- **定义位置**: 第26行
- **参数**: `agents: AvailableAgent[]`
- **返回值**: `string`

### buildCategorySection()

- **定义位置**: 第45行
- **参数**: `userCategories?: Record<string, CategoryConfig>`
- **返回值**: `string`

### buildSkillsSection()

- **定义位置**: 第65行
- **参数**: `skills: AvailableSkill[]`
- **返回值**: `string`

### buildDecisionMatrix()

- **定义位置**: 第101行
- **描述**: *IMPORTANT:**
- **参数**: `agents: AvailableAgent[], userCategories?: Record<string, CategoryConfig>`
- **返回值**: `string`

### buildDynamicOrchestratorPrompt()

- **定义位置**: 第500行
- **参数**: `ctx?: OrchestratorContext`
- **返回值**: `string`

### createAtlasAgent()

- **定义位置**: 第525行
- **参数**: `ctx: OrchestratorContext`
- **返回值**: `AgentConfig`

## 常量定义

### getCategoryDescription

- **定义位置**: 第9行
- **值**: `(name: string, userCategories?: Record<string, CategoryConfig>) =>`

### ATLAS_SYSTEM_PROMPT

- **定义位置**: 第123行
- **描述**: *NEVER provide both category AND agent - they are mutually exclusive.**`
- **值**: ```

## 依赖关系

- `@opencode-ai/sdk`
- `./types`
- `./dynamic-agent-prompt-builder`
- `../config/schema`
- `../tools/delegate-task/constants`
- `../shared/permission-compat`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 6
- 常量数量: 2
- 类型定义数量: 0
- 导入模块数量: 6

