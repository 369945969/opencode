# tools.test.ts

## 文件信息

- **路径**: src/tools/skill/tools.test.ts
- **目录**: src/tools/skill
- **行数**: 347

## 文件功能

这是一个测试文件,使用 Bun 测试框架编写。

## 函数定义

### createMockSkill()

- **定义位置**: 第23行
- **参数**: `name: string, options: { agent?: string } = {}`
- **返回值**: `LoadedSkill`

### createMockSkillWithMcp()

- **定义位置**: 第38行
- **参数**: `name: string, mcpServers: Record<string, unknown>`
- **返回值**: `LoadedSkill`

## 常量定义

### originalReadFileSync

- **定义位置**: 第8行
- **值**: `fs.readFileSync.bind(fs)`

### mockContext

- **定义位置**: 第53行
- **值**: `{`

## 依赖关系

- `bun:test`
- `./tools`
- `../../features/skill-mcp-manager`
- `../../features/opencode-skill-loader/types`
- `@modelcontextprotocol/sdk/types.js`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 2
- 常量数量: 2
- 类型定义数量: 0
- 导入模块数量: 5

