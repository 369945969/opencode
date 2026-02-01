# config.ts

## 文件信息

- **路径**: src/hooks/claude-code-hooks/config.ts
- **目录**: src/hooks/claude-code-hooks
- **行数**: 104

## 文件功能

提供了 5 个函数/工具,用于实现特定功能。

## 接口定义

### RawHookMatcher

- **定义位置**: 第6行
- **属性**: matcher, atcher, tcher, cher, her, er, r, pattern, attern, ttern

### RawClaudeHooksConfig

- **定义位置**: 第12行
- **属性**: PreToolUse, reToolUse, eToolUse, ToolUse, oolUse, olUse, lUse, Use, se, e

## 函数定义

### normalizeHookMatcher()

- **定义位置**: 第20行
- **参数**: `raw: RawHookMatcher`
- **返回值**: `HookMatcher`

### normalizeHooksConfig()

- **定义位置**: 第27行
- **参数**: `raw: RawClaudeHooksConfig`
- **返回值**: `ClaudeHooksConfig`

### getClaudeSettingsPaths()

- **定义位置**: 第46行
- **参数**: `customPath?: string`
- **返回值**: `string[]`

### mergeHooksConfig()

- **定义位置**: 第61行
- **参数**: `base: ClaudeHooksConfig,
  override: ClaudeHooksConfig`
- **返回值**: `ClaudeHooksConfig`

### loadClaudeHooksConfig()

- **定义位置**: 第81行
- **参数**: `customSettingsPath?: string`
- **返回值**: `Promise<ClaudeHooksConfig | null>`

## 依赖关系

- `path`
- `fs`
- `../../shared`
- `./types`

## 代码统计

- 接口数量: 2
- 类数量: 0
- 函数数量: 5
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 4

