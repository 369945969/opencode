# loader.test.ts

## 文件信息

- **路径**: src/features/opencode-skill-loader/loader.test.ts
- **目录**: src/features/opencode-skill-loader
- **行数**: 391

## 文件功能

这是一个测试文件,使用 Bun 测试框架编写。

## 函数定义

### createTestSkill()

- **定义位置**: 第9行
- **参数**: `name: string, content: string, mcpJson?: object`
- **返回值**: `string`

## 常量定义

### TEST_DIR

- **定义位置**: 第6行
- **值**: `join(tmpdir(), "skill-loader-test-" + Date.now())`

### SKILLS_DIR

- **定义位置**: 第7行
- **值**: `join(TEST_DIR, ".opencode", "skills")`

## 依赖关系

- `bun:test`
- `fs`
- `path`
- `os`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 1
- 常量数量: 2
- 类型定义数量: 0
- 导入模块数量: 4

