# index.ts

## 文件信息

- **路径**: src/hooks/anthropic-context-window-limit-recovery/index.ts
- **目录**: src/hooks/anthropic-context-window-limit-recovery
- **行数**: 152

## 文件功能

这是模块的入口文件,统一导出本模块的所有公共 API。

## 接口定义

### AnthropicContextWindowLimitRecoveryOptions

- **定义位置**: 第8行
- **属性**: experimental, xperimental, perimental, erimental, rimental, imental, mental, ental, ntal, tal

## 函数定义

### createRecoveryState()

- **定义位置**: 第12行
- **返回值**: `AutoCompactState`

### createAnthropicContextWindowLimitRecoveryHook()

- **定义位置**: 第23行
- **参数**: `ctx: PluginInput, options?: AnthropicContextWindowLimitRecoveryOptions`

## 导出内容

```typescript
export { AutoCompactState, ParsedTokenLimitError, TruncateState };
export { parseAnthropicTokenLimitError };
export { executeCompact, getLastAssistant };
```

## 依赖关系

- `@opencode-ai/plugin`
- `./types`
- `../../config`
- `./parser`
- `./executor`
- `../../shared/logger`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 2
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 6

