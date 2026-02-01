# sisyphus.ts

## 文件信息

- **路径**: src/agents/sisyphus.ts
- **目录**: src/agents
- **行数**: 451

## 文件功能

提供了 2 个函数/工具,用于实现特定功能。

## 函数定义

### buildDynamicSisyphusPrompt()

- **定义位置**: 第17行
- **参数**: `availableAgents: AvailableAgent[],
  availableTools: AvailableTool[] = [],
  availableSkills: AvailableSkill[] = [],
  availableCategories: AvailableCategory[] = []`
- **返回值**: `string`

### createSisyphusAgent()

- **定义位置**: 第419行
- **参数**: `model: string,
  availableAgents?: AvailableAgent[],
  availableToolNames?: string[],
  availableSkills?: AvailableSkill[],
  availableCategories?: AvailableCategory[]`
- **返回值**: `AgentConfig`

## 依赖关系

- `@opencode-ai/sdk`
- `./types`
- `./dynamic-agent-prompt-builder`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 2
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 3

