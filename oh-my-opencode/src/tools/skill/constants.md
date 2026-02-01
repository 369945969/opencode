# skill/constants.ts

## 文件功能概述

Skill 工具的常量定义文件，定义了工具名称、描述模板等静态字符串常量。这些常量用于构建技能工具的元数据和用户界面文本。

## 主要常量

### TOOL_NAME
工具名称标识符。

```typescript
export const TOOL_NAME = "skill" as const;
```

**用途**：
- 工具注册标识
- 日志记录前缀
- 错误消息引用

### TOOL_DESCRIPTION_NO_SKILLS
无可用技能时的工具描述。

```typescript
export const TOOL_DESCRIPTION_NO_SKILLS = 
  "Load a skill to get detailed instructions for a specific task. No skills are currently available.";
```

**使用场景**：
- 当技能发现返回空列表时
- 作为工具描述的备选

### TOOL_DESCRIPTION_PREFIX
工具描述前缀模板。

```typescript
export const TOOL_DESCRIPTION_PREFIX = `Load a skill to get detailed instructions for a specific task.

Skills provide specialized knowledge and step-by-step guidance.
Use this when a task matches an available skill's description.`;
```

**用途**：
- 构建工具描述的基础部分
- 与可用技能列表拼接形成完整描述
- 向 LLM 解释工具的用途

## 依赖关系

### 无内部依赖
该文件仅导出常量，不依赖其他模块。

### 无外部依赖
纯 TypeScript 常量定义。

## 使用示例

```typescript
import { 
  TOOL_NAME, 
  TOOL_DESCRIPTION_NO_SKILLS, 
  TOOL_DESCRIPTION_PREFIX 
} from './constants';

// 工具注册
const tool = {
  name: TOOL_NAME,
  description: TOOL_DESCRIPTION_PREFIX + formatSkillsXml(skills)
};

// 空状态处理
if (skills.length === 0) {
  tool.description = TOOL_DESCRIPTION_NO_SKILLS;
}

// 日志记录
console.log(`[${TOOL_NAME}] Loading skill: ${skillName}`);
```

## 注意事项

1. **常量不可变**：使用 `as const` 确保类型安全
2. **描述模板**：`TOOL_DESCRIPTION_PREFIX` 是模板，需要拼接技能列表
3. **空状态**：`TOOL_DESCRIPTION_NO_SKILLS` 用于无技能的特殊情况
4. **国际化**：当前为英文，如需多语言支持需要重构
5. **描述长度**：保持简洁，避免超出 LLM 上下文限制

