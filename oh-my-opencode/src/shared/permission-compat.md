# permission-compat.ts

## 文件功能概述

该文件提供了 OpenCode 1.1.1+ 权限系统的兼容性工具。支持创建工具限制规则、白名单，以及从旧版工具格式迁移到新版权限格式。

## 主要函数/类详细说明

### 类型定义

#### `PermissionValue`
- **类型**: `"ask" | "allow" | "deny"`
- **说明**: 权限值类型

#### `PermissionFormat`
- **接口**:
  - `permission: Record<string, PermissionValue>`
- **说明**: 权限配置格式

### 函数

#### `createAgentToolRestrictions(denyTools): PermissionFormat`
创建禁止指定工具的权限配置。
- **参数**: `denyTools` - 要禁止的工具列表
- **返回值**: 权限配置对象
- **示例**:
```typescript
createAgentToolRestrictions(["write", "edit"])
// { permission: { write: "deny", edit: "deny" } }
```

#### `createAgentToolAllowlist(allowTools): PermissionFormat`
创建仅允许指定工具的白名单配置。
- **参数**: `allowTools` - 允许的工具列表
- **返回值**: 权限配置对象
- **特点**: 默认拒绝所有其他工具（`*: deny`）
- **示例**:
```typescript
createAgentToolAllowlist(["read", "grep"])
// { permission: { "*": "deny", read: "allow", grep: "allow" } }
```

#### `migrateToolsToPermission(tools): Record<string, PermissionValue>`
将旧版工具格式迁移到权限格式。
- **参数**: `tools` - 旧版格式 `{ toolName: boolean }`
- **返回值**: 新版权限格式
- **映射**: `true` → `"allow"`, `false` → `"deny"`

#### `migrateAgentConfig(config): Record<string, unknown>`
迁移代理配置中的工具格式到权限格式。
- **功能**: 如果配置中有 `tools` 字段，转换为 `permission` 字段
- **保留**: 保留原有的 `permission` 配置

## 使用示例

```typescript
import { 
  createAgentToolRestrictions,
  createAgentToolAllowlist,
  migrateAgentConfig 
} from './permission-compat';

// 创建限制规则
const restrictions = createAgentToolRestrictions(["write", "edit", "delete"]);
// 代理不能使用写入、编辑和删除工具

// 创建白名单
const allowlist = createAgentToolAllowlist(["read", "grep", "cat"]);
// 代理只能使用读取、搜索和查看工具

// 迁移旧配置
const oldConfig = {
  model: "gpt-4",
  tools: { read: true, write: false }
};
const newConfig = migrateAgentConfig(oldConfig);
// { model: "gpt-4", permission: { read: "allow", write: "deny" } }
```

## 依赖关系

- **无外部依赖**

## 注意事项

1. **版本要求**: 仅支持 OpenCode 1.1.1+ 的权限系统
2. **白名单模式**: `createAgentToolAllowlist` 默认拒绝所有工具（`*: deny`）
3. **迁移兼容性**: `migrateAgentConfig` 保留现有 `permission` 配置并合并
