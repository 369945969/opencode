# constants.ts

## 文件信息

- **路径**: src/hooks/keyword-detector/constants.ts
- **目录**: src/hooks/keyword-detector
- **行数**: 499

## 文件功能

提供了 2 个函数/工具,用于实现特定功能。

## 函数定义

### isPlannerAgent()

- **定义位置**: 第132行
- **描述**: Determines if the agent is a planner-type agent. Planner agents should NOT be told to call plan agent (they ARE the planner). /
- **参数**: `agentName?: string`
- **返回值**: `boolean`

### getUltraworkMessage()

- **定义位置**: 第143行
- **描述**: Generates the ultrawork message based on agent context. Planner agents get context-gathering focused instructions. Other agents get the original strong agent utilization instructions. /
- **参数**: `agentName?: string`
- **返回值**: `string`

## 常量定义

### CODE_BLOCK_PATTERN

- **定义位置**: 第1行
- **值**: `/```[\s\S]*?```/g`

### INLINE_CODE_PATTERN

- **定义位置**: 第2行
- **值**: `/`[^`]+`/g`

### ULTRAWORK_PLANNER_SECTION

- **定义位置**: 第4行
- **值**: ``## CRITICAL: YOU ARE A PLANNER, NOT AN IMPLEMENTER`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 2
- 常量数量: 3
- 类型定义数量: 0
- 导入模块数量: 0

