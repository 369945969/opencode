# merger.ts

## 文件信息

- **路径**: src/features/opencode-skill-loader/merger.ts
- **目录**: src/features/opencode-skill-loader
- **行数**: 276

## 文件功能

提供了 8 个函数/工具,用于实现特定功能。

## 接口定义

### MergeSkillsOptions

- **定义位置**: 第191行
- **属性**: configDir, onfigDir, nfigDir, figDir, igDir, gDir, Dir, ir, r

## 函数定义

### parseAllowedToolsFromMetadata()

- **定义位置**: 第12行
- **参数**: `allowedTools: string | string[] | undefined`
- **返回值**: `string[] | undefined`

### builtinToLoaded()

- **定义位置**: 第29行
- **参数**: `builtin: BuiltinSkill`
- **返回值**: `LoadedSkill`

### resolveFilePath()

- **定义位置**: 第52行
- **参数**: `from: string, configDir?: string`
- **返回值**: `string`

### loadSkillFromFile()

- **定义位置**: 第71行
- **参数**: `filePath: string`

### configEntryToLoaded()

- **定义位置**: 第82行
- **参数**: `name: string,
  entry: SkillDefinition,
  configDir?: string`
- **返回值**: `LoadedSkill | null`

### normalizeConfig()

- **定义位置**: 第145行
- **参数**: `config: SkillsConfig | undefined`

### mergeSkillDefinitions()

- **定义位置**: 第163行
- **参数**: `base: LoadedSkill, patch: SkillDefinition`
- **返回值**: `LoadedSkill`

### mergeSkills()

- **定义位置**: 第195行
- **参数**: `builtinSkills: BuiltinSkill[],
  config: SkillsConfig | undefined,
  userClaudeSkills: LoadedSkill[],
  userOpencodeSkills: LoadedSkill[],
  projectClaudeSkills: LoadedSkill[],
  projectOpencodeSkills: LoadedSkill[],
  options: MergeSkillsOptions = {}`
- **返回值**: `LoadedSkill[]`

## 依赖关系

- `./types`
- `../../config/schema`
- `../builtin-skills/types`
- `../claude-code-command-loader/types`
- `fs`
- `path`
- `os`
- `../../shared/frontmatter`
- `../../shared/model-sanitizer`
- `../../shared/deep-merge`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 8
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 10

