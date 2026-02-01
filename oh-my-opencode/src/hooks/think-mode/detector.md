# detector.ts

## 文件信息

- **路径**: src/hooks/think-mode/detector.ts
- **目录**: src/hooks/think-mode
- **行数**: 58

## 文件功能

提供了 3 个函数/工具,用于实现特定功能。

## 函数定义

### removeCodeBlocks()

- **定义位置**: 第41行
- **参数**: `text: string`
- **返回值**: `string`

### detectThinkKeyword()

- **定义位置**: 第45行
- **参数**: `text: string`
- **返回值**: `boolean`

### extractPromptText()

- **定义位置**: 第50行
- **参数**: `parts: Array<{ type: string; text?: string }>`
- **返回值**: `string`

## 常量定义

### ENGLISH_PATTERNS

- **定义位置**: 第1行
- **值**: `[/\bultrathink\b/i, /\bthink\b/i]`

### MULTILINGUAL_KEYWORDS

- **定义位置**: 第3行
- **值**: `[`

### MULTILINGUAL_PATTERNS

- **定义位置**: 第35行
- **值**: `MULTILINGUAL_KEYWORDS.map((kw) => new RegExp(kw, "i"))`

### THINK_PATTERNS

- **定义位置**: 第36行
- **值**: `[...ENGLISH_PATTERNS, ...MULTILINGUAL_PATTERNS]`

### CODE_BLOCK_PATTERN

- **定义位置**: 第38行
- **值**: `/```[\s\S]*?```/g`

### INLINE_CODE_PATTERN

- **定义位置**: 第39行
- **值**: `/`[^`]+`/g`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 3
- 常量数量: 6
- 类型定义数量: 0
- 导入模块数量: 0

