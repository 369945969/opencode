# index.ts

## 文件功能概述

该文件是 `shared` 模块的入口文件（barrel file），统一导出所有共享模块的公共 API。通过单一导入点可以访问所有共享功能。

## 导出内容

### 配置与数据
- `frontmatter` - YAML frontmatter 解析
- `command-executor` - 命令执行器
- `file-reference-resolver` - 文件引用解析
- `model-sanitizer` - 模型字段清理
- `logger` - 日志工具
- `snake-case` - 命名格式转换
- `tool-name` - 工具名称转换
- `pattern-matcher` - 模式匹配
- `hook-disabled` - 钩子禁用检查
- `deep-merge` - 深度合并
- `file-utils` - 文件工具
- `dynamic-truncator` - 动态截断
- `data-path` - 数据路径
- `config-errors` - 配置错误
- `claude-config-dir` - Claude 配置目录
- `jsonc-parser` - JSONC 解析
- `migration` - 配置迁移
- `opencode-config-dir` - OpenCode 配置目录
- `opencode-version` - 版本管理
- `permission-compat` - 权限兼容
- `external-plugin-detector` - 外部插件检测
- `zip-extractor` - ZIP 解压

### 代理与模型
- `agent-variant` - 代理变体
- `session-cursor` - 会话游标
- `shell-env` - Shell 环境
- `system-directive` - 系统指令
- `agent-tool-restrictions` - 工具限制
- `model-requirements` - 模型需求
- `model-resolver` - 模型解析
- `model-availability` - 模型可用性
- `connected-providers-cache` - 提供商缓存
- `case-insensitive` - 大小写不敏感工具
- `session-utils` - 会话工具
- `tmux` - Tmux 集成

## 使用示例

```typescript
// 从入口文件导入所有共享模块
import { 
  // 配置相关
  parseFrontmatter,
  parseJsonc,
  getOpenCodeConfigDir,
  
  // 模型相关
  resolveModel,
  fuzzyMatchModel,
  AGENT_MODEL_REQUIREMENTS,
  
  // 工具函数
  camelToSnake,
  objectToCamelCase,
  deepMerge,
  log,
  
  // 会话管理
  consumeNewMessages,
  isCallerOrchestrator,
  
  // Tmux
  spawnTmuxPane,
  isInsideTmux
} from './shared';

// 使用示例
const configDir = getOpenCodeConfigDir({ binary: 'opencode' });
const model = resolveModel({ userModel: 'gpt-4' });
log('Config loaded', { configDir, model });
```

## 依赖关系

该文件仅作为聚合导出，依赖关系由各个子模块自行管理。

## 注意事项

1. **Tree Shaking**: 使用 `export *` 可能影响某些打包工具的 tree shaking
2. **命名冲突**: 确保各子模块导出的名称不冲突
3. **按需导入**: 建议按需导入特定模块，避免导入未使用的功能
4. **循环依赖**: 注意避免通过入口文件导致的循环依赖
