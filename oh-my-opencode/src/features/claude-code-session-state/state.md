# state.ts

## 文件信息

- **路径**: src/features/claude-code-session-state/state.ts
- **目录**: src/features/claude-code-session-state
- **行数**: 39

## 文件功能

提供了 7 个函数/工具,用于实现特定功能。

## 函数定义

### setMainSession()

- **定义位置**: 第5行
- **参数**: `id: string | undefined`

### getMainSessionID()

- **定义位置**: 第9行
- **返回值**: `string | undefined`

### _resetForTesting()

- **定义位置**: 第14行

### setSessionAgent()

- **定义位置**: 第22行
- **参数**: `sessionID: string, agent: string`

### updateSessionAgent()

- **定义位置**: 第28行
- **参数**: `sessionID: string, agent: string`

### getSessionAgent()

- **定义位置**: 第32行
- **参数**: `sessionID: string`
- **返回值**: `string | undefined`

### clearSessionAgent()

- **定义位置**: 第36行
- **参数**: `sessionID: string`

## 常量定义

### subagentSessions

- **定义位置**: 第1行
- **值**: `new Set<string>()`

### sessionAgentMap

- **定义位置**: 第20行
- **值**: `new Map<string, string>()`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 7
- 常量数量: 2
- 类型定义数量: 0
- 导入模块数量: 0

