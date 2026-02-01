# skill-content.ts

## 文件信息

- **路径**: src/features/opencode-skill-loader/skill-content.ts
- **目录**: src/features/opencode-skill-loader
- **行数**: 211

## 文件功能

提供了 8 个函数/工具,用于实现特定功能。

## 接口定义

### SkillResolutionOptions

- **定义位置**: 第8行
- **属性**: gitMasterConfig, itMasterConfig, tMasterConfig, MasterConfig, asterConfig, sterConfig, terConfig, erConfig, rConfig, Config

## 函数定义

### clearSkillCache()

- **定义位置**: 第15行

### getAllSkills()

- **定义位置**: 第19行
- **参数**: `options?: SkillResolutionOptions`
- **返回值**: `Promise<LoadedSkill[]>`

### extractSkillTemplate()

- **定义位置**: 第55行
- **参数**: `skill: LoadedSkill`
- **返回值**: `Promise<string>`

### injectGitMasterConfig()

- **定义位置**: 第66行
- **参数**: `template: string, config?: GitMasterConfig`
- **返回值**: `string`

### resolveSkillContent()

- **定义位置**: 第124行
- **参数**: `skillName: string, options?: SkillResolutionOptions`
- **返回值**: `string | null`

### resolveMultipleSkills()

- **定义位置**: 第136行
- **参数**: `skillNames: string[], options?: SkillResolutionOptions`

### resolveSkillContentAsync()

- **定义位置**: 第162行
- **参数**: `skillName: string,
	options?: SkillResolutionOptions`
- **返回值**: `Promise<string | null>`

### resolveMultipleSkillsAsync()

- **定义位置**: 第179行
- **参数**: `skillNames: string[],
	options?: SkillResolutionOptions`
- **返回值**: `Promise<`

## 常量定义

### cachedSkillsByProvider

- **定义位置**: 第13行
- **值**: `new Map<string, LoadedSkill[]>()`

## 依赖关系

- `../builtin-skills/skills`
- `./loader`
- `./types`
- `../../shared/frontmatter`
- `node:fs`
- `../../config/schema`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 8
- 常量数量: 1
- 类型定义数量: 0
- 导入模块数量: 6

