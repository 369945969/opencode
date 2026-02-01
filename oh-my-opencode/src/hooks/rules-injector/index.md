# index.ts

## 文件信息

- **路径**: src/hooks/rules-injector/index.ts
- **目录**: src/hooks/rules-injector
- **行数**: 224

## 文件功能

这是模块的入口文件,统一导出本模块的所有公共 API。

## 接口定义

### ToolExecuteInput

- **定义位置**: 第20行
- **属性**: tool, ool, ol, l, sessionID, essionID, ssionID, sionID, ionID, onID

### ToolExecuteOutput

- **定义位置**: 第26行
- **属性**: title, itle, tle, le, e, output, utput, tput, put, ut

### ToolExecuteBeforeOutput

- **定义位置**: 第32行
- **属性**: args, rgs, gs, s

### BatchToolCall

- **定义位置**: 第36行
- **属性**: tool, ool, ol, l, parameters, arameters, rameters, ameters, meters, eters

### EventInput

- **定义位置**: 第41行
- **属性**: event, vent, ent, nt, t

### RuleToInject

- **定义位置**: 第48行
- **属性**: relativePath, elativePath, lativePath, ativePath, tivePath, ivePath, vePath, ePath, Path, ath

## 函数定义

### createRulesInjectorHook()

- **定义位置**: 第57行
- **参数**: `ctx: PluginInput`

## 常量定义

### TRACKED_TOOLS

- **定义位置**: 第55行
- **值**: `["read", "write", "edit", "multiedit"]`

## 依赖关系

- `@opencode-ai/plugin`
- `node:fs`
- `node:os`
- `node:path`
- `./finder`
- `./matcher`
- `./parser`
- `./storage`
- `../../shared/dynamic-truncator`

## 代码统计

- 接口数量: 6
- 类数量: 0
- 函数数量: 1
- 常量数量: 1
- 类型定义数量: 0
- 导入模块数量: 9

