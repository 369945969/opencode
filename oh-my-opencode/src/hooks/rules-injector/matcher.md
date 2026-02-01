# matcher.ts

## 文件信息

- **路径**: src/hooks/rules-injector/matcher.ts
- **目录**: src/hooks/rules-injector
- **行数**: 64

## 文件功能

提供了 4 个函数/工具,用于实现特定功能。

## 接口定义

### MatchResult

- **定义位置**: 第6行
- **属性**: applies, pplies, plies, lies, ies, es, s, reason, eason, ason

## 函数定义

### shouldApplyRule()

- **定义位置**: 第14行
- **描述**: Check if a rule should apply to the current file based on metadata /
- **参数**: `metadata: RuleMetadata,
  currentFilePath: string,
  projectRoot: string | null`
- **返回值**: `MatchResult`

### isDuplicateByRealPath()

- **定义位置**: 第47行
- **描述**: Check if realPath already exists in cache (symlink deduplication) /
- **参数**: `realPath: string, cache: Set<string>`
- **返回值**: `boolean`

### createContentHash()

- **定义位置**: 第54行
- **描述**: Create SHA-256 hash of content, truncated to 16 chars /
- **参数**: `content: string`
- **返回值**: `string`

### isDuplicateByContentHash()

- **定义位置**: 第61行
- **描述**: Check if content hash already exists in cache /
- **参数**: `hash: string, cache: Set<string>`
- **返回值**: `boolean`

## 依赖关系

- `crypto`
- `node:path`
- `./types`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 4
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 3

