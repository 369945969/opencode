# build-schema.ts

## 文件功能

从 Zod 配置模式生成 JSON Schema 的脚本,用于配置验证和 IDE 自动补全。

## 核心功能

### 模式生成流程
1. 导入 Zod 配置模式 (`OhMyOpenCodeConfigSchema`)
2. 使用 `z.toJSONSchema` 转换为 JSON Schema
3. 添加元数据($schema、$id、title、description)
4. 写入到指定路径

## 输出配置

```typescript
const SCHEMA_OUTPUT_PATH = "assets/oh-my-opencode.schema.json";
```

### 生成的 Schema 结构
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  "title": "Oh My OpenCode Configuration",
  "description": "Configuration schema for oh-my-opencode plugin",
  // ... Zod 模式转换的内容
}
```

## 使用方式

```bash
# 生成 JSON Schema
bun run script/build-schema.ts

# 或在 package.json 中定义脚本
bun run build:schema
```

## 依赖关系

- `zod`: 模式定义和转换
- `../src/config/schema`: 配置模式定义

## 集成用途

生成的 JSON Schema 用于:
1. **配置验证**: 验证用户配置文件的正确性
2. **IDE 支持**: 提供 JSON/JSONC 文件的自动补全和验证
3. **文档**: 作为配置选项的参考文档
