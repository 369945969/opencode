# index.ts

## 文件信息

- **路径**: src/hooks/edit-error-recovery/index.ts
- **目录**: src/hooks/edit-error-recovery
- **行数**: 58

## 文件功能

这是模块的入口文件,统一导出本模块的所有公共 API。

## 函数定义

### createEditErrorRecoveryHook()

- **定义位置**: 第39行
- **描述**: - oldString and newString must be different (trying to "edit" to same content) - oldString not found (wrong assumption about file content) - oldString found multiple times (ambiguous match, need more context) /
- **参数**: `_ctx: PluginInput`

## 常量定义

### EDIT_ERROR_PATTERNS

- **定义位置**: 第6行
- **描述**: Known Edit tool error patterns that indicate the AI made a mistake /
- **值**: `[`

### EDIT_ERROR_REMINDER

- **定义位置**: 第16行
- **描述**: System reminder injected when Edit tool fails due to AI mistake Short, direct, and commanding - forces immediate corrective action /
- **值**: ```

## 依赖关系

- `@opencode-ai/plugin`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 1
- 常量数量: 2
- 类型定义数量: 0
- 导入模块数量: 1

