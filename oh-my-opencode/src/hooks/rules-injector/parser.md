# parser.ts

## 文件信息

- **路径**: src/hooks/rules-injector/parser.ts
- **目录**: src/hooks/rules-injector
- **行数**: 212

## 文件功能

提供了 6 个函数/工具,用于实现特定功能。

## 接口定义

### RuleFrontmatterResult

- **定义位置**: 第3行
- **属性**: metadata, etadata, tadata, adata, data, ata, ta, a, body, ody

## 函数定义

### parseRuleFrontmatter()

- **定义位置**: 第20行
- **描述**: globs: - "**\/*.py" - "src/**\/*.ts" - Comma-separated: globs: "**\/*.py, src/**\/*.ts" - Claude Code 'paths' field (alias for globs) /
- **参数**: `content: string`
- **返回值**: `RuleFrontmatterResult`

### parseYamlContent()

- **定义位置**: 第42行
- **描述**: Parse YAML content without external library /
- **参数**: `yamlContent: string`
- **返回值**: `RuleMetadata`

### parseStringValue()

- **定义位置**: 第84行
- **描述**: Parse a string value, removing surrounding quotes /
- **参数**: `value: string`
- **返回值**: `string`

### parseArrayOrStringValue()

- **定义位置**: 第102行
- **描述**: Parse array or string value from YAML Returns the parsed value and number of lines consumed /
- **参数**: `rawValue: string,
  lines: string[],
  currentIndex: number`

### parseInlineArray()

- **定义位置**: 第159行
- **描述**: Parse inline JSON-like array: ["a", "b", "c"] /
- **参数**: `value: string`
- **返回值**: `string[]`

### mergeGlobs()

- **定义位置**: 第201行
- **描述**: Merge two globs values (for combining paths and globs) /
- **参数**: `existing: string | string[] | undefined,
  newValue: string | string[]`
- **返回值**: `string | string[]`

## 依赖关系

- `./types`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 6
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 1

