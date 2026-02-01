# metis.ts

## 文件信息

- **路径**: src/agents/metis.ts
- **目录**: src/agents
- **行数**: 345

## 文件功能

提供了 1 个函数/工具,用于实现特定功能。

## 函数定义

### createMetisAgent()

- **定义位置**: 第310行
- **参数**: `model: string`
- **返回值**: `AgentConfig`

## 常量定义

### METIS_SYSTEM_PROMPT

- **定义位置**: 第19行
- **描述**: - Detect ambiguities that could derail implementation - Flag potential AI-slop patterns (over-engineering, scope creep) - Generate clarifying questions for the user - Prepare directives for the planner agent /
- **值**: ``# Metis - Pre-Planning Consultant`

### metisRestrictions

- **定义位置**: 第303行
- **值**: `createAgentToolRestrictions([`

## 依赖关系

- `@opencode-ai/sdk`
- `./types`
- `../shared/permission-compat`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 1
- 常量数量: 2
- 类型定义数量: 0
- 导入模块数量: 3

