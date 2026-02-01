# oh-my-opencode Shared 模块

## 目录概述

`src/shared/` 目录包含 55 个跨平台、跨功能的共享工具模块，为整个 oh-my-opencode 插件提供基础功能支持。这些模块涵盖了字符串处理、文件操作、配置管理、模型解析、权限控制等多个方面。

## 模块分类

### 1. 命名与格式转换

| 文件 | 功能描述 |
|------|---------|
| [snake-case](./snake-case.md) | 驼峰命名与下划线命名相互转换，支持对象递归转换 |
| [tool-name](./tool-name.md) | 工具名称转换为 PascalCase 格式，支持特殊映射 |
| [case-insensitive](./case-insensitive.md) | 大小写不敏感的查找和比较工具 |

### 2. 配置与数据管理

| 文件 | 功能描述 |
|------|---------|
| [opencode-config-dir](./opencode-config-dir.md) | OpenCode 配置目录检测和管理（支持 CLI 和 Desktop） |
| [claude-config-dir](./claude-config-dir.md) | Claude Code 配置目录检测 |
| [data-path](./data-path.md) | 数据目录和缓存目录路径管理 |
| [jsonc-parser](./jsonc-parser.md) | JSONC（带注释的 JSON）解析器 |
| [frontmatter](./frontmatter.md) | YAML frontmatter 解析 |
| [deep-merge](./deep-merge.md) | 深度对象合并工具 |

### 3. 版本与兼容性

| 文件 | 功能描述 |
|------|---------|
| [opencode-version](./opencode-version.md) | OpenCode 版本检测和比较 |
| [migration](./migration.md) | 配置迁移工具（代理名、钩子名、模型配置） |
| [permission-compat](./permission-compat.md) | 权限系统兼容性工具 |

### 4. 模型与代理管理

| 文件 | 功能描述 |
|------|---------|
| [model-requirements](./model-requirements.md) | 代理模型需求定义（回退链配置） |
| [model-resolver](./model-resolver.md) | 模型选择解析（UI选择→配置→回退链→系统默认） |
| [model-availability](./model-availability.md) | 可用模型检测和模糊匹配 |
| [model-sanitizer](./model-sanitizer.md) | 模型字段清理 |
| [agent-variant](./agent-variant.md) | 代理变体（variant）解析 |
| [agent-tool-restrictions](./agent-tool-restrictions.md) | 代理工具限制配置 |
| [agent-display-names](./agent-display-names.md) | 代理显示名称映射 |

### 5. 会话与消息管理

| 文件 | 功能描述 |
|------|---------|
| [session-utils](./session-utils.md) | 会话目录管理和调用者检测 |
| [session-cursor](./session-cursor.md) | 会话消息游标管理（增量消息获取） |
| [first-message-variant](./first-message-variant.md) | 首消息变体控制 |
| [system-directive](./system-directive.md) | 系统指令前缀管理 |

### 6. 文件与压缩操作

| 文件 | 功能描述 |
|------|---------|
| [file-utils](./file-utils.md) | 文件工具（Markdown检测、符号链接处理） |
| [file-reference-resolver](./file-reference-resolver.md) | 文本中的文件引用解析和替换 |
| [zip-extractor](./zip-extractor.md) | 跨平台 ZIP 解压（支持 Windows tar/pwsh/powershell） |

### 7. Shell 与环境

| 文件 | 功能描述 |
|------|---------|
| [shell-env](./shell-env.md) | Shell 类型检测、转义和命令构建 |
| [command-executor](./command-executor.md) | 命令执行器（支持钩子命令、内嵌命令解析） |

### 8. Tmux 集成

| 文件 | 功能描述 |
|------|---------|
| [tmux/index](./tmux/index.md) | Tmux 模块入口（barrel export） |
| [tmux/types](./tmux/types.md) | Tmux 类型定义 |
| [tmux/constants](./tmux/constants.md) | Tmux 时间常量（轮询间隔、超时） |
| [tmux/tmux-utils](./tmux/tmux-utils.md) | Tmux 窗格管理（创建、关闭、替换、布局） |

### 9. 缓存与连接

| 文件 | 功能描述 |
|------|---------|
| [connected-providers-cache](./connected-providers-cache.md) | 连接提供商缓存管理 |

### 10. 内容处理

| 文件 | 功能描述 |
|------|---------|
| [dynamic-truncator](./dynamic-truncator.md) | 动态内容截断（基于上下文窗口） |
| [pattern-matcher](./pattern-matcher.md) | 工具名称模式匹配（支持通配符） |
| [ollama-ndjson-parser](./ollama-ndjson-parser.md) | Ollama NDJSON 响应解析 |

### 11. 配置与错误

| 文件 | 功能描述 |
|------|---------|
| [config-errors](./config-errors.md) | 配置加载错误收集 |
| [hook-disabled](./hook-disabled.md) | 钩子禁用状态检查 |
| [external-plugin-detector](./external-plugin-detector.md) | 外部插件冲突检测 |

### 12. 日志与工具

| 文件 | 功能描述 |
|------|---------|
| [logger](./logger.md) | 共享日志工具 |
| [index](./index.md) | 共享模块入口（barrel export） |

## 使用方式

### 统一导入

```typescript
// 从入口文件导入所有共享模块
import { 
  snakeCase,
  camelToSnake,
  objectToSnakeCase,
  getOpenCodeVersion,
  isVersionGte,
  parseFrontmatter,
  deepMerge,
  log
} from './shared';
```

### 分类导入

```typescript
// 按功能分类导入
import { transformToolName } from './shared/tool-name';
import { getOpenCodeConfigDir } from './shared/opencode-config-dir';
import { spawnTmuxPane } from './shared/tmux';
```

## 设计原则

1. **单一职责**: 每个模块专注于一个特定功能领域
2. **纯函数优先**: 尽可能使用纯函数，减少副作用
3. **类型安全**: 完整的 TypeScript 类型定义
4. **跨平台**: 支持 Windows、macOS、Linux
5. **向后兼容**: 提供迁移工具支持配置升级

## 依赖关系图

```
shared/
├── index.ts (统一导出)
├── logger.ts (被大多数模块依赖)
├── data-path.ts (基础路径)
├── case-insensitive.ts (工具函数)
└── tmux/
    ├── index.ts
    ├── types.ts
    ├── constants.ts
    └── tmux-utils.ts
```

## 注意事项

1. **循环依赖**: 避免模块间的循环依赖
2. **性能**: 注意大对象转换时的性能开销
3. **缓存**: 部分模块（如版本检测）使用缓存机制
4. **错误处理**: 统一使用 try-catch 和日志记录

## 文件统计

- **总文件数**: 55 个 TypeScript 文件
- **测试文件**: 25 个 `.test.ts` 文件
- **文档文件**: 55+ 个 `.md` 文件
- **核心模块**: 约 30 个非测试实现文件

---

*详细文档请查看各模块对应的 `.md` 文件*
