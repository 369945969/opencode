# index.ts

## 文件信息

- **路径**: src/hooks/auto-slash-command/index.ts
- **目录**: src/hooks/auto-slash-command
- **行数**: 90

## 文件功能

这是模块的入口文件,统一导出本模块的所有公共 API。

## 接口定义

### AutoSlashCommandHookOptions

- **定义位置**: 第24行
- **属性**: skills, kills, ills, lls, ls, s

## 函数定义

### createAutoSlashCommandHook()

- **定义位置**: 第28行
- **参数**: `options?: AutoSlashCommandHookOptions`

## 常量定义

### sessionProcessedCommands

- **定义位置**: 第22行
- **值**: `new Set<string>()`

## 导出内容

```typescript
export { * from "./detector"
export * from "./executor"
export * from "./constants"
export * };
```

## 依赖关系

- `./detector`
- `./executor`
- `../../shared`
- `./constants`
- `./types`
- `../../features/opencode-skill-loader`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 1
- 常量数量: 1
- 类型定义数量: 0
- 导入模块数量: 6

