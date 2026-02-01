# skill/tools.ts

## 文件功能概述

Skill 工具的核心实现文件，提供技能加载、格式化、MCP 能力查询和工具创建功能。支持从技能存储中发现技能，并可选地集成 MCP 服务器功能。

## 主要函数/类

### loadedSkillToInfo(skill)
将加载的技能转换为技能信息格式
- **参数**：`skill: LoadedSkill` - 加载的技能
- **返回**：`SkillInfo` - 技能信息对象
- **转换字段**：
  - name → name
  - definition.description → description
  - path → location
  - scope → scope
  - license → license
  - compatibility → compatibility
  - metadata → metadata
  - allowedTools → allowedTools

### formatSkillsXml(skills)
将技能列表格式化为 XML 字符串
- **用途**：嵌入到工具描述中供 LLM 查看
- **格式**：
  ```xml
  <available_skills>
    <skill>
      <name>skill-name</name>
      <description>Skill description</description>
      <compatibility>Optional compatibility info</compatibility>
    </skill>
  </available_skills>
  ```

### extractSkillBody(skill)
提取技能的主体内容
- **逻辑**：
  1. 如果有延迟加载器，加载完整模板
  2. 提取 `<skill-instruction>` 标签内容
  3. 如果没有标签，返回完整内容
  4. 如果路径存在，从文件提取

### formatMcpCapabilities(skill, manager, sessionID)
格式化技能的 MCP 服务器能力
- **功能**：
  - 查询 MCP 服务器的工具列表
  - 查询 MCP 服务器的资源列表
  - 查询 MCP 服务器的提示列表
  - 格式化输出为 Markdown
- **错误处理**：连接失败时显示错误信息

### createSkillTool(options)
创建技能工具实例
- **参数**：`SkillLoadOptions`
  - `skills?: LoadedSkill[]` - 预加载技能
  - `mcpManager?: SkillMcpManager` - MCP 管理器
  - `getSessionID?: () => string` - 会话 ID 获取器
  - `gitMasterConfig?: GitMasterConfig` - Git 配置
- **返回**：`ToolDefinition`
- **功能**：
  - 缓存技能列表
  - 动态构建工具描述
  - 执行时查找并返回技能内容
  - 支持 MCP 能力展示

## 代码逻辑流程

```
createSkillTool(options)
├── 初始化缓存
│   ├── cachedSkills = options.skills || null
│   └── cachedDescription = null
├── getSkills() - 获取技能列表
│   └── 如果未缓存，调用 getAllSkills()
├── getDescription() - 获取描述
│   ├── 如果已缓存，直接返回
│   ├── 获取所有技能
│   ├── 转换为 SkillInfo
│   └── 构建 XML 格式描述
├── 预构建描述（如果提供了选项）
└── 返回 ToolDefinition
    ├── description (getter) - 动态获取描述
    ├── args
    │   └── name: string - 技能名称
    └── execute(args, ctx)
        ├── 查找技能
        ├── 检查代理权限
        ├── 提取技能内容
        ├── 特殊处理 git-master
        ├── 构建输出
        └── 可选：添加 MCP 能力信息
```

## 依赖关系

### 内部依赖
- `./constants` - 常量定义
- `./types` - 类型定义
- `../../shared/logger` - 日志记录

### 外部依赖
- `@opencode-ai/plugin` - OpenCode 插件 API
- `@modelcontextprotocol/sdk/types.js` - MCP 类型
- `../../features/opencode-skill-loader` - 技能加载
- `../../features/opencode-skill-loader/skill-content` - 技能内容处理
- `../../features/skill-mcp-manager` - MCP 管理
- `../../config/schema` - GitMasterConfig 类型

## 使用示例

```typescript
import { createSkillTool } from './tools';
import type { SkillMcpManager } from '../../features/skill-mcp-manager';

// 基本用法
const tool = createSkillTool();
const result = await tool.execute({ name: 'code-review' });

// 带 MCP 支持
const mcpManager: SkillMcpManager = ...;
const toolWithMcp = createSkillTool({
  mcpManager,
  getSessionID: () => 'session-123',
  gitMasterConfig: {
    watermark: 'Signed-off-by: User',
    coAuthors: ['Co-authored-by: Helper']
  }
});

// 预加载技能
const skills = await getAllSkills();
const toolWithCache = createSkillTool({ skills });
```

## 注意事项

1. **技能查找**：使用精确匹配，区分大小写
2. **代理限制**：某些技能仅限特定代理使用
3. **Git Master**：自动注入水印和合著者配置
4. **MCP 查询**：失败时不会阻塞，显示错误提示
5. **缓存策略**：描述和技能列表会缓存以提高性能
6. **内容提取**：优先使用 `<skill-instruction>` 标签内容

