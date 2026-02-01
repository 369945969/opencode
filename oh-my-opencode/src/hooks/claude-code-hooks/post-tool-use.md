# post-tool-use.ts

## 文件信息

- **路径**: src/hooks/claude-code-hooks/post-tool-use.ts
- **目录**: src/hooks/claude-code-hooks
- **行数**: 200

## 文件功能

提供了 1 个函数/工具,用于实现特定功能。

## 接口定义

### PostToolUseClient

- **定义位置**: 第11行
- **属性**: session, ession, ssion, sion, ion, on, n

### PostToolUseContext

- **定义位置**: 第17行
- **属性**: sessionId, essionId, ssionId, sionId, ionId, onId, nId, Id, d, toolName

### PostToolUseResult

- **定义位置**: 第29行
- **属性**: block, lock, ock, ck, k, reason, eason, ason, son, on

## 函数定义

### executePostToolUseHooks()

- **定义位置**: 第44行
- **参数**: `ctx: PostToolUseContext,
  config: ClaudeHooksConfig | null,
  extendedConfig?: PluginExtendedConfig | null`
- **返回值**: `Promise<PostToolUseResult>`

## 依赖关系

- `./types`
- `../../shared`
- `./plugin-config`
- `./transcript`
- `./config-loader`

## 代码统计

- 接口数量: 3
- 类数量: 0
- 函数数量: 1
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 5

