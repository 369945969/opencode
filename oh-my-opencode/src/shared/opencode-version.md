# opencode-version.ts

## 文件功能概述

该文件提供了 OpenCode CLI 版本检测和比较功能。用于检查当前 OpenCode 版本是否满足插件的最低要求，以及比较不同版本号。

## 主要函数/类详细说明

### 常量

#### `MINIMUM_OPENCODE_VERSION`
- **值**: `"1.1.1"`
- **说明**: 插件支持的最低 OpenCode 版本（使用权限系统的版本）

#### `OPENCODE_NATIVE_AGENTS_INJECTION_VERSION`
- **值**: `"1.1.37"`
- **说明**: OpenCode 原生支持 AGENTS.md 注入的版本

### 函数

#### `parseVersion(version: string): number[]`
解析版本号字符串为数字数组。
- **输入**: `"v1.2.3-beta"`
- **输出**: `[1, 2, 3]`

#### `compareVersions(a, b): -1 | 0 | 1`
比较两个版本号。
- 返回 `-1`: a < b
- 返回 `0`: a == b
- 返回 `1`: a > b

#### `isVersionGte(a, b): boolean`
检查版本 a 是否 >= 版本 b。

#### `isVersionLt(a, b): boolean`
检查版本 a 是否 < 版本 b。

#### `getOpenCodeVersion(): string | null`
获取当前安装的 OpenCode 版本。
- **实现**: 执行 `opencode --version` 命令
- **缓存**: 结果会被缓存以提高性能
- **超时**: 5 秒超时

#### `isOpenCodeVersionAtLeast(version): boolean`
检查当前 OpenCode 版本是否至少为指定版本。

#### `resetVersionCache(): void`
重置版本缓存。

#### `setVersionCache(version): void`
手动设置版本缓存（用于测试）。

## 使用示例

```typescript
import { 
  getOpenCodeVersion, 
  isOpenCodeVersionAtLeast,
  compareVersions 
} from './opencode-version';

// 获取版本
const version = getOpenCodeVersion();
console.log(version); // "1.1.50"

// 检查版本要求
if (isOpenCodeVersionAtLeast("1.1.37")) {
  // 使用原生 AGENTS.md 注入
} else {
  // 使用插件的注入功能
}

// 版本比较
const result = compareVersions("1.2.0", "1.1.5"); // 1
```

## 依赖关系

- `child_process`: 使用 `execSync` 执行版本命令

## 注意事项

1. **版本缓存**: 使用 `NOT_CACHED` Symbol 作为缓存标记
2. **错误处理**: 命令执行失败时返回 `null`
3. **版本解析**: 支持 `v` 前缀和 `-` 后缀（如 `v1.0.0-beta`）
