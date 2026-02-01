# config-loader.ts

## 文件信息

- **路径**: src/hooks/claude-code-hooks/config-loader.ts
- **目录**: src/hooks/claude-code-hooks
- **行数**: 108

## 文件功能

提供了 6 个函数/工具,用于实现特定功能。

## 接口定义

### DisabledHooksConfig

- **定义位置**: 第7行
- **属性**: Stop, top, op, p, PreToolUse, reToolUse, eToolUse, ToolUse, oolUse, olUse

### PluginExtendedConfig

- **定义位置**: 第15行
- **属性**: disabledHooks, isabledHooks, sabledHooks, abledHooks, bledHooks, ledHooks, edHooks, dHooks, Hooks, ooks

## 函数定义

### getProjectConfigPath()

- **定义位置**: 第21行
- **返回值**: `string`

### loadConfigFromPath()

- **定义位置**: 第25行
- **参数**: `path: string`
- **返回值**: `Promise<PluginExtendedConfig | null>`

### mergeDisabledHooks()

- **定义位置**: 第39行
- **参数**: `base: DisabledHooksConfig | undefined,
  override: DisabledHooksConfig | undefined`
- **返回值**: `DisabledHooksConfig`

### loadPluginExtendedConfig()

- **定义位置**: 第55行
- **返回值**: `Promise<PluginExtendedConfig>`

### getRegex()

- **定义位置**: 第79行
- **参数**: `pattern: string`
- **返回值**: `RegExp`

### isHookCommandDisabled()

- **定义位置**: 第93行
- **参数**: `eventType: ClaudeHookEvent,
  command: string,
  config: PluginExtendedConfig | null`
- **返回值**: `boolean`

## 常量定义

### USER_CONFIG_PATH

- **定义位置**: 第19行
- **值**: `join(getOpenCodeConfigDir({ binary: "opencode" }), "opencode-cc-plugin.json")`

### regexCache

- **定义位置**: 第77行
- **值**: `new Map<string, RegExp>()`

## 依赖关系

- `fs`
- `path`
- `./types`
- `../../shared/logger`
- `../../shared`

## 代码统计

- 接口数量: 2
- 类数量: 0
- 函数数量: 6
- 常量数量: 2
- 类型定义数量: 0
- 导入模块数量: 5

