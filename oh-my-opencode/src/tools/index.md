# index.ts

## 文件信息

- **路径**: src/tools/index.ts
- **目录**: src/tools
- **行数**: 72

## 文件功能

这是模块的入口文件,统一导出本模块的所有公共 API。

## 函数定义

### createBackgroundTools()

- **定义位置**: 第49行
- **参数**: `manager: BackgroundManager, client: OpencodeClient`
- **返回值**: `Record<string, ToolDefinition>`

## 类型定义

- `OpencodeClient`

## 导出内容

```typescript
export { createSlashcommandTool, discoverCommandsSync };
export { sessionExists };
export { interactive_bash, startBackgroundCheck as startTmuxCheck };
export { createSkillTool };
export { createSkillMcpTool };
export { createCallOmoAgent };
export { createLookAt };
export { createDelegateTask };
```

## 依赖关系

- `./lsp`
- `./ast-grep`
- `./grep`
- `./glob`
- `./session-manager`
- `./background-task`
- `@opencode-ai/plugin`
- `../features/background-agent`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 1
- 常量数量: 0
- 类型定义数量: 1
- 导入模块数量: 8

