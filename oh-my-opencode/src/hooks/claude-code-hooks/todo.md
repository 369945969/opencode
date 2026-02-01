# todo.ts

## 文件信息

- **路径**: src/hooks/claude-code-hooks/todo.ts
- **目录**: src/hooks/claude-code-hooks
- **行数**: 77

## 文件功能

提供了 7 个函数/工具,用于实现特定功能。

## 接口定义

### OpenCodeTodo

- **定义位置**: 第18行
- **属性**: content, ontent, ntent, tent, ent, nt, t, status, tatus, atus

## 函数定义

### getTodoPath()

- **定义位置**: 第8行
- **参数**: `sessionId: string`
- **返回值**: `string`

### ensureTodoDir()

- **定义位置**: 第12行

### toClaudeCodeFormat()

- **定义位置**: 第25行
- **参数**: `item: OpenCodeTodo | TodoItem`
- **返回值**: `ClaudeCodeTodoItem`

### loadTodoFile()

- **定义位置**: 第33行
- **参数**: `sessionId: string`
- **返回值**: `TodoFile | null`

### saveTodoFile()

- **定义位置**: 第57行
- **参数**: `sessionId: string, file: TodoFile`

### saveOpenCodeTodos()

- **定义位置**: 第64行
- **参数**: `sessionId: string, todos: OpenCodeTodo[]`

### deleteTodoFile()

- **定义位置**: 第71行
- **参数**: `sessionId: string`

## 常量定义

### TODO_DIR

- **定义位置**: 第6行
- **值**: `join(getClaudeConfigDir(), "todos")`

## 依赖关系

- `path`
- `fs`
- `../../shared`
- `./types`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 7
- 常量数量: 1
- 类型定义数量: 0
- 导入模块数量: 4

