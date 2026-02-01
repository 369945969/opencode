# glob/tools.ts

## 文件功能概述

Glob 工具的核心实现文件，提供基于 glob 模式的文件查找功能。支持多种后端实现，包括 ripgrep、find 和 PowerShell，并会自动安装 ripgrep 以获得最佳性能。

## 主要工具定义

### glob
文件模式匹配工具。

**描述**：
```
Fast file pattern matching tool with safety limits (60s timeout, 100 file limit).
Supports glob patterns like "**/*.js" or "src/**/*.ts".
Returns matching file paths sorted by modification time.
Use this tool when you need to find files by name patterns.
```

**参数**：
- `pattern: string` - glob 模式（必需）
  - 示例：`"**/*.ts"`、`"src/**/*.tsx"`、`"*.md"`
- `path?: string` - 搜索目录（可选，默认当前工作目录）

**返回**：`string` - 格式化的文件列表

**功能**：
- 自动检测并使用最佳可用的后端
- 优先使用 ripgrep（rg）
- 回退到系统 find 命令
- Windows 上回退到 PowerShell
- 自动下载安装 ripgrep（如果未安装）
- 结果按修改时间倒序排列
- 限制返回 100 个文件
- 60 秒超时保护

**代码逻辑**：
```typescript
export const glob: ToolDefinition = tool({
  description: "Fast file pattern matching tool...",
  args: {
    pattern: tool.schema.string().describe("The glob pattern to match files against"),
    path: tool.schema.string().optional().describe("The directory to search in")
  },
  execute: async (args) => {
    // 1. 解析 CLI（自动安装 ripgrep）
    const cli = await resolveGrepCliWithAutoInstall();
    
    // 2. 执行搜索
    const result = await runRgFiles({
      pattern: args.pattern,
      paths: args.path ? [args.path] : undefined
    }, cli);
    
    // 3. 格式化结果
    return formatGlobResult(result);
  }
});
```

## 代码逻辑流程

```
glob.execute(args)
├── resolveGrepCliWithAutoInstall()
│   ├── 检查已安装的 ripgrep
│   ├── 检查系统 rg 命令
│   └── 自动下载安装 ripgrep
├── runRgFiles(options, cli)
│   ├── 构建命令行参数
│   ├── 根据平台选择后端
│   │   ├── ripgrep: rg --files --glob=pattern
│   │   ├── Windows: PowerShell Get-ChildItem
│   │   └── Unix: find . -name pattern
│   ├── 执行命令
│   ├── 解析输出
│   ├── 获取文件修改时间
│   └── 按时间排序
└── formatGlobResult(result)
    ├── 格式化文件数量
    ├── 列出文件路径
    └── 添加截断提示（如有）
```

## 依赖关系

### 内部依赖
- `./cli` - CLI 执行（runRgFiles）
- `./constants` - 常量定义
- `./utils` - 结果格式化

### 外部依赖
- `@opencode-ai/plugin/tool` - OpenCode 插件工具 API

## 使用示例

```typescript
import { glob } from './tools';

// 查找所有 TypeScript 文件
const tsFiles = await glob.execute({ pattern: '**/*.ts' });

// 在 src 目录查找 React 组件
const components = await glob.execute({ 
  pattern: '**/*.tsx',
  path: './src'
});

// 查找文档
const docs = await glob.execute({ pattern: '**/*.md' });

// 查找测试文件
const tests = await glob.execute({ pattern: '**/*.test.ts' });
```

## 注意事项

1. **性能限制**：
   - 60 秒超时
   - 最多返回 100 个文件
   - 10MB 输出限制

2. **模式语法**：
   - `**` - 匹配任意层级目录
   - `*` - 匹配任意字符（不包括 /）
   - `?` - 匹配单个字符
   - `{}` - 匹配多个模式（如 `*.{ts,tsx}`）

3. **后端优先级**：
   - ripgrep（rg）- 最快，支持高级功能
   - find - Unix/Linux 系统标准工具
   - PowerShell - Windows 回退方案

4. **排序**：结果按修改时间倒序排列（最新的在前）

5. **自动安装**：如果未找到 ripgrep，会自动下载安装

6. **隐藏文件**：默认包含隐藏文件（以 . 开头）

