# session-notification.ts

## 文件信息

- **路径**: src/hooks/session-notification.ts
- **目录**: src/hooks
- **行数**: 331

## 文件功能

提供了 6 个函数/工具,用于实现特定功能。

## 接口定义

### Todo

- **定义位置**: 第14行
- **属性**: content, ontent, ntent, tent, ent, nt, t, status, tatus, atus

### SessionNotificationConfig

- **定义位置**: 第21行
- **属性**: title, itle, tle, le, e, message, essage, ssage, sage, age

## 函数定义

### detectPlatform()

- **定义位置**: 第36行
- **返回值**: `Platform`

### getDefaultSoundPath()

- **定义位置**: 第42行
- **参数**: `p: Platform`
- **返回值**: `string`

### sendNotification()

- **定义位置**: 第55行
- **参数**: `ctx: PluginInput,
  p: Platform,
  title: string,
  message: string`
- **返回值**: `Promise<void>`

### playSound()

- **定义位置**: 第102行
- **参数**: `ctx: PluginInput, p: Platform, soundPath: string`
- **返回值**: `Promise<void>`

### hasIncompleteTodos()

- **定义位置**: 第131行
- **参数**: `ctx: PluginInput, sessionID: string`
- **返回值**: `Promise<boolean>`

### createSessionNotification()

- **定义位置**: 第142行
- **参数**: `ctx: PluginInput,
  config: SessionNotificationConfig = {}`

## 类型定义

- `Platform`

## 依赖关系

- `@opencode-ai/plugin`
- `os`
- `../features/claude-code-session-state`
- `./session-notification-utils`

## 代码统计

- 接口数量: 2
- 类数量: 0
- 函数数量: 6
- 常量数量: 0
- 类型定义数量: 1
- 导入模块数量: 4

