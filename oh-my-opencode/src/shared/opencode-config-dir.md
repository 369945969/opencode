# opencode-config-dir.ts

## 文件功能概述

该文件提供了 OpenCode 配置目录的检测和管理功能。支持 OpenCode CLI 和 OpenCode Desktop（Tauri 应用）两种模式，处理不同平台的配置目录路径。

## 主要函数/类详细说明

### 类型定义

#### `OpenCodeBinaryType`
- **类型**: `"opencode" | "opencode-desktop"`
- **说明**: OpenCode 二进制类型

#### `OpenCodeConfigDirOptions`
- **属性**:
  - `binary`: 二进制类型
  - `version?`: 版本号
  - `checkExisting?`: 是否检查现有配置

#### `OpenCodeConfigPaths`
- **属性**:
  - `configDir`: 配置目录
  - `configJson`: JSON 配置文件路径
  - `configJsonc`: JSONC 配置文件路径
  - `packageJson`: package.json 路径
  - `omoConfig`: oh-my-opencode.json 路径

### 常量

#### `TAURI_APP_IDENTIFIER`
- **值**: `"ai.opencode.desktop"`

#### `TAURI_APP_IDENTIFIER_DEV`
- **值**: `"ai.opencode.desktop.dev"`

### 函数

#### `isDevBuild(version): boolean`
检查是否为开发版本。
- **判断依据**: 版本号包含 `-dev` 或 `.dev`

#### `getTauriConfigDir(identifier): string`
获取 Tauri 应用的配置目录。
- **平台路径**:
  - macOS: `~/Library/Application Support/{identifier}`
  - Windows: `%APPDATA%/{identifier}`
  - Linux: `~/.config/{identifier}` 或 `$XDG_CONFIG_HOME/{identifier}`

#### `getCliConfigDir(): string`
获取 CLI 配置目录。
- **优先级**:
  1. `OPENCODE_CONFIG_DIR` 环境变量
  2. Windows: `~/.config/opencode` 或 `%APPDATA%/opencode`
  3. Unix: `~/.config/opencode` 或 `$XDG_CONFIG_HOME/opencode`

#### `getOpenCodeConfigDir(options): string`
获取 OpenCode 配置目录。
- **逻辑**:
  - CLI 模式: 使用 `getCliConfigDir()`
  - Desktop 模式: 使用 Tauri 配置目录
  - 检查现有配置: 优先使用已存在的目录

#### `getOpenCodeConfigPaths(options): OpenCodeConfigPaths`
获取所有配置文件路径。
- **返回**: 包含各种配置文件路径的对象

#### `detectExistingConfigDir(binary, version): string | null`
检测已存在的配置目录。
- **搜索位置**:
  1. `OPENCODE_CONFIG_DIR` 环境变量
  2. Tauri 配置目录
  3. CLI 配置目录
- **返回**: 第一个包含配置文件的目录，或 `null`

## 使用示例

```typescript
import { 
  getOpenCodeConfigDir, 
  getOpenCodeConfigPaths,
  detectExistingConfigDir 
} from './opencode-config-dir';

// 获取配置目录
const configDir = getOpenCodeConfigDir({ 
  binary: 'opencode',
  checkExisting: true 
});

// 获取所有配置路径
const paths = getOpenCodeConfigPaths({ binary: 'opencode-desktop' });
console.log(paths.configDir);      // 配置目录
console.log(paths.configJson);     // opencode.json 路径
console.log(paths.omoConfig);      // oh-my-opencode.json 路径

// 检测现有配置
const existingDir = detectExistingConfigDir('opencode', '1.1.50');
if (existingDir) {
  console.log(`Found existing config at: ${existingDir}`);
}
```

## 依赖关系

- `node:fs`: 文件系统操作
- `node:os`: 操作系统信息
- `node:path`: 路径处理

## 注意事项

1. **环境变量**: 支持 `OPENCODE_CONFIG_DIR` 覆盖默认路径
2. **跨平台**: 正确处理 Windows、macOS、Linux 的路径差异
3. **版本检测**: Desktop 开发版本使用不同的 identifier
4. **向后兼容**: 优先检测现有配置目录，避免创建重复配置
