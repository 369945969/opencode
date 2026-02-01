# finder.ts

## 文件信息

- **路径**: src/hooks/rules-injector/finder.ts
- **目录**: src/hooks/rules-injector
- **行数**: 264

## 文件功能

提供了 7 个函数/工具,用于实现特定功能。

## 函数定义

### isGitHubInstructionsDir()

- **定义位置**: 第18行
- **参数**: `dir: string`
- **返回值**: `boolean`

### isValidRuleFile()

- **定义位置**: 第22行
- **参数**: `fileName: string, dir: string`
- **返回值**: `boolean`

### findProjectRoot()

- **定义位置**: 第36行
- **描述**: Find project root by walking up from startPath. Checks for PROJECT_MARKERS (.git, pyproject.toml, package.json, etc.) /
- **参数**: `startPath: string`
- **返回值**: `string | null`

### findRuleFilesRecursive()

- **定义位置**: 第68行
- **描述**: Recursively find all rule files (*.md, *.mdc) in a directory /
- **参数**: `dir: string, results: string[]`

### safeRealpathSync()

- **定义位置**: 第95行
- **描述**: Resolve symlinks safely with fallback to original path /
- **参数**: `filePath: string`
- **返回值**: `string`

### calculateDistance()

- **定义位置**: 第112行
- **描述**: /
- **参数**: `rulePath: string,
  currentFile: string,
  projectRoot: string | null,`
- **返回值**: `number`

### findRuleFiles()

- **定义位置**: 第168行
- **描述**: /
- **参数**: `projectRoot: string | null,
  homeDir: string,
  currentFile: string,`
- **返回值**: `RuleFileCandidate[]`

## 依赖关系

- `node:fs`
- `node:path`
- `./constants`
- `./types`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 7
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 4

