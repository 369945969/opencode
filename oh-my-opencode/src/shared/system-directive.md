# system-directive.ts

## 文件信息

- **路径**: src/shared/system-directive.ts
- **目录**: src/shared
- **行数**: 61

## 文件功能

提供了 4 个函数/工具,用于实现特定功能。

## 函数定义

### createSystemDirective()

- **定义位置**: 第15行
- **描述**: Creates a system directive header with the given type. /
- **参数**: `type: string`
- **返回值**: `string`

### isSystemDirective()

- **定义位置**: 第25行
- **描述**: Checks if a message starts with the oh-my-opencode system directive prefix. Used by keyword-detector and other hooks to skip system-generated messages. /
- **参数**: `text: string`
- **返回值**: `boolean`

### hasSystemReminder()

- **定义位置**: 第35行
- **描述**: Checks if a message contains system-generated content that should be excluded from keyword detection and mode triggering. /
- **参数**: `text: string`
- **返回值**: `boolean`

### removeSystemReminders()

- **定义位置**: 第45行
- **描述**: Removes system-reminder tag content from text. This prevents automated system messages from triggering mode keywords. /
- **参数**: `text: string`
- **返回值**: `string`

## 常量定义

### SYSTEM_DIRECTIVE_PREFIX

- **定义位置**: 第8行
- **描述**: Unified system directive prefix for oh-my-opencode internal messages. All system-generated messages should use this prefix for consistent filtering. Format: [SYSTEM DIRECTIVE: OH-MY-OPENCODE - {TYPE}] /
- **值**: `"[SYSTEM DIRECTIVE: OH-MY-OPENCODE"`

### SystemDirectiveTypes

- **定义位置**: 第49行
- **描述**: /
- **值**: `{`

## 类型定义

- `SystemDirectiveType`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 4
- 常量数量: 2
- 类型定义数量: 1
- 导入模块数量: 0

