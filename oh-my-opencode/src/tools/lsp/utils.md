# utils.ts

## 文件信息

- **路径**: src/tools/lsp/utils.ts
- **目录**: src/tools/lsp
- **行数**: 407

## 文件功能

提供了 16 个函数/工具,用于实现特定功能。

## 接口定义

### ApplyResult

- **定义位置**: 第270行
- **属性**: success, uccess, ccess, cess, ess, ss, s, filesModified, ilesModified, lesModified

## 函数定义

### findWorkspaceRoot()

- **定义位置**: 第21行
- **参数**: `filePath: string`
- **返回值**: `string`

### uriToPath()

- **定义位置**: 第44行
- **参数**: `uri: string`
- **返回值**: `string`

### formatServerLookupError()

- **定义位置**: 第48行
- **参数**: `result: Exclude<ServerLookupResult, { status: "found" }>`
- **返回值**: `string`

### formatLocation()

- **定义位置**: 第113行
- **参数**: `loc: Location | LocationLink`
- **返回值**: `string`

### formatSymbolKind()

- **定义位置**: 第127行
- **参数**: `kind: number`
- **返回值**: `string`

### formatSeverity()

- **定义位置**: 第131行
- **参数**: `severity: number | undefined`
- **返回值**: `string`

### formatDocumentSymbol()

- **定义位置**: 第136行
- **参数**: `symbol: DocumentSymbol, indent = 0`
- **返回值**: `string`

### formatSymbolInfo()

- **定义位置**: 第151行
- **参数**: `symbol: SymbolInfo`
- **返回值**: `string`

### formatDiagnostic()

- **定义位置**: 第158行
- **参数**: `diag: Diagnostic`
- **返回值**: `string`

### filterDiagnosticsBySeverity()

- **定义位置**: 第167行
- **参数**: `diagnostics: Diagnostic[],
  severityFilter?: "error" | "warning" | "information" | "hint" | "all"`
- **返回值**: `Diagnostic[]`

### formatPrepareRenameResult()

- **定义位置**: 第186行
- **参数**: `result: PrepareRenameResult | PrepareRenameDefaultBehavior | Range | null`
- **返回值**: `string`

### formatTextEdit()

- **定义位置**: 第218行
- **参数**: `edit: TextEdit`
- **返回值**: `string`

### formatWorkspaceEdit()

- **定义位置**: 第230行
- **参数**: `edit: WorkspaceEdit | null`
- **返回值**: `string`

### applyTextEditsToFile()

- **定义位置**: 第277行
- **参数**: `filePath: string, edits: TextEdit[]`

### applyWorkspaceEdit()

- **定义位置**: 第313行
- **参数**: `edit: WorkspaceEdit | null`
- **返回值**: `ApplyResult`

### formatApplyResult()

- **定义位置**: 第387行
- **参数**: `result: ApplyResult`
- **返回值**: `string`

## 依赖关系

- `path`
- `node:url`
- `fs`
- `./client`
- `./config`
- `./constants`
- `./types`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 16
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 7

