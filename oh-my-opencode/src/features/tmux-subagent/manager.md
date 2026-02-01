# manager.ts

## 文件信息

- **路径**: src/features/tmux-subagent/manager.ts
- **目录**: src/features/tmux-subagent
- **行数**: 397

## 文件功能

定义了 1 个类,提供相关的功能实现。

## 接口定义

### SessionCreatedEvent

- **定义位置**: 第19行
- **属性**: type, ype, pe, e, properties, roperties, operties, perties, erties, rties

## 类定义

### TmuxSessionManager

- **定义位置**: 第38行
- **描述**: 3. EXECUTE: Execute actions with verification 4. UPDATE: Update internal cache only after tmux confirms success The internal `sessions` Map is just a cache for sessionId<->paneId mapping. The REAL source of truth is always queried from tmux. /
- **方法**: onstructor, nstructor, structor, tructor, ructor, uctor, ctor, tor, or, r

## 常量定义

### SESSION_TIMEOUT_MS

- **定义位置**: 第24行
- **值**: `10 * 60 * 1000`

## 类型定义

- `OpencodeClient`

## 依赖关系

- `@opencode-ai/plugin`
- `../../config/schema`
- `./types`
- `../../shared/tmux`
- `../../shared`
- `./pane-state-querier`
- `./decision-engine`
- `./action-executor`

## 代码统计

- 接口数量: 1
- 类数量: 1
- 函数数量: 0
- 常量数量: 1
- 类型定义数量: 1
- 导入模块数量: 8

