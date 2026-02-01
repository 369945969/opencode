# OpenCode 核心架构与提示词 (Prompts) 全解析

本文档旨在提供 OpenCode 内部工作原理的透明化说明，特别是大模型（LLM）收到的**完整提示词（System Prompts）**以及每一步交互的详细逻辑。

---

## 1. 消息组装逻辑 (Prompt Assembly)

当 OpenCode 准备发送消息给大模型时，它会按顺序拼接以下几个部分：

1.  **角色指令 (Provider Prompt)**：根据模型类型，从 `packages/opencode/src/session/prompt/` 中加载对应的文本文件（如 `gemini.txt`）。
2.  **环境上下文 (Environment Context)**：由 `packages/opencode/src/session/system.ts` 生成，包含路径、OS、Git 状态等。
3.  **用户自定义指令 (Instruction Prompt)**：由 `packages/opencode/src/session/instruction.ts` 处理，自动加载项目中的 `AGENTS.md` 或 `CLAUDE.md` 文件。
4.  **历史记录 (Conversation History)**：由 `packages/opencode/src/session/message-v2.ts` 管理，包含对话、工具调用及结果。

---

## 2. 模型识别与提示词加载细节

OpenCode 需要知道当前使用的是哪种模型，以便加载最适合该模型的提示词和规范。

### A. 如何识别模型类型？
系统通过检查模型的 `api.id`（通常由 Provider 提供，如 `google/gemini-2.0-thinking-exp`）来判断。

**核心逻辑源文件：`packages/opencode/src/session/system.ts`**
- **Gemini**: 如果 ID 包含 `"gemini-"`。
- **GPT/O1**: 如果 ID 包含 `"gpt-"`、`"o1"` 或 `"o3"`。
- **Claude**: 如果 ID 包含 `"claude"`。

### B. 提示词加载过程
加载逻辑位于 `SystemPrompt.provider` 函数中。它是一个简单的分支选择器：

```typescript
export function provider(model: Provider.Model) {
  if (model.api.id.includes("gpt-5")) return [PROMPT_CODEX]
  if (model.api.id.includes("gpt-") || model.api.id.includes("o1") || model.api.id.includes("o3"))
    return [PROMPT_BEAST] // 加载 beast.txt
  if (model.api.id.includes("gemini-")) return [PROMPT_GEMINI] // 加载 gemini.txt
  if (model.api.id.includes("claude")) return [PROMPT_ANTHROPIC] // 加载 anthropic.txt
  return [PROMPT_ANTHROPIC_WITHOUT_TODO] // 默认加载 qwen.txt
}
```

### C. 文件存储路径
所有原始提示词文件都存放在以下目录：
`packages/opencode/src/session/prompt/`

---

## 2. 核心系统提示词全文 (Full Prompt Texts)

### A. Gemini 系列 (`packages/opencode/src/session/prompt/gemini.txt`)
*适用于：Gemini 2.0 系列模型。这是 OpenCode 的核心指令集，全文约 150 行，在每一轮交互中都会**完整加载**，不会分段。*

**提示词核心大纲 (全文涵盖以下板块)：**
1.  **Core Mandates (核心指令)**：
    - 严守项目约定（Conventions）。
    - 严禁假设库/框架存在，必须通过文件检查验证。
    - 路径构造：必须使用绝对路径。
    - 禁止擅自回滚代码。
2.  **Primary Workflows (主要工作流)**：
    - **Software Engineering**: 遵循 "Understand -> Plan -> Implement -> Verify" 的闭环。
    - **New Applications**: 目标是自主构建视觉精美、功能完备的原型。
3.  **Operational Guidelines (操作指南)**：
    - 语气简洁直接，禁用闲聊（No Chitchat）。
    - 最小化输出 Token。
    - GitHub Flavored Markdown 格式要求。
4.  **Security & Tool Usage**: 强制执行安全检查，解释风险操作，推荐并行调用工具以提升效率。

> [!NOTE]
> 在执行时，OpenCode 会使用 Bun 的文件加载机制将该 `.txt` 文件整体读入内存，作为 `role: "system"` 的消息发送。

### B. GPT/O1 系列 (`beast.txt`)
*适用于：GPT-4o, o1, o3 等模型。*

```text
You are opencode, an agent - please keep going until the user’s query is completely resolved.
Your thinking should be thorough and so it's fine if it's very long. However, avoid unnecessary repetition.
THE PROBLEM CAN NOT BE SOLVED WITHOUT EXTENSIVE INTERNET RESEARCH.
You MUST plan extensively before each function call, and reflect extensively on the outcomes of the previous function calls.
Take your time and think through every step - remember to check your solution rigorously.
```

### C. Claude 系列 (`anthropic.txt`)
*强调任务管理。*

```text
You are OpenCode, the best coding agent on the planet.
You have access to the TodoWrite tools to help you manage and plan tasks. Use these tools VERY frequently...
NEVER create files unless they're absolutely necessary for achieving your goal. ALWAYS prefer editing an existing file...
Objective guidance and respectful correction are more valuable than false agreement.
```

### D. 通用/默认系列 (`qwen.txt`)
*适用于其他模型。*

```text
You are opencode, an interactive CLI tool that helps users with software engineering tasks.
IMPORTANT: Refuse to write code or explain code that may be used maliciously.
IMPORTANT: You should minimize output tokens as much as possible while maintaining helpfulness.
You MUST answer concisely with fewer than 4 lines of text.
```

