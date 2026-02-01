# constants.ts

## 文件信息

- **路径**: src/tools/delegate-task/constants.ts
- **目录**: src/tools/delegate-task
- **行数**: 422

## 文件功能

提供了 1 个函数/工具,用于实现特定功能。

## 函数定义

### isPlanAgent()

- **定义位置**: 第415行
- **描述**: Check if the given agent name is a plan agent. /
- **参数**: `agentName: string | undefined`
- **返回值**: `boolean`

## 常量定义

### VISUAL_CATEGORY_PROMPT_APPEND

- **定义位置**: 第3行
- **值**: ``<Category_Context>`

### STRATEGIC_CATEGORY_PROMPT_APPEND

- **定义位置**: 第17行
- **值**: ``<Category_Context>`

### ARTISTRY_CATEGORY_PROMPT_APPEND

- **定义位置**: 第33行
- **值**: ``<Category_Context>`

### QUICK_CATEGORY_PROMPT_APPEND

- **定义位置**: 第50行
- **值**: ``<Category_Context>`

### UNSPECIFIED_LOW_CATEGORY_PROMPT_APPEND

- **定义位置**: 第102行
- **值**: ``<Category_Context>`

### UNSPECIFIED_HIGH_CATEGORY_PROMPT_APPEND

- **定义位置**: 第125行
- **描述**: *PROVIDE CLEAR STRUCTURE:**
- **值**: ``<Category_Context>`

### WRITING_CATEGORY_PROMPT_APPEND

- **定义位置**: 第140行
- **值**: ``<Category_Context>`

### PLAN_AGENT_SYSTEM_PREPEND

- **定义位置**: 第194行
- **描述**: System prompt prepended to plan agent invocations. Instructs the plan agent to first gather context via explore/librarian agents, then summarize user requirements and clarify uncertainties before proceeding. Also MANDATES dependency graphs, parallel execution analysis, and category+skill recommendations. /
- **值**: ``<system>`

### PLAN_AGENT_NAMES

- **定义位置**: 第408行
- **描述**: List of agent names that should be treated as plan agents. Case-insensitive matching is used. /
- **值**: `["plan", "prometheus", "planner"]`

## 依赖关系

- `../../config/schema`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 1
- 常量数量: 9
- 类型定义数量: 0
- 导入模块数量: 1

