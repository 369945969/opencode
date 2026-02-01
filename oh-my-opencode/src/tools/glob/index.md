# glob/index.ts

## 文件功能概述

Glob 工具的入口文件，负责导出文件模式匹配工具。该模块提供了基于 glob 模式的快速文件查找功能，支持多种后端（ripgrep、find、PowerShell）。

## 主要导出内容

### 工具
- `glob` - 文件模式匹配工具实例

## 代码逻辑流程

```
index.ts
└── 从 tools.ts 导出 glob 工具

使用流程：
1. 提供 glob 模式（如 "**/*.ts"）
2. 可选指定搜索路径
3. 执行搜索
4. 返回匹配文件列表（按修改时间排序）
```

## 依赖关系

### 内部依赖
- `./tools` - 工具实现

### 外部依赖
- `@opencode-ai/plugin/tool` - OpenCode 插件工具 API

## 使用示例

```typescript
import { glob } from './glob';

// 查找所有 TypeScript 文件
const result = await glob.execute({ pattern: '**/*.ts' });

// 在特定目录搜索
const result = await glob.execute({ 
  pattern: '*.md',
  path: '/docs'
});
```

## 注意事项

1. **性能限制**：60 秒超时，最多返回 100 个文件
2. **排序**：结果按修改时间倒序排列
3. **后端选择**：优先使用 ripgrep，回退到 find/PowerShell
4. **模式语法**：支持标准 glob 模式（**, *, ?）

