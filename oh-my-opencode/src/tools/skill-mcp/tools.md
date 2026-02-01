# skill-mcp/tools.ts

## 文件功能概述

Skill MCP 工具的核心实现文件，提供调用技能嵌入的 MCP（Model Context Protocol）服务器功能。支持调用 MCP 工具、读取资源和获取提示。

## 主要函数/类

### validateOperationParams(args)
验证操作参数
- **参数**：`args: SkillMcpArgs` - MCP 调用参数
- **返回**：`OperationType` - 操作类型（tool/resource/prompt）
- **验证逻辑**：
  1. 检查是否提供了至少一个操作参数
  2. 检查是否只提供了一个操作参数（互斥）
  3. 返回操作类型和名称

### findMcpServer(mcpName, skills)
在技能列表中查找 MCP 服务器
- **参数**：
  - `mcpName: string` - MCP 服务器名称
  - `skills: LoadedSkill[]` - 技能列表
- **返回**：`{ skill, config } | null` - 找到的服务器配置
- **逻辑**：遍历所有技能的 mcpConfig 查找匹配的服务器

### formatAvailableMcps(skills)
格式化可用 MCP 服务器列表
- **参数**：`skills: LoadedSkill[]` - 技能列表
- **返回**：`string` - 格式化的 MCP 列表
- **用途**：错误提示时显示可用服务器

### parseArguments(argsJson)
解析参数（支持字符串或对象）
- **参数**：`argsJson: string | Record<string, unknown> | undefined`
- **返回**：`Record<string, unknown>` - 解析后的参数对象
- **逻辑**：
  1. 如果未提供参数，返回空对象
  2. 如果参数是对象，直接返回
  3. 如果是字符串，尝试 JSON 解析
  4. 处理单引号包裹的 JSON 字符串

### applyGrepFilter(output, pattern)
对输出应用 grep 过滤
- **参数**：
  - `output: string` - 原始输出
  - `pattern: string | undefined` - 正则模式
- **返回**：`string` - 过滤后的输出
- **用途**：支持在结果中搜索特定内容

### createSkillMcpTool(options)
创建 MCP 工具实例
- **参数**：`SkillMcpToolOptions`
  - `manager: SkillMcpManager` - MCP 管理器
  - `getLoadedSkills: () => LoadedSkill[]` - 获取技能列表的函数
  - `getSessionID: () => string` - 获取会话 ID 的函数
- **返回**：`ToolDefinition`
- **功能**：
  - 验证操作参数
  - 查找 MCP 服务器
  - 执行工具调用/资源读取/提示获取
  - 应用可选的 grep 过滤

## 代码逻辑流程

```
createSkillMcpTool(options)
└── 返回 ToolDefinition
    ├── description - 工具描述
    ├── args
    │   ├── mcp_name: string - MCP 服务器名称
    │   ├── tool_name?: string - 要调用的工具
    │   ├── resource_name?: string - 要读取的资源
    │   ├── prompt_name?: string - 要获取的提示
    │   ├── arguments?: string | Record - 参数
    │   └── grep?: string - 输出过滤模式
    └── execute(args)
        ├── validateOperationParams(args) - 验证参数
        ├── findMcpServer(args.mcp_name, skills) - 查找服务器
        ├── parseArguments(args.arguments) - 解析参数
        ├── 根据操作类型执行：
        │   ├── tool: manager.callTool()
        │   ├── resource: manager.readResource()
        │   └── prompt: manager.getPrompt()
        └── applyGrepFilter(result, args.grep) - 可选过滤
```

## 依赖关系

### 内部依赖
- `./constants` - 常量定义
- `./types` - 类型定义

### 外部依赖
- `@opencode-ai/plugin` - OpenCode 插件 API
- `../../features/skill-mcp-manager` - MCP 管理器
- `../../features/opencode-skill-loader/types` - 技能类型

## 使用示例

```typescript
import { createSkillMcpTool } from './tools';
import type { SkillMcpManager } from '../../features/skill-mcp-manager';

// 创建工具
const tool = createSkillMcpTool({
  manager: mcpManager,
  getLoadedSkills: () => skills,
  getSessionID: () => 'session-123'
});

// 调用工具
const toolResult = await tool.execute({
  mcp_name: 'sqlite',
  tool_name: 'query',
  arguments: { sql: 'SELECT * FROM users' }
});

// 读取资源
const resourceResult = await tool.execute({
  mcp_name: 'memory',
  resource_name: 'memory://notes'
});

// 获取提示
const promptResult = await tool.execute({
  mcp_name: 'helper',
  prompt_name: 'summarize',
  arguments: { text: '...' }
});
```

## 注意事项

1. **互斥参数**：tool_name、resource_name、prompt_name 只能选一个
2. **参数格式**：arguments 可以是 JSON 字符串或对象
3. **单引号处理**：自动去除 JSON 字符串外围的单引号
4. **错误提示**：找不到服务器时显示所有可用 MCP
5. **Grep 过滤**：支持正则表达式过滤输出行
6. **会话 ID**：用于 MCP 客户端的标识和跟踪

