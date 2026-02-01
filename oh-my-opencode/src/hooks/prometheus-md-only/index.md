# index.ts

## 文件信息

- **路径**: src/hooks/prometheus-md-only/index.ts
- **目录**: src/hooks/prometheus-md-only
- **行数**: 149

## 文件功能

这是模块的入口文件,统一导出本模块的所有公共 API。

## 函数定义

### isAllowedFile()

- **定义位置**: 第22行
- **描述**: - Windows backslashes (e.g., .sisyphus\\plans\\x.md) - Mixed separators (e.g., .sisyphus\\plans/x.md) - Case-insensitive directory/extension matching - Workspace confinement (blocks paths outside root or via traversal) - Nested project paths (e.g., parent/.sisyphus/... when ctx.directory is parent) /
- **参数**: `filePath: string, workspaceRoot: string`
- **返回值**: `boolean`

### getMessageDir()

- **定义位置**: 第51行
- **参数**: `sessionID: string`
- **返回值**: `string | null`

### getAgentFromMessageFiles()

- **定义位置**: 第67行
- **参数**: `sessionID: string`
- **返回值**: `string | undefined`

### getAgentFromSession()

- **定义位置**: 第73行
- **参数**: `sessionID: string`
- **返回值**: `string | undefined`

### createPrometheusMdOnlyHook()

- **定义位置**: 第77行
- **参数**: `ctx: PluginInput`

## 常量定义

### TASK_TOOLS

- **定义位置**: 第65行
- **值**: `["delegate_task", "task", "call_omo_agent"]`

## 导出内容

```typescript
export { * };
```

## 依赖关系

- `@opencode-ai/plugin`
- `node:fs`
- `node:path`
- `./constants`
- `../../features/hook-message-injector`
- `../../features/claude-code-session-state`
- `../../shared/logger`
- `../../shared/system-directive`
- `../../shared/agent-display-names`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 5
- 常量数量: 1
- 类型定义数量: 0
- 导入模块数量: 9

