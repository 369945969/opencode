# loader.ts

## 文件信息

- **路径**: src/features/opencode-skill-loader/loader.ts
- **目录**: src/features/opencode-skill-loader
- **行数**: 269

## 文件功能

提供了 17 个函数/工具,用于实现特定功能。

## 接口定义

### DiscoverSkillsOptions

- **定义位置**: 第209行
- **属性**: includeClaudeCodePaths, ncludeClaudeCodePaths, cludeClaudeCodePaths, ludeClaudeCodePaths, udeClaudeCodePaths, deClaudeCodePaths, eClaudeCodePaths, ClaudeCodePaths, laudeCodePaths, audeCodePaths

## 函数定义

### parseSkillMcpConfigFromFrontmatter()

- **定义位置**: 第13行
- **参数**: `content: string`
- **返回值**: `SkillMcpConfig | undefined`

### loadMcpJsonFromDir()

- **定义位置**: 第28行
- **参数**: `skillDir: string`
- **返回值**: `Promise<SkillMcpConfig | undefined>`

### parseAllowedTools()

- **定义位置**: 第53行
- **参数**: `allowedTools: string | string[] | undefined`
- **返回值**: `string[] | undefined`

### loadSkillFromPath()

- **定义位置**: 第65行
- **参数**: `skillPath: string,
  resolvedPath: string,
  defaultName: string,
  scope: SkillScope`
- **返回值**: `Promise<LoadedSkill | null>`

### loadSkillsFromDir()

- **定义位置**: 第131行
- **参数**: `skillsDir: string, scope: SkillScope`
- **返回值**: `Promise<LoadedSkill[]>`

### skillsToRecord()

- **定义位置**: 第175行
- **参数**: `skills: LoadedSkill[]`
- **返回值**: `Record<string, CommandDefinition>`

### loadUserSkills()

- **定义位置**: 第184行
- **返回值**: `Promise<Record<string, CommandDefinition>>`

### loadProjectSkills()

- **定义位置**: 第190行
- **返回值**: `Promise<Record<string, CommandDefinition>>`

### loadOpencodeGlobalSkills()

- **定义位置**: 第196行
- **返回值**: `Promise<Record<string, CommandDefinition>>`

### loadOpencodeProjectSkills()

- **定义位置**: 第203行
- **返回值**: `Promise<Record<string, CommandDefinition>>`

### discoverAllSkills()

- **定义位置**: 第213行
- **返回值**: `Promise<LoadedSkill[]>`

### discoverSkills()

- **定义位置**: 第224行
- **参数**: `options: DiscoverSkillsOptions = {}`
- **返回值**: `Promise<LoadedSkill[]>`

### getSkillByName()

- **定义位置**: 第244行
- **参数**: `name: string, options: DiscoverSkillsOptions = {}`
- **返回值**: `Promise<LoadedSkill | undefined>`

### discoverUserClaudeSkills()

- **定义位置**: 第249行
- **返回值**: `Promise<LoadedSkill[]>`

### discoverProjectClaudeSkills()

- **定义位置**: 第254行
- **返回值**: `Promise<LoadedSkill[]>`

### discoverOpencodeGlobalSkills()

- **定义位置**: 第259行
- **返回值**: `Promise<LoadedSkill[]>`

### discoverOpencodeProjectSkills()

- **定义位置**: 第265行
- **返回值**: `Promise<LoadedSkill[]>`

## 依赖关系

- `fs`
- `path`
- `../../shared/frontmatter`
- `../../shared/model-sanitizer`
- `../../shared/file-utils`
- `../../shared`
- `../../shared/opencode-config-dir`
- `../claude-code-command-loader/types`
- `./types`
- `../skill-mcp-manager/types`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 17
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 10

