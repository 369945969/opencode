# skill/types.ts

## 文件功能概述

Skill 工具的类型定义文件，定义了技能参数、技能信息、技能加载选项等核心类型。这些类型用于技能发现、加载和执行过程中的数据传递。

## 主要类型定义

### SkillArgs
技能执行参数接口。

```typescript
interface SkillArgs {
  name: string;  // 技能标识符（如 'code-review'）
}
```

### SkillInfo
技能信息接口，用于展示可用技能列表。

```typescript
interface SkillInfo {
  name: string;                    // 技能名称
  description: string;             // 技能描述
  location?: string;               // 文件位置（可选）
  scope: SkillScope;               // 作用域
  license?: string;                // 许可证（可选）
  compatibility?: string;          // 兼容性信息（可选）
  metadata?: Record<string, string>; // 元数据（可选）
  allowedTools?: string[];         // 允许的工具列表（可选）
}
```

### SkillLoadOptions
技能工具配置选项接口。

```typescript
interface SkillLoadOptions {
  /** 仅加载 OpenCode 路径的技能 */
  opencodeOnly?: boolean;
  /** 预合并的技能（跳过发现） */
  skills?: LoadedSkill[];
  /** MCP 管理器（用于查询技能嵌入的 MCP 服务器） */
  mcpManager?: SkillMcpManager;
  /** 会话 ID 获取器（用于 MCP 客户端标识） */
  getSessionID?: () => string;
  /** Git master 配置（用于水印/合著者设置） */
  gitMasterConfig?: GitMasterConfig;
}
```

## 依赖关系

### 内部依赖
- `../../features/opencode-skill-loader/types` - LoadedSkill, SkillScope 类型
- `../../features/skill-mcp-manager` - SkillMcpManager 类型
- `../../config/schema` - GitMasterConfig 类型

### 类型关系图

```
SkillArgs
└── name: string

SkillInfo
├── name: string
├── description: string
├── location?: string
├── scope: SkillScope
├── license?: string
├── compatibility?: string
├── metadata?: Record<string, string>
└── allowedTools?: string[]

SkillLoadOptions
├── opencodeOnly?: boolean
├── skills?: LoadedSkill[]
├── mcpManager?: SkillMcpManager
├── getSessionID?: () => string
└── gitMasterConfig?: GitMasterConfig
```

## 使用示例

```typescript
import type { SkillArgs, SkillInfo, SkillLoadOptions } from './types';
import type { LoadedSkill } from '../../features/opencode-skill-loader/types';
import type { SkillMcpManager } from '../../features/skill-mcp-manager';

// 执行参数
const args: SkillArgs = {
  name: 'code-review'
};

// 技能信息
const skillInfo: SkillInfo = {
  name: 'code-review',
  description: 'Review code for best practices',
  scope: 'builtin',
  location: '/path/to/code-review.md',
  allowedTools: ['read', 'grep', 'glob']
};

// 加载选项
const options: SkillLoadOptions = {
  skills: [],              // 预加载的技能
  mcpManager: manager,     // MCP 管理器
  getSessionID: () => 'session-123',
  gitMasterConfig: {
    watermark: 'Signed-off-by: User',
    coAuthors: ['Co-authored-by: Helper']
  }
};
```

## 注意事项

1. **SkillScope**：继承自 `../../features/opencode-skill-loader/types`
2. **LoadedSkill**：完整的技能定义，包含模板和配置
3. **MCP 集成**：可选的 MCP 管理器用于查询技能嵌入的服务器
4. **Git Master 配置**：仅当使用 git-master 技能时需要
5. **opencodeOnly**：用于限制仅从 OpenCode 路径加载技能
6. **allowedTools**：限制技能可用的工具集

