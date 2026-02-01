# utils.ts

## 文件信息

- **路径**: src/agents/utils.ts
- **目录**: src/agents
- **行数**: 359

## 文件功能

提供了 7 个函数/工具,用于实现特定功能。

## 函数定义

### isFactory()

- **定义位置**: 第46行
- **参数**: `source: AgentSource`
- **返回值**: `source is AgentFactory`

### buildAgent()

- **定义位置**: 第50行
- **参数**: `source: AgentSource,
  model: string,
  categories?: CategoriesConfig,
  gitMasterConfig?: GitMasterConfig,
  browserProvider?: BrowserAutomationProvider`
- **返回值**: `AgentConfig`

### createEnvContext()

- **定义位置**: 第95行
- **描述**: Creates OmO-specific environment context (time, timezone, locale). Note: Working directory, platform, and date are already provided by OpenCode's system.ts, so we only include fields that OpenCode doesn't provide to avoid duplication. See: https://github.com/code-yeongyu/oh-my-opencode/issues/379 /
- **返回值**: `string`

### applyCategoryOverride()

- **定义位置**: 第129行
- **描述**: Expands a category reference from an agent override into concrete config properties. Category properties are applied unconditionally (overwriting factory defaults), because the user's chosen category should take priority over factory base values. Direct override properties applied later via mergeAgentConfig() will supersede these. /
- **参数**: `config: AgentConfig,
  categoryName: string,
  mergedCategories: Record<string, CategoryConfig>`
- **返回值**: `AgentConfig`

### mergeAgentConfig()

- **定义位置**: 第150行
- **参数**: `base: AgentConfig,
  override: AgentOverrideConfig`
- **返回值**: `AgentConfig`

### mapScopeToLocation()

- **定义位置**: 第164行
- **参数**: `scope: SkillScope`
- **返回值**: `AvailableSkill["location"]`

### createBuiltinAgents()

- **定义位置**: 第170行
- **参数**: `disabledAgents: string[] = [],
  agentOverrides: AgentOverrides = {},
  directory?: string,
  systemDefaultModel?: string,
  categories?: CategoriesConfig,
  gitMasterConfig?: GitMasterConfig,
  discoveredSkills: LoadedSkill[] = [],
  client?: any,
  browserProvider?: BrowserAutomationProvider,
  uiSelectedModel?: string`
- **返回值**: `Promise<Record<string, AgentConfig>>`

## 类型定义

- `AgentSource`

## 依赖关系

- `@opencode-ai/sdk`
- `./types`
- `../config/schema`
- `./sisyphus`
- `./oracle`
- `./librarian`
- `./explore`
- `./multimodal-looker`
- `./metis`
- `./atlas`
- `./momus`
- `./dynamic-agent-prompt-builder`
- `../shared`
- `../tools/delegate-task/constants`
- `../features/opencode-skill-loader/skill-content`
- ... 还有 2 个依赖

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 7
- 常量数量: 0
- 类型定义数量: 1
- 导入模块数量: 17

