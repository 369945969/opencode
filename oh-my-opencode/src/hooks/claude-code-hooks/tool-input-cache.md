# tool-input-cache.ts

## 文件信息

- **路径**: src/hooks/claude-code-hooks/tool-input-cache.ts
- **目录**: src/hooks/claude-code-hooks
- **行数**: 48

## 文件功能

提供了 2 个函数/工具,用于实现特定功能。

## 接口定义

### CacheEntry

- **定义位置**: 第5行
- **描述**: Caches tool_input from PreToolUse for PostToolUse /
- **属性**: toolInput, oolInput, olInput, lInput, Input, nput, put, ut, t, timestamp

## 函数定义

### cacheToolInput()

- **定义位置**: 第14行
- **参数**: `sessionId: string,
  toolName: string,
  invocationId: string,
  toolInput: Record<string, unknown>`

### getToolInput()

- **定义位置**: 第24行
- **参数**: `sessionId: string,
  toolName: string,
  invocationId: string`
- **返回值**: `Record<string, unknown> | null`

## 常量定义

### cache

- **定义位置**: 第10行
- **值**: `new Map<string, CacheEntry>()`

### CACHE_TTL

- **定义位置**: 第12行
- **值**: `60000 // 1 minute`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 2
- 常量数量: 2
- 类型定义数量: 0
- 导入模块数量: 0

