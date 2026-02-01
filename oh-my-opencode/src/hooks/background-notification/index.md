# index.ts

## 文件信息

- **路径**: src/hooks/background-notification/index.ts
- **目录**: src/hooks/background-notification
- **行数**: 29

## 文件功能

这是模块的入口文件,统一导出本模块的所有公共 API。

## 接口定义

### Event

- **定义位置**: 第3行
- **属性**: type, ype, pe, e, properties, roperties, operties, perties, erties, rties

### EventInput

- **定义位置**: 第8行
- **属性**: event, vent, ent, nt, t

## 函数定义

### createBackgroundNotificationHook()

- **定义位置**: 第18行
- **描述**: Background notification hook - handles event routing to BackgroundManager. Notifications are now delivered directly via session.prompt({ noReply }) from the manager, so this hook only needs to handle event routing. /
- **参数**: `manager: BackgroundManager`

## 导出内容

```typescript
export { BackgroundNotificationHookConfig };
```

## 依赖关系

- `../../features/background-agent`

## 代码统计

- 接口数量: 2
- 类数量: 0
- 函数数量: 1
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 1

