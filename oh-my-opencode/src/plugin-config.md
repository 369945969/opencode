# plugin-config.ts - 插件配置管理模块

## 文件概述

该模块负责 OhMyOpenCode 插件的配置加载、验证和合并。支持多级配置系统（用户级 + 项目级），使用 Zod 进行配置验证，支持 JSONC 格式（带注释的 JSON）。

## 核心功能

### 1. 配置加载流程

```
loadPluginConfig(directory, ctx)
├── 检测用户级配置文件
│   ├── 优先尝试 .jsonc 格式
│   └── 回退到 .json 格式
├── 检测项目级配置文件
│   ├── 优先尝试 .jsonc 格式
│   └── 回退到 .json 格式
├── 加载用户配置（作为基础）
├── 加载项目配置（覆盖用户配置）
└── 返回合并后的配置
```

### 2. 主要函数

#### 2.1 `loadConfigFromPath(configPath, ctx)`

从指定路径加载配置文件：

**流程：**
1. 检查文件是否存在
2. 读取文件内容
3. 使用 `parseJsonc` 解析 JSONC 格式（支持注释和尾随逗号）
4. 执行配置迁移 (`migrateConfigFile`)
5. 使用 Zod Schema 验证配置
6. 记录加载日志

**错误处理：**
- 文件不存在：返回 null
- 解析错误：记录错误并返回 null
- 验证错误：收集所有验证问题，记录详细错误信息

#### 2.2 `mergeConfigs(base, override)`

深度合并两个配置对象：

**合并策略：**

| 字段 | 合并方式 | 说明 |
|------|----------|------|
| 顶层字段 | 覆盖 | `override` 中的字段直接覆盖 `base` |
| `agents` | 深度合并 | 保留 base 中的代理配置，override 中的配置覆盖或新增 |
| `categories` | 深度合并 | 同上，用于代理分类配置 |
| `disabled_agents` | 集合合并 | 去重合并两个数组 |
| `disabled_mcps` | 集合合并 | 去重合并两个数组 |
| `disabled_hooks` | 集合合并 | 去重合并两个数组 |
| `disabled_commands` | 集合合并 | 去重合并两个数组 |
| `disabled_skills` | 集合合并 | 去重合并两个数组 |
| `claude_code` | 深度合并 | Claude Code 相关配置深度合并 |

**示例：**
```typescript
const base = {
  categories: {
    general: { model: "gpt-5.2", temperature: 0.5 },
    quick: { model: "claude-haiku" }
  },
  disabled_hooks: ["comment-checker"]
};

const override = {
  categories: {
    general: { temperature: 0.3 },  // 只覆盖 temperature
    visual: { model: "gemini-3" }   // 新增分类
  },
  disabled_hooks: ["think-mode"]   // 合并后两者都存在
};

// 结果：
// categories.general.model = "gpt-5.2" (保留)
// categories.general.temperature = 0.3 (覆盖)
// categories.quick = { model: "claude-haiku" } (保留)
// categories.visual = { model: "gemini-3" } (新增)
// disabled_hooks = ["comment-checker", "think-mode"] (合并去重)
```

#### 2.3 `loadPluginConfig(directory, ctx)`

主配置加载函数：

**配置路径优先级：**
1. 用户级：`~/.config/opencode/oh-my-opencode.jsonc` (或 .json)
2. 项目级：`<project>/.opencode/oh-my-opencode.jsonc` (或 .json)

**配置合并顺序：**
```
用户配置 (base)
    ↓ 合并
项目配置 (override)
    ↓
最终配置
```

**特性：**
- 自动检测配置文件格式（.jsonc 优先于 .json）
- 支持配置迁移（处理旧版本配置）
- 详细的日志记录
- 错误容错（部分配置加载失败不影响其他配置）

### 3. 配置验证

使用 Zod Schema (`OhMyOpenCodeConfigSchema`) 进行严格验证：

**验证错误处理：**
- 收集所有验证问题（不只是第一个）
- 格式化错误路径和消息
- 记录详细错误日志
- 返回 null 表示配置加载失败

**错误消息格式：**
```
path.to.field: error message
```

### 4. 依赖模块

- `./config` - Zod Schema 和类型定义
- `./shared` - 工具函数：
  - `log` - 日志记录
  - `deepMerge` - 深度合并
  - `getOpenCodeConfigDir` - 获取配置目录
  - `addConfigLoadError` - 添加配置加载错误
  - `parseJsonc` - 解析 JSONC
  - `detectConfigFile` - 检测配置文件
  - `migrateConfigFile` - 配置迁移

## 使用示例

```typescript
import { loadPluginConfig } from "./plugin-config";

// 加载插件配置
const config = loadPluginConfig("/path/to/project", ctx);

// 使用配置
console.log(config.agents);
console.log(config.disabled_hooks);
```

## 注意事项

1. **配置格式优先级** - 总是优先使用 .jsonc 格式
2. **项目配置覆盖用户配置** - 项目级配置具有更高优先级
3. **数组字段去重** - 所有 disabled_* 字段都会自动去重
4. **深度合并** - agents、categories、claude_code 使用深度合并
5. **错误隔离** - 单个配置文件加载失败不会影响其他配置
