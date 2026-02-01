# index.ts

## 文件信息

- **路径**: src/hooks/non-interactive-env/index.ts
- **目录**: src/hooks/non-interactive-env
- **行数**: 68

## 文件功能

这是模块的入口文件,统一导出本模块的所有公共 API。

## 函数定义

### detectBannedCommand()

- **定义位置**: 第15行
- **参数**: `command: string`
- **返回值**: `string | undefined`

### createNonInteractiveEnvHook()

- **定义位置**: 第24行
- **参数**: `_ctx: PluginInput`

## 常量定义

### BANNED_COMMAND_PATTERNS

- **定义位置**: 第11行
- **值**: `SHELL_COMMAND_PATTERNS.banned`

## 导出内容

```typescript
export { * from "./constants"
export * from "./detector"
export * };
```

## 依赖关系

- `@opencode-ai/plugin`
- `../../shared`
- `./constants`
- `./detector`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 2
- 常量数量: 1
- 类型定义数量: 0
- 导入模块数量: 4

