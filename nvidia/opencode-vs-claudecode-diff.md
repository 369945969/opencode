# OpenCode vs Claude Code 执行日志对比（hi / 五子棋）

## 概览
这两份日志都展示了“hi”到“五子棋”任务的执行流程，但在提示词、事件格式和工具调用方式上存在显著差异。

## 共同点
- 都通过 `/v1/chat/completions` 调用，模型为 `z-ai/glm4.7`，开启 `stream: true`。
- 都包含“新话题检测”的 JSON Schema 输出任务（`output_config.format.json_schema`）。
- 都存在 `context_management.edits` 的清理指令（`clear_thinking_20251015`）。
- 都会在主任务前出现一组“标题/摘要类”辅助请求。

## 主要不同点

### 1) 系统提示词差异
**OpenCode 提示词**
- 角色声明为 “You are opencode, an interactive CLI tool…”，强调 **拒绝恶意代码**，并要求 **非平凡 Bash 需解释原因**。
- 反馈入口是 `https://github.com/anomalyco/opencode/issues`。
- 当用户询问 opencode 能力时，要求先用 WebFetch 查 `https://opencode.ai`。
参考：[opencode_hi-hi-五子棋.log:L1-L112](file:///Users/jack/typescript/opencode/nvidia/opencode_hi-hi-五子棋.log#L1-L112)

**Claude Code 提示词**
- 角色声明为 “You are Claude Code, Anthropic's official CLI for Claude”，允许**授权安全测试**，禁止破坏性内容。
- 强调 **输出简短、避免 emoji、仅在需要时创建文件**。
- 反馈入口是 `https://github.com/anthropics/claude-code/issues`。
参考：[claudecode_hi_hi-五子棋.log:L1-L68](file:///Users/jack/typescript/opencode/nvidia/claudecode_hi_hi-五子棋.log#L1-L68)

### 2) 流式事件格式差异
**OpenCode**
- 使用 OpenAI 兼容的 `chat.completion.chunk` 结构，内容在 `choices[].delta` 里。
- 工具调用为 `tool_calls` 数组（函数名/参数分片）。
参考：[opencode_hi-hi-五子棋.log:L628-L690](file:///Users/jack/typescript/opencode/nvidia/opencode_hi-hi-五子棋.log#L628-L690)

**Claude Code**
- 使用 Anthropic 风格事件：`message_start` / `content_block_*` / `message_delta`。
- 工具调用表现为 `content_block_start` 的 `tool_use`，参数以 `input_json_delta` 分片。
参考：[claudecode_hi_hi-五子棋.log:L193-L200](file:///Users/jack/typescript/opencode/nvidia/claudecode_hi_hi-五子棋.log#L193-L200)

### 3) 工具调用类型差异
**OpenCode**
- 以 `bash` 作为工具名，逐片拼接命令参数（`tool_calls` 中多片 `arguments`）。
- 体现了“执行命令测试接口”的流程。
参考：[opencode_hi-hi-五子棋.log:L662-L688](file:///Users/jack/typescript/opencode/nvidia/opencode_hi-hi-五子棋.log#L662-L688)

**Claude Code**
- 以 `TaskCreate` 为工具名，输入为 JSON 描述任务（例如“创建 Go 后端项目结构”）。
- 这是 Claude Code 的“任务管理型工具”而非 shell 执行。
参考：[claudecode_hi_hi-五子棋.log:L193-L200](file:///Users/jack/typescript/opencode/nvidia/claudecode_hi_hi-五子棋.log#L193-L200)

### 4) 输出内容风格差异
**OpenCode**
- 更偏向“执行 + 验证”的叙述，包括测试接口、输出运行结果、给出可运行指令。
- 在尾部会给出运行地址与操作提示。
参考：[opencode_hi-hi-五子棋.log:L742-L821](file:///Users/jack/typescript/opencode/nvidia/opencode_hi-hi-五子棋.log#L742-L821)

**Claude Code**
- 输出结构更偏“说明型文档”，包含“运行方法/功能特点/规则”分节。
参考：[claudecode_hi_hi-五子棋.log:L3418-L3583](file:///Users/jack/typescript/opencode/nvidia/claudecode_hi_hi-五子棋.log#L3418-L3583)

## 提示词差异对行为的影响（总结）
- OpenCode 的提示词更强调“解释命令与安全边界”，导致输出更偏操作指引 + 执行验证。
- Claude Code 的提示词更强调“简短输出、任务管理与工具调用”，使得流程倾向先创建任务、再逐步执行。

## 结论
- 两者同样完成“五子棋”主题，但 **OpenCode 更像执行型助手**（以 shell/HTTP 测试推进），**Claude Code 更像任务编排型助手**（以 TaskCreate 工具组织步骤）。
- 关键差异来自 **系统提示词** 与 **工具协议格式**。

## 逐步骤提示词对照

### 步骤 1：新话题检测（Topic）
**OpenCode**
- System: “You are opencode, an interactive CLI tool …” + 话题检测说明与 JSON Schema 输出要求。
- 位置参考：[opencode_hi-hi-五子棋.log:L1-L9](file:///Users/jack/typescript/opencode/nvidia/opencode_hi-hi-五子棋.log#L1-L9)

**Claude Code**
- System: “You are Claude Code, Anthropic's official CLI for Claude.” + 话题检测说明与 JSON Schema 输出要求。
- 位置参考：[claudecode_hi_hi-五子棋.log:L1-L9](file:///Users/jack/typescript/opencode/nvidia/claudecode_hi_hi-五子棋.log#L1-L9)

**差异要点**
- OpenCode 的系统提示词包含 opencode 的安全边界与 WebFetch 约束。
- Claude Code 的系统提示词强调 CLI 输出风格与官方行为约束。

### 步骤 2：主系统提示（核心行为约束）
**OpenCode**
- System: “You are opencode, an interactive CLI tool …” + 安全拒绝、命令解释、WebFetch 要求。
- 位置参考：[opencode_hi-hi-五子棋.log:L1-L112](file:///Users/jack/typescript/opencode/nvidia/opencode_hi-hi-五子棋.log#L1-L112)

**Claude Code**
- System: “You are Claude Code, Anthropic's official CLI for Claude …” + 允许授权安全测试、短输出、避免 emoji、仅在必要时创建文件。
- 位置参考：[claudecode_hi_hi-五子棋.log:L1-L68](file:///Users/jack/typescript/opencode/nvidia/claudecode_hi_hi-五子棋.log#L1-L68)

**差异要点**
- OpenCode 偏“执行与解释”，Claude Code 偏“任务编排与风格约束”。

### 步骤 3：标题/摘要辅助任务
**OpenCode**
- System: 指向 opencode 的会话摘要与标题生成约束。
- 位置参考：[opencode_hi-hi-五子棋.log:L1-L9](file:///Users/jack/typescript/opencode/nvidia/opencode_hi-hi-五子棋.log#L1-L9)

**Claude Code**
- System: “Summarize this coding conversation in under 50 characters …”
- User: “Please write a 5-10 word title …”
- 位置参考：[claudecode_hi_hi-五子棋.log:L3-L35](file:///Users/jack/typescript/opencode/nvidia/claudecode_hi_hi-五子棋.log#L3-L35)

**差异要点**
- OpenCode 更偏向“工具执行型摘要”语气。
- Claude Code 在系统层明确“简短摘要 + 关键文件/状态”要求。

### 步骤 4：主任务（五子棋实现）
**OpenCode**
- Prompt 仍以 opencode 系统规则为主，输出偏执行验证，包含命令与测试。
- 位置参考：[opencode_hi-hi-五子棋.log:L186-L824](file:///Users/jack/typescript/opencode/nvidia/opencode_hi-hi-五子棋.log#L186-L824)

**Claude Code**
- Prompt 仍以 Claude Code 系统规则为主，输出偏结构化说明与分节。
- 位置参考：[claudecode_hi_hi-五子棋.log:L166-L3583](file:///Users/jack/typescript/opencode/nvidia/claudecode_hi_hi-五子棋.log#L166-L3583)

**差异要点**
- OpenCode 倾向“执行型步骤 + 验证”，Claude Code 倾向“任务编排 + 文档结构”。
