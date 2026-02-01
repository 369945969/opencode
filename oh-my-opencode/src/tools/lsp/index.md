# index.ts

## 文件信息

- **路径**: src/tools/lsp/index.ts
- **目录**: src/tools/lsp
- **行数**: 8

## 文件功能

这是模块的入口文件,统一导出本模块的所有公共 API。

## 导出内容

```typescript
export { * from "./types"
export * from "./constants"
export * from "./config"
export * from "./client"
export * from "./utils"
// NOTE: lsp_servers removed - duplicates OpenCode's built-in LspServers
export { lsp_goto_definition, lsp_find_references, lsp_symbols, lsp_diagnostics, lsp_prepare_rename, lsp_rename };
```

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 0
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 0

