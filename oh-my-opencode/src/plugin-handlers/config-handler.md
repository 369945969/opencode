# config-handler.ts

## 文件信息

- **路径**: src/plugin-handlers/config-handler.ts
- **目录**: src/plugin-handlers
- **行数**: 451

## 文件功能

提供了 2 个函数/工具,用于实现特定功能。

## 接口定义

### ConfigHandlerDeps

- **定义位置**: 第39行
- **属性**: ctx, tx, x, pluginConfig, luginConfig, uginConfig, ginConfig, inConfig, nConfig, Config

## 函数定义

### resolveCategoryConfig()

- **定义位置**: 第45行
- **参数**: `categoryName: string,
  userCategories?: Record<string, CategoryConfig>`
- **返回值**: `CategoryConfig | undefined`

### createConfigHandler()

- **定义位置**: 第52行
- **参数**: `deps: ConfigHandlerDeps`

## 依赖关系

- `../agents`
- `../agents/sisyphus-junior`
- `../features/claude-code-command-loader`
- `../features/builtin-commands`
- `../features/opencode-skill-loader`
- `../features/claude-code-agent-loader`
- `../features/claude-code-mcp-loader`
- `../features/claude-code-plugin-loader`
- `../mcp`
- `../config`
- `../shared`
- `../shared/opencode-config-dir`
- `../shared/permission-compat`
- `../shared/migration`
- `../shared/model-resolver`
- ... 还有 5 个依赖

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 2
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 20

