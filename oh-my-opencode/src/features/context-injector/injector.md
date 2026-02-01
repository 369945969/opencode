# injector.ts

## 文件信息

- **路径**: src/features/context-injector/injector.ts
- **目录**: src/features/context-injector
- **行数**: 168

## 文件功能

提供了 3 个函数/工具,用于实现特定功能。

## 接口定义

### OutputPart

- **定义位置**: 第6行
- **属性**: type, ype, pe, e, text, ext, xt, t, key, ey

### InjectionResult

- **定义位置**: 第12行
- **属性**: injected, njected, jected, ected, cted, ted, ed, d, contextLength, ontextLength

### ChatMessageInput

- **定义位置**: 第41行
- **属性**: sessionID, essionID, ssionID, sionID, ionID, onID, nID, ID, D, agent

### ChatMessageOutput

- **定义位置**: 第48行
- **属性**: message, essage, ssage, sage, age, ge, e, parts, arts, rts

### MessageWithParts

- **定义位置**: 第70行
- **属性**: info, nfo, fo, o, parts, arts, rts, ts, s

## 函数定义

### injectPendingContext()

- **定义位置**: 第17行
- **参数**: `collector: ContextCollector,
  sessionID: string,
  parts: OutputPart[]`
- **返回值**: `InjectionResult`

### createContextInjectorHook()

- **定义位置**: 第53行
- **参数**: `collector: ContextCollector`

### createContextInjectorMessagesTransformHook()

- **定义位置**: 第82行
- **参数**: `collector: ContextCollector`
- **返回值**: `MessagesTransformHook`

## 类型定义

- `MessagesTransformHook`

## 依赖关系

- `./collector`
- `@opencode-ai/sdk`
- `../../shared`
- `../claude-code-session-state`

## 代码统计

- 接口数量: 5
- 类数量: 0
- 函数数量: 3
- 常量数量: 0
- 类型定义数量: 1
- 导入模块数量: 4