---

## 3. 技术环境上下文 (Environment Context)

每一轮对话，大模型都会在系统消息中看到如下格式的“实时环境快照”。

### A. 内容来源
该部分内容由 **`packages/opencode/src/session/system.ts`** 中的 `SystemPrompt.environment` 函数生成。它会从系统和项目中提取动态信息：

- **基础信息**：使用 Node.js 的 `process.platform` 获取操作系统，使用 `new Date()` 获取当前时间。
- **项目信息**：通过 **`packages/opencode/src/project/instance.ts`** 获取当前工作目录（CWD）以及项目是否为 Git 仓库。
- **文件树**：在某些配置下，会调用 `Ripgrep.tree` 自动生成当前目录的文件结构概览（`<files>` 标签）。

### B. 调用逻辑与时机
这个上下文不是静态的，而是在**每一轮对话开始前**动态生成的。

**调用链如下：**
1.  **`SessionPrompt.loop`** (见 `packages/opencode/src/session/prompt.ts:L605`)：循环开始后准备发送请求。
2.  调用 `await SystemPrompt.environment(model)` 获取最新的环境信息。
3.  作为 `system` 指令的一部分，连同 `gemini.txt` 等提示词一起发送给 `processor.process`。

### C. 设置示例
```text
You are powered by the model named [Model ID].
Here is some useful information about the environment you are running in:
<env>
  Working directory: /Users/jack/typescript/opencode
  Is directory a git repo: yes
  Platform: darwin
  Today's date: Sun Feb 01 2026
</env>
<files>
  [当前目录下的文件树缩略图]
</files>
```

---

## 4. 五子棋案例：Payload 真实数据流模拟

**用户输入**：`帮我写一个五子棋的小游戏，后端用 Go，前端用 Web。`

### 第 1 轮交互：任务初始化与规划
*   **发送给大模型 (System & User JSON)**:
```json
[
  { "role": "system", "content": "You are opencode... (gemini.txt 全文)" },
  { "role": "system", "content": "<env>Working directory: /Users/jack/game...</env>" },
  { "role": "user", "content": "帮我写一个五子棋的小游戏..." }
]
```
*   **模型响应 (Assistant JSON)**:
```json
{
  "role": "assistant",
  "content": [
    { "type": "text", "text": "我将首先检查当前目录以规划项目结构。" },
    { "type": "tool_call", "id": "call_01", "toolName": "list_dir", "args": { "path": "." } }
  ]
}
```

### 第 2 轮交互：环境确认与初始化
*   **发送给大模型 (历史记录 + 工具结果)**:
```json
[
  { "role": "user", "content": "帮我写一个五子棋的小游戏..." },
  { "role": "assistant", "content": "..." },
  { 
    "role": "tool", 
    "content": [
      { "type": "tool_result", "toolCallId": "call_01", "toolName": "list_dir", "result": "[]" }
    ]
  }
]
```
*   **模型响应 (Assistant JSON)**:
```json
{
  "role": "assistant",
  "content": [
    { "type": "reasoning", "text": "目录为空，我决定先编写 Go 后端服务 main.go。" },
    { "type": "tool_call", "id": "call_02", "toolName": "write_file", "args": { "filename": "main.go", "content": "package main..." } }
  ]
}
```

### 第 3 轮交互：并行工具执行 (前端开发)
*   **模型经常会一次性调用多个工具来提高效率。**
*   **模型响应 (Assistant JSON)**:
```json
{
  "role": "assistant",
  "content": [
    { "type": "text", "text": "后端已就绪，现在我将同时生成前端的 HTML、CSS 和 JS 文件。" },
    { "type": "tool_call", "id": "call_03", "toolName": "write_file", "args": { "filename": "index.html", "content": "..." } },
    { "type": "tool_call", "id": "call_04", "toolName": "write_file", "args": { "filename": "style.css", "content": "..." } }
  ]
}
```

### 第 4 轮交互：任务完成总结
*   **发送给大模型 (所有操作的结果汇总)**:
```json
[
  { "role": "tool", "content": [{ "toolCallId": "call_03", "result": "index.html written" }] },
  { "role": "tool", "content": [{ "toolCallId": "call_04", "result": "style.css written" }] }
]
```
*   **模型响应 (最终回复)**:
```json
{
  "role": "assistant",
  "content": "五子棋项目已创建成功！后端 main.go 已支持基础逻辑，前端 index.html 提供 UI。你可以运行 go run main.go 来查看。"
}
```

**总结**：每一次交互，系统都会把**完整的角色指令**和**最新的环境上下文**连同**之前的对话/工具记录**顺序拼接，作为一次完整的数组发送。

---

## 5. 核心代码位置参考

- **角色文本**: `packages/opencode/src/session/prompt/*.txt`
- **选择逻辑**: `packages/opencode/src/session/system.ts` 中的 `SystemPrompt.provider` 函数。
- **环境生成**: `packages/opencode/src/session/system.ts` 中的 `SystemPrompt.environment` 函数。
- **多轮循环**: `packages/opencode/src/session/prompt.ts` 中的 `SessionPrompt.loop` 函数。
- **执行引擎**: `packages/opencode/src/session/processor.ts` 中的 `SessionProcessor.process` 函数。
- **CLI 入口**: `packages/opencode/src/cli/cmd/run.ts` 中的 `RunCommand.handler`。
- **底层流处理**: `packages/opencode/src/session/llm.ts` 中的 `LLM.stream`。
