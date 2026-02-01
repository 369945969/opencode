# dynamic-agent-prompt-builder.ts

## 文件信息

- **路径**: src/agents/dynamic-agent-prompt-builder.ts
- **目录**: src/agents
- **行数**: 360

## 文件功能

提供了 12 个函数/工具,用于实现特定功能。

## 接口定义

### AvailableAgent

- **定义位置**: 第3行
- **属性**: name, ame, me, e, description, escription, scription, cription, ription, iption

### AvailableTool

- **定义位置**: 第9行
- **属性**: name, ame, me, e, category, ategory, tegory, egory, gory, ory

### AvailableSkill

- **定义位置**: 第14行
- **属性**: name, ame, me, e, description, escription, scription, cription, ription, iption

### AvailableCategory

- **定义位置**: 第20行
- **属性**: name, ame, me, e, description, escription, scription, cription, ription, iption

## 函数定义

### categorizeTools()

- **定义位置**: 第25行
- **参数**: `toolNames: string[]`
- **返回值**: `AvailableTool[]`

### formatToolsForPrompt()

- **定义位置**: 第43行
- **参数**: `tools: AvailableTool[]`
- **返回值**: `string`

### buildKeyTriggersSection()

- **定义位置**: 第65行
- **参数**: `agents: AvailableAgent[], _skills: AvailableSkill[] = []`
- **返回值**: `string`

### buildToolSelectionTable()

- **定义位置**: 第78行
- **参数**: `agents: AvailableAgent[],
  tools: AvailableTool[] = [],
  _skills: AvailableSkill[] = []`
- **返回值**: `string`

### buildExploreSection()

- **定义位置**: 第112行
- **参数**: `agents: AvailableAgent[]`
- **返回值**: `string`

### buildLibrarianSection()

- **定义位置**: 第129行
- **参数**: `agents: AvailableAgent[]`
- **返回值**: `string`

### buildDelegationTable()

- **定义位置**: 第152行
- **描述**: *Trigger phrases** (fire librarian immediately):
- **参数**: `agents: AvailableAgent[]`
- **返回值**: `string`

### buildCategorySkillsDelegationGuide()

- **定义位置**: 第169行
- **参数**: `categories: AvailableCategory[], skills: AvailableSkill[]`
- **返回值**: `string`

### buildOracleSection()

- **定义位置**: 第254行
- **描述**: *ANTI-PATTERN (will produce poor results):**
- **参数**: `agents: AvailableAgent[]`
- **返回值**: `string`

### buildHardBlocksSection()

- **定义位置**: 第283行
- **描述**: *Exception**: This is the ONLY case where you announce before acting. For all other work, start immediately without status updates.
- **返回值**: `string`

### buildAntiPatternsSection()

- **定义位置**: 第298行
- **返回值**: `string`

### buildUltraworkSection()

- **定义位置**: 第314行
- **参数**: `agents: AvailableAgent[],
  categories: AvailableCategory[],
  skills: AvailableSkill[]`
- **返回值**: `string`

## 依赖关系

- `./types`

## 代码统计

- 接口数量: 4
- 类数量: 0
- 函数数量: 12
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 1

