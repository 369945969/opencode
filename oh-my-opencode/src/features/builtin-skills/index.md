# Builtin Skills Module

## 文件功能概述

`builtin-skills` 模块提供预定义的技能模板，用于增强 AI 代理的能力。技能是特殊的提示词模板，可以配置特定工具、模型和行为模式。

## 模块组成

- `skills.ts`: 技能定义和创建函数
- `types.ts`: 技能类型定义
- `index.ts`: 模块入口

## 内置技能列表

### 1. Playwright Skill
浏览器自动化技能，使用 Playwright MCP 服务器。

**用途**: 网页浏览、信息收集、网页抓取、测试、截图

**配置**:
```typescript
{
  name: "playwright",
  mcpConfig: {
    playwright: {
      command: "npx",
      args: ["@playwright/mcp@latest"]
    }
  }
}
```

### 2. Agent Browser Skill
浏览器自动化技能，使用 agent-browser CLI。

**用途**: 导航、表单填写、截图、数据提取

**允许工具**: `Bash(agent-browser:*)`

### 3. Frontend UI/UX Skill
前端 UI/UX 设计技能。

**特点**:
- 设计师思维，注重间距、颜色、微交互
- 无需设计稿即可创建美观界面
- 支持多种美学方向（极简、极繁、复古未来等）

### 4. Git Master Skill
Git 专家技能，支持提交、变基、历史搜索。

**功能**:
- 原子提交（自动拆分大提交）
- 变基和 squash
- 历史搜索（blame、bisect、log -S）

### 5. Dev Browser Skill
开发浏览器技能，支持持久页面状态。

**特点**:
- 独立模式（默认）
- 扩展模式（连接现有 Chrome）
- 支持视频录制、截图、网络拦截

## 使用示例

```typescript
import { createBuiltinSkills } from "./skills"

// 创建所有内置技能
const skills = createBuiltinSkills({
  browserProvider: "playwright"  // 或 "agent-browser"
})

// 使用技能
// 在代理提示中包含技能内容
const skill = skills.find(s => s.name === "git-master")
```

## 技能结构

```typescript
interface BuiltinSkill {
  name: string                 // 技能名称
  description: string          // 技能描述
  template: string            // 提示词模板（Markdown）
  license?: string            // 许可证
  compatibility?: string      // 兼容性说明
  metadata?: Record<string, unknown>  // 元数据
  allowedTools?: string[]     // 允许的工具
  agent?: string             // 指定代理
  model?: string             // 指定模型
  subtask?: boolean          // 是否作为子任务
  argumentHint?: string      // 参数提示
  mcpConfig?: SkillMcpConfig // MCP 配置
}
```

## 依赖关系

- `../../config/schema`: 浏览器提供商配置
