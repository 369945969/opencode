# build-schema.ts

## 功能概述

该脚本用于从 Zod Schema 自动生成 JSON Schema 文件，为 oh-my-opencode 插件提供配置验证的 JSON Schema 定义。

## 主要函数

### `main()`

**功能**: 主函数，负责生成 JSON Schema 文件

**流程**:
1. 使用 `z.toJSONSchema()` 将 Zod Schema 转换为 JSON Schema
2. 添加额外的元数据（$schema, $id, title, description）
3. 将生成的 Schema 写入文件

**输出**: `assets/oh-my-opencode.schema.json`

## 代码逻辑流程

```
开始
  ↓
导入 Zod Schema
  ↓
调用 z.toJSONSchema() 转换
  ↓
添加元数据（$schema, $id, title, description）
  ↓
写入文件 assets/oh-my-opencode.schema.json
  ↓
输出成功信息
  ↓
结束
```

## 使用示例

```bash
# 运行脚本生成 JSON Schema
bun script/build-schema.ts
```

## 依赖关系

- **zod**: 用于 Schema 定义和转换
- **../src/config/schema**: 源 Zod Schema 定义

## 注意事项

1. **目标版本**: 使用 JSON Schema Draft-7 标准
2. **输出路径**: 固定输出到 `assets/oh-my-opencode.schema.json`
3. **Shebang**: 使用 `#!/usr/bin/env bun` 指定 Bun 运行时
4. **元数据**: 生成的 Schema 包含完整的元数据信息，包括 ID、标题和描述

## 代码统计

- **行数**: 29
- **接口数量**: 0
- **类数量**: 0
- **函数数量**: 1
- **常量数量**: 1
- **导入模块数量**: 1

