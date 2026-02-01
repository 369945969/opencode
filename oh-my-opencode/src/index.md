# index.ts - OhMyOpenCode 插件主入口

## 文件概述

这是 **OhMyOpenCode** 插件的主入口文件，实现了 OpenCode AI 插件接口。该插件是一个多模型代理编排系统，支持 Claude Opus 4.5、GPT-5.2、Gemini 3 Flash、Grok Code 等多种 AI 模型，提供 32 个生命周期钩子和 20+ 工具。

## 核心架构

### 1. 插件初始化流程

```
OhMyOpenCodePlugin(ctx)
├── 启动后台 tmux 检查 (startTmuxCheck)
├── 加载插件配置 (loadPluginConfig)
├── 创建功能模块实例
│   ├── 模型缓存状态管理
│   ├── 各种 Hook 实例化
│   ├── 后台任务管理器
│   ├── Tmux 会话管理器
│   └── 技能 MCP 管理器
├── 合并技能配置
└── 返回插件接口实现
```

### 2. 主要功能模块

#### 2.1 Hook 系统 (32个生命周期钩子)

文件初始化了以下主要 Hook：

**监控与恢复类：**
- `contextWindowMonitor` - 上下文窗口监控
- `sessionRecovery` - 会话恢复
- `sessionNotification` - 会话通知（带外部插件冲突检测）
- `anthropicContextWindowLimitRecovery` - Anthropic 上下文窗口限制恢复

**代码质量类：**
- `commentChecker` - 注释检查器
- `toolOutputTruncator` - 工具输出截断器
- `thinkingBlockValidator` - 思考块验证器
- `editErrorRecovery` - 编辑错误恢复

**注入与扩展类：**
- `directoryAgentsInjector` - 目录 Agents 注入器（支持原生 OpenCode 版本检测）
- `directoryReadmeInjector` - 目录 README 注入器
- `rulesInjector` - 规则注入器
- `compactionContextInjector` - 压缩上下文注入器

**代理与任务类：**
- `ralphLoop` - Ralph 循环任务
- `atlasHook` - Atlas 主编排器
- `backgroundManager` - 后台任务管理器
- `delegateTask` - 任务委托

**交互与体验类：**
- `thinkMode` - 思考模式
- `keywordDetector` - 关键词检测器
- `agentUsageReminder` - 代理使用提醒
- `categorySkillReminder` - 分类技能提醒
- `interactiveBashSession` - 交互式 Bash 会话

**配置与更新类：**
- `autoUpdateChecker` - 自动更新检查器
- `claudeCodeHooks` - Claude Code 兼容性钩子

#### 2.2 工具系统 (Tools)

**内置工具：**
- `builtinTools` - 基础工具集
- `backgroundTools` - 后台任务工具
- `call_omo_agent` - 调用 OMO Agent
- `look_at` - 多模态查看器（可禁用）
- `delegate_task` - 任务委托
- `skill` - 技能工具
- `skill_mcp` - 技能 MCP 工具
- `slashcommand` - 斜杠命令工具
- `interactive_bash` - 交互式 Bash

#### 2.3 技能系统 (Skills)

技能加载优先级（从低到高）：
1. `builtinSkills` - 内置技能
2. `pluginConfig.skills` - 插件配置技能
3. `userSkills` - 用户 Claude 技能
4. `globalSkills` - OpenCode 全局技能
5. `projectSkills` - 项目 Claude 技能
6. `opencodeProjectSkills` - OpenCode 项目技能

### 3. 事件处理系统

#### 3.1 chat.message 事件
处理聊天消息，包括：
- 代理变体应用（首次消息变体门控）
- 关键词检测
- Claude Code 钩子处理
- 自动斜杠命令
- Ralph Loop 任务启动/取消
- 提供者缓存缺失警告

#### 3.2 experimental.chat.messages.transform 事件
消息转换处理：
- 上下文注入器消息转换
- 思考块验证

#### 3.3 event 事件
综合事件处理，包括：
- 自动更新检查
- Claude Code 钩子事件
- 后台通知
- 会话通知
- 待办事项继续执行器
- 上下文窗口监控
- 目录注入器（Agents/README）
- 规则注入器
- 思考模式
- 各种恢复和提醒钩子

**会话生命周期事件：**
- `session.created` - 设置主会话、初始化 Tmux 会话
- `session.deleted` - 清理会话状态、断开 MCP、清理 LSP
- `message.updated` - 更新会话代理
- `session.error` - 会话恢复处理

#### 3.4 tool.execute.before 事件
工具执行前处理：
- 子代理问题拦截器
- 问题标签截断器
- Claude Code 钩子
- 非交互式环境检测
- 注释检查器
- 各种注入器
- 任务工具参数修改（禁用 delegate_task）
- Ralph Loop 斜杠命令处理

#### 3.5 tool.execute.after 事件
工具执行后处理：
- Claude Code 钩子
- 工具输出截断
- 上下文窗口监控
- 注释检查器
- 空任务响应检测器
- 代理使用提醒
- 编辑错误恢复
- 任务委托重试
- Atlas 钩子
- 任务恢复信息

### 4. 配置系统

#### 4.1 Tmux 配置
```typescript
{
  enabled: boolean          // 是否启用
  layout: string           // 布局类型 (main-vertical)
  main_pane_size: number   // 主面板大小
  main_pane_min_width: number
  agent_pane_min_width: number
}
```

#### 4.2 背景任务配置
通过 `BackgroundManager` 管理，支持：
- Tmux 配置传递
- 子代理会话创建回调
- 关闭清理回调

### 5. 关键设计模式

#### 5.1 条件加载模式
所有 Hook 都通过 `isHookEnabled()` 检查，支持：
- 通过配置禁用特定 Hook
- 版本兼容性检查（如原生 OpenCode Agents 注入）
- 外部插件冲突检测（如通知插件）

#### 5.2 回调协调模式
后台管理器与 Tmux 会话管理器通过回调协调：
- `onSubagentSessionCreated` - 子代理会话创建时同步到 Tmux
- `onSyncSessionCreated` - 同步会话创建
- `onShutdown` - 关闭时清理 Tmux

#### 5.3 会话恢复模式
会话恢复与待办事项继续执行器联动：
- 恢复开始时标记
- 恢复完成时取消标记

### 6. 导出内容

**默认导出：**
- `OhMyOpenCodePlugin` - 插件主函数

**类型导出：**
- `OhMyOpenCodeConfig` - 插件配置类型
- `AgentName` - 代理名称类型
- `AgentOverrideConfig` - 代理覆盖配置
- `AgentOverrides` - 代理覆盖集合
- `McpName` - MCP 名称类型
- `HookName` - Hook 名称类型
- `BuiltinCommandName` - 内置命令名称
- `ConfigLoadError` - 配置加载错误

## 注意事项

1. **不要从 index.ts 导出函数** - OpenCode 会将所有导出视为插件实例并调用
2. **配置错误工具** 仅通过 `"./shared/config-errors"` 内部使用
3. **版本检测** - 自动检测 OpenCode 版本以启用/禁用原生功能
4. **冲突处理** - 自动检测外部通知插件并避免冲突
