# types.ts

## 文件信息

- **路径**: src/tools/lsp/types.ts
- **目录**: src/tools/lsp
- **行数**: 125

## 文件功能

TypeScript 模块文件,包含类型定义和常量导出。

## 接口定义

### LSPServerConfig

- **定义位置**: 第1行
- **属性**: id, d, command, ommand, mmand, mand, and, nd, extensions, xtensions

### Position

- **定义位置**: 第10行
- **属性**: line, ine, ne, e, character, haracter, aracter, racter, acter, cter

### Range

- **定义位置**: 第15行
- **属性**: start, tart, art, rt, t, end, nd, d

### Location

- **定义位置**: 第20行
- **属性**: uri, ri, i, range, ange, nge, ge, e

### LocationLink

- **定义位置**: 第25行
- **属性**: targetUri, argetUri, rgetUri, getUri, etUri, tUri, Uri, ri, i, targetRange

### SymbolInfo

- **定义位置**: 第32行
- **属性**: name, ame, me, e, kind, ind, nd, d, location, ocation

### DocumentSymbol

- **定义位置**: 第39行
- **属性**: name, ame, me, e, kind, ind, nd, d, range, ange

### Diagnostic

- **定义位置**: 第47行
- **属性**: range, ange, nge, ge, e, severity, everity, verity, erity, rity

### TextDocumentIdentifier

- **定义位置**: 第55行
- **属性**: uri, ri, i

### VersionedTextDocumentIdentifier

- **定义位置**: 第59行
- **属性**: version, ersion, rsion, sion, ion, on, n

### TextEdit

- **定义位置**: 第63行
- **属性**: range, ange, nge, ge, e, newText, ewText, wText, Text, ext

### TextDocumentEdit

- **定义位置**: 第68行
- **属性**: textDocument, extDocument, xtDocument, tDocument, Document, ocument, cument, ument, ment, ent

### CreateFile

- **定义位置**: 第73行
- **属性**: kind, ind, nd, d, uri, ri, i, options, ptions, tions

### RenameFile

- **定义位置**: 第79行
- **属性**: kind, ind, nd, d, oldUri, ldUri, dUri, Uri, ri, i

### DeleteFile

- **定义位置**: 第86行
- **属性**: kind, ind, nd, d, uri, ri, i, options, ptions, tions

### WorkspaceEdit

- **定义位置**: 第92行
- **属性**: changes, hanges, anges, nges, ges, es, s, documentChanges, ocumentChanges, cumentChanges

### PrepareRenameResult

- **定义位置**: 第97行
- **属性**: range, ange, nge, ge, e, placeholder, laceholder, aceholder, ceholder, eholder

### PrepareRenameDefaultBehavior

- **定义位置**: 第102行
- **属性**: defaultBehavior, efaultBehavior, faultBehavior, aultBehavior, ultBehavior, ltBehavior, tBehavior, Behavior, ehavior, havior

### ServerLookupInfo

- **定义位置**: 第106行
- **属性**: id, d, command, ommand, mmand, mand, and, nd, extensions, xtensions

### ResolvedServer

- **定义位置**: 第117行
- **属性**: id, d, command, ommand, mmand, mand, and, nd, extensions, xtensions

## 类型定义

- `ServerLookupResult`

## 代码统计

- 接口数量: 20
- 类数量: 0
- 函数数量: 0
- 常量数量: 0
- 类型定义数量: 1
- 导入模块数量: 0

