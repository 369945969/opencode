# manager.ts

## 文件信息

- **路径**: src/features/skill-mcp-manager/manager.ts
- **目录**: src/features/skill-mcp-manager
- **行数**: 618

## 文件功能

定义了 1 个类,提供相关的功能实现。

## 接口定义

### ManagedClientBase

- **定义位置**: 第19行
- **描述**: Connection type for a managed MCP client. - "stdio": Local process via stdin/stdout - "http": Remote server via HTTP (Streamable HTTP transport) /
- **属性**: client, lient, ient, ent, nt, t, skillName, killName, illName, llName

### ManagedStdioClient

- **定义位置**: 第26行
- **属性**: connectionType, onnectionType, nnectionType, nectionType, ectionType, ctionType, tionType, ionType, onType, nType

### ManagedHttpClient

- **定义位置**: 第31行
- **属性**: connectionType, onnectionType, nnectionType, nectionType, ectionType, ctionType, tionType, ionType, onType, nType

## 类定义

### SkillMcpManager

- **定义位置**: 第62行
- **方法**: Map, ap, p, getClientKey, etClientKey, tClientKey, ClientKey, lientKey, ientKey, entKey

## 函数定义

### getConnectionType()

- **定义位置**: 第42行
- **描述**: Determines connection type from MCP server configuration. Priority: explicit type field > url presence > command presence /
- **参数**: `config: ClaudeCodeMcpServer`
- **返回值**: `ConnectionType | null`

## 类型定义

- `ConnectionType`
- `ManagedClient`

## 依赖关系

- `@modelcontextprotocol/sdk/client/index.js`
- `@modelcontextprotocol/sdk/client/stdio.js`
- `@modelcontextprotocol/sdk/client/streamableHttp.js`
- `@modelcontextprotocol/sdk/types.js`
- `../claude-code-mcp-loader/types`
- `../claude-code-mcp-loader/env-expander`
- `../mcp-oauth/provider`
- `../mcp-oauth/step-up`
- `./env-cleaner`
- `./types`

## 代码统计

- 接口数量: 3
- 类数量: 1
- 函数数量: 1
- 常量数量: 0
- 类型定义数量: 2
- 导入模块数量: 10

