# skill/index.ts

## 文件功能概述

Skill 工具的入口文件，负责导出技能相关的常量、类型定义和工具实现。该模块提供了技能发现、加载和执行的功能，允许 AI 代理使用预定义的技能模板来完成特定任务。

## 主要导出内容

### 常量
- `TOOL_NAME` - 工具名称标识
- `TOOL_DESCRIPTION_NO_SKILLS` - 无可用技能时的描述
- `TOOL_DESCRIPTION_PREFIX` - 工具描述前缀

### 类型定义
- `SkillArgs` - 技能参数接口
- `SkillInfo` - 技能信息接口
- `SkillLoadOptions` - 技能加载选项

### 函数/类
- `skill` - 默认的技能工具实例
- `createSkillTool` - 创建自定义配置的技能工具

## 代码逻辑流程

```
index.ts
├── 从 constants.ts 导出常量
├── 从 types.ts 导出类型定义
└── 从 tools.ts 导出核心函数
    ├── skill (默认实例)
    └── createSkillTool() - 创建工具

使用流程：
1. 发现所有可用技能
2. 构建工具描述（包含技能列表）
3. 执行时根据名称查找技能
4. 返回技能内容和元数据
```

## 依赖关系

### 内部依赖
- `./constants` - 常量定义
- `./types` - 类型定义
- `./tools` - 工具实现

### 外部依赖
- `@opencode-ai/plugin` - OpenCode 插件 API
- `../../features/opencode-skill-loader` - 技能加载器
- `../../features/skill-mcp-manager` - MCP 管理器

## 使用示例

```typescript
import { skill, createSkillTool } from './skill';

// 使用默认实例
const result = await skill.execute({ name: 'code-review' });

// 创建自定义工具
const customTool = createSkillTool({
  skills: [...],           // 预加载技能
  mcpManager: manager,     // MCP 管理器
  getSessionID: () => id,  // 会话 ID 获取器
  gitMasterConfig: config  // Git 配置
});

// 执行技能
const skillContent = await customTool.execute({ name: 'git-master' });
```

## 注意事项

1. **技能名称**：执行时必须提供准确的技能名称
2. **MCP 集成**：支持技能嵌入的 MCP 服务器查询
3. **Git Master 特殊处理**：自动注入 Git 配置
4. **权限检查**：某些技能可能有代理限制
5. **懒加载**：支持延迟加载技能内容以优化性能

