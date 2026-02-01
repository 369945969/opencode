# shell-env.ts

## 文件功能概述

该文件提供了跨平台的 Shell 环境检测和命令构建功能。支持 Unix shell、PowerShell 和 cmd.exe 三种 shell 类型，用于生成环境变量设置命令和进行适当的字符串转义。

## 主要函数/类详细说明

### 类型定义

#### `ShellType`
- **类型**: `"unix" | "powershell" | "cmd"`
- **说明**: 支持的 shell 类型

### 函数

#### `detectShellType(): ShellType`
检测当前 shell 类型。
- **检测优先级**:
  1. `PSModulePath` 环境变量存在 → PowerShell
  2. `SHELL` 环境变量存在 → Unix shell
  3. 平台回退 → Windows: cmd, 其他: unix
- **返回值**: 检测到的 shell 类型

#### `shellEscape(value: string, shellType: ShellType): string`
对值进行 shell 转义，用于环境变量赋值。
- **参数**:
  - `value`: 要转义的值
  - `shellType`: 目标 shell 类型
- **转义规则**:

| Shell | 空值处理 | 特殊字符处理 |
|-------|---------|-------------|
| Unix | `''` | 单引号包裹，`'` → `'\''` |
| PowerShell | `''` | 单引号包裹，`'` → `''` |
| cmd | `""` | 双引号包裹，`%` → `%%`, `"` → `""` |

#### `buildEnvPrefix(env, shellType): string`
构建环境变量前缀命令。
- **参数**:
  - `env`: 环境变量键值对
  - `shellType`: shell 类型
- **返回值**: 命令前缀字符串
- **输出格式**:

| Shell | 格式示例 |
|-------|---------|
| Unix | `export VAR1=val1 VAR2=val2;` |
| PowerShell | `$env:VAR1='val1'; $env:VAR2='val2';` |
| cmd | `set VAR1="val1" && set VAR2="val2" &&` |

## 使用示例

```typescript
import { detectShellType, shellEscape, buildEnvPrefix } from './shell-env';

// 检测 shell
const shell = detectShellType();
console.log(shell); // "unix" | "powershell" | "cmd"

// 转义值
const escaped = shellEscape("it's a test", "unix");
// 'it'\''s a test'

// 构建环境变量命令
const prefix = buildEnvPrefix(
  { API_KEY: "secret", DEBUG: "true" },
  "unix"
);
// "export API_KEY='secret' DEBUG='true';"
```

## 依赖关系

- **无外部依赖**

## 注意事项

1. **cmd 特殊处理**: cmd.exe 需要转义 `%`（环境变量扩展）和 `"`（引号）
2. **空值处理**: 不同 shell 对空字符串的引号处理方式不同
3. **命令构建**: 返回的前缀可以直接拼接到实际命令前
