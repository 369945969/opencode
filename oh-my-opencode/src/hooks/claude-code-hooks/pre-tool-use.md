# pre-tool-use.ts

## 文件信息

- **路径**: src/hooks/claude-code-hooks/pre-tool-use.ts
- **目录**: src/hooks/claude-code-hooks
- **行数**: 173

## 文件功能

提供了 2 个函数/工具,用于实现特定功能。

## 接口定义

### PreToolUseContext

- **定义位置**: 第11行
- **属性**: sessionId, essionId, ssionId, sionId, ionId, onId, nId, Id, d, toolName

### PreToolUseResult

- **定义位置**: 第21行
- **属性**: decision, ecision, cision, ision, sion, ion, on, n, reason, eason

## 函数定义

### buildInputLines()

- **定义位置**: 第36行
- **参数**: `toolInput: Record<string, unknown>`
- **返回值**: `string`

### executePreToolUseHooks()

- **定义位置**: 第46行
- **参数**: `ctx: PreToolUseContext,
  config: ClaudeHooksConfig | null,
  extendedConfig?: PluginExtendedConfig | null`
- **返回值**: `Promise<PreToolUseResult>`

## 依赖关系

- `./types`
- `../../shared`
- `./plugin-config`
- `./config-loader`

## 代码统计

- 接口数量: 2
- 类数量: 0
- 函数数量: 2
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 4

