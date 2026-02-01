# ollama-ndjson-parser.ts

## 文件功能概述

该文件提供了 Ollama API 的 NDJSON（Newline Delimited JSON）响应解析功能。Ollama 使用流式响应返回多个 JSON 行，此模块负责将这些行合并为单个完整的响应对象。

## 主要函数/类详细说明

### 接口定义

#### `OllamaMessage`
Ollama 消息结构。
- **属性**:
  - `tool_calls?`: 工具调用数组
  - `content?`: 消息内容

#### `OllamaNDJSONLine`
NDJSON 单行结构。
- **属性**:
  - `message?`: 消息对象
  - `done`: 是否完成
  - `total_duration?`: 总耗时
  - `load_duration?`: 加载耗时
  - `prompt_eval_count?`: 提示词评估数量
  - `prompt_eval_duration?`: 提示词评估耗时
  - `eval_count?`: 评估数量
  - `eval_duration?`: 评估耗时

#### `OllamaMergedResponse`
合并后的 Ollama 响应。
- **属性**:
  - `message`: 合并后的消息
  - `done`: 是否完成
  - `stats?`: 统计信息

### 函数

#### `parseOllamaStreamResponse(response): OllamaMergedResponse`
解析 Ollama 流式 NDJSON 响应。
- **参数**: `response` - 原始 NDJSON 字符串
- **返回值**: 合并后的响应对象
- **合并逻辑**:
  1. 按行分割响应
  2. 解析每行为 JSON
  3. 合并所有 `tool_calls`
  4. 连接所有 `content`
  5. 提取最终统计信息
- **错误处理**: 跳过格式错误的行并记录日志

#### `isNDJSONResponse(response): boolean`
检查响应是否为 NDJSON 格式。
- **判断标准**:
  - 多行数据
  - 每行都是有效 JSON
  - 至少一行包含 `done` 字段
- **返回值**: 是 NDJSON 返回 `true`

## 使用示例

```typescript
import { parseOllamaStreamResponse, isNDJSONResponse } from './ollama-ndjson-parser';

// NDJSON 响应示例
const ndjsonResponse = `
{"message":{"tool_calls":[{"function":{"name":"read","arguments":{"filePath":"README.md"}}}]}, "done":false}
{"message":{"content":"File content here"}, "done":false}
{"message":{"content":" more content"}, "done":true, "total_duration":1234567}
`;

// 检查格式
if (isNDJSONResponse(ndjsonResponse)) {
  // 解析响应
  const merged = parseOllamaStreamResponse(ndjsonResponse);
  
  console.log(merged.message.tool_calls); // [{ function: { name: "read", ... } }]
  console.log(merged.message.content);    // "File content here more content"
  console.log(merged.done);               // true
  console.log(merged.stats?.total_duration); // 1234567
}
```

## 依赖关系

- `./logger`: 日志记录

## 注意事项

1. **流式响应**: Ollama 返回多个 JSON 行，需要合并处理
2. **内容连接**: `content` 字段是追加而非替换
3. **工具调用**: `tool_calls` 数组合并所有行的数据
4. **错误容忍**: 格式错误的行会被跳过，不会中断解析
5. **统计信息**: 仅从 `done: true` 的行提取统计信息
