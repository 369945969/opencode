# skill-mcp/index.ts

## 文件功能概述

Skill MCP 工具的入口文件，负责导出常量、类型定义和工具创建函数。该模块提供了调用技能嵌入的 MCP（Model Context Protocol）服务器的能力，允许技能扩展其功能通过外部 MCP 服务。

## 主要导出内容

### 常量
- `SKILL_MCP_TOOL_NAME` - 工具名称标识
- `SKILL_MCP_DESCRIPTION` - 工具描述

### 类型定义
- `SkillMcpArgs` - MCP 调用参数接口

### 函数
- `createSkillMcpTool` - 创建 MCP 工具实例

## 代码逻辑流程

```
index.ts
├── 从 constants.ts 导出常量
├── 从 types.ts 导出类型定义
└── 从 tools.ts 导出 createSkillMcpTool

使用流程：
1. 创建 MCP 工具实例（需要提供 manager 和技能列表）
2. 调用 MCP 操作（tool/resource/prompt）
3. 验证参数并查找对应的 MCP 服务器
4. 执行操作并返回结果
```

## 依赖关系

### 内部依赖
- `./constants` - 常量定义
- `./types` - 类型定义
- `./tools` - 工具实现

### 外部依赖
- `@opencode-ai/plugin` - OpenCode 插件 API
- `../../features/skill-mcp-manager` - MCP 管理器
- `../../features/opencode-skill-loader/types` - 技能类型

## 使用示例

```typescript
import { createSkillMcpTool, SKILL_MCP_TOOL_NAME } from './skill-mcp';
import type { SkillMcpManager } from '../../features/skill-mcp-manager';
import type { LoadedSkill } from '../../features/opencode-skill-loader/types';

// 创建 MCP 工具
const mcpTool = createSkillMcpTool({
  manager: mcpManager,
  getLoadedSkills: () => loadedSkills,
  getSessionID: () => 'session-123'
});

// 调用 MCP 工具
const result = await mcpTool.execute({
  mcp_name: 'sqlite',
  tool_name: 'query',
  arguments: { sql: 'SELECT * FROM users' }
});
```

## 注意事项

1. **MCP 服务器**：必须在技能配置中定义 mcpConfig
2. **互斥参数**：tool_name、resource_name、prompt_name 只能选一个
3. **参数格式**：arguments 可以是 JSON 字符串或对象
4. **错误处理**：连接失败会返回详细的错误信息
5. **会话标识**：getSessionID 用于 MCP 客户端识别

