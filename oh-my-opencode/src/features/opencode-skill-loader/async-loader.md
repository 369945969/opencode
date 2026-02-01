# async-loader.ts

## 文件信息

- **路径**: src/features/opencode-skill-loader/async-loader.ts
- **目录**: src/features/opencode-skill-loader
- **行数**: 188

## 文件功能

提供了 5 个函数/工具,用于实现特定功能。

## 函数定义

### parseSkillMcpConfigFromFrontmatter()

- **定义位置**: 第33行
- **参数**: `content: string`
- **返回值**: `SkillMcpConfig | undefined`

### loadMcpJsonFromDirAsync()

- **定义位置**: 第48行
- **参数**: `skillDir: string`
- **返回值**: `Promise<SkillMcpConfig | undefined>`

### loadSkillFromPathAsync()

- **定义位置**: 第73行
- **参数**: `skillPath: string,
  resolvedPath: string,
  defaultName: string,
  scope: SkillScope`
- **返回值**: `Promise<LoadedSkill | null>`

### parseAllowedTools()

- **定义位置**: 第131行
- **参数**: `allowedTools: string | string[] | undefined`
- **返回值**: `string[] | undefined`

### discoverSkillsInDirAsync()

- **定义位置**: 第143行
- **参数**: `skillsDir: string`
- **返回值**: `Promise<LoadedSkill[]>`

## 依赖关系

- `fs/promises`
- `fs`
- `path`
- `../../shared/frontmatter`
- `../../shared/model-sanitizer`
- `../../shared/file-utils`
- `../claude-code-command-loader/types`
- `./types`
- `../skill-mcp-manager/types`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 5
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 9

