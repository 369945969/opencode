# build-binaries.ts

## 功能概述

该脚本用于构建 oh-my-opencode CLI 的多平台二进制文件。支持 11 个不同的平台目标，包括 macOS、Linux 和 Windows 的各种架构。

## 主要函数/类

### `PlatformTarget` 接口

定义平台目标的结构：
- `dir`: 输出目录名称
- `target`: Bun 构建目标标识
- `binary`: 二进制文件名
- `description`: 平台描述

### `PLATFORMS` 常量

预定义的 11 个平台目标数组：
- macOS: ARM64, x64, x64-baseline
- Linux: x64, x64-baseline, ARM64, x64-musl, x64-musl-baseline, ARM64-musl
- Windows: x64, x64-baseline

### `buildPlatform(platform: PlatformTarget): Promise<boolean>`

**功能**: 为单个平台构建二进制文件

**参数**:
- `platform`: 平台目标配置

**流程**:
1. 确定输出文件路径
2. 执行 `bun build --compile` 命令
3. 验证二进制文件是否成功生成
4. 使用 `file` 命令验证二进制文件（非 Windows 平台）

**返回**: 构建成功返回 `true`，失败返回 `false`

### `main(): Promise<void>`

**功能**: 主函数，协调所有平台的构建

**流程**:
1. 验证入口文件存在
2. 遍历所有平台并调用 `buildPlatform()`
3. 收集构建结果
4. 输出构建摘要
5. 如有失败则退出进程

## 代码逻辑流程

```
开始
  ↓
验证入口文件 (src/cli/index.ts)
  ↓
遍历 PLATFORMS 数组
  ↓
对每个平台:
  ├─ 执行 bun build --compile
  ├─ 验证输出文件存在
  ├─ 使用 file 命令验证
  └─ 记录结果
  ↓
输出构建摘要
  ↓
如有失败则退出(1)
  ↓
结束
```

## 使用示例

```bash
# 构建所有平台的二进制文件
bun script/build-binaries.ts

# 在 package.json 中作为脚本使用
bun run build:binaries
```

## 依赖关系

- **bun**: `$` 函数用于执行命令
- **node:fs**: `existsSync` 用于文件验证
- **node:path**: `join` 用于路径拼接

## 注意事项

1. **入口文件**: 固定使用 `src/cli/index.ts` 作为 CLI 入口
2. **输出目录**: 二进制文件输出到 `packages/{platform}/bin/` 目录
3. **编译选项**: 使用 `--minify --sourcemap --bytecode` 优化构建
4. **文件验证**: 非 Windows 平台使用 `file` 命令验证二进制文件类型
5. **错误处理**: 单个平台构建失败不会中断其他平台的构建
6. **退出码**: 有任何平台构建失败时进程退出码为 1

## 代码统计

- **行数**: 108
- **接口数量**: 1
- **类数量**: 0
- **函数数量**: 2
- **常量数量**: 2 (PLATFORMS, ENTRY_POINT)
- **导入模块数量**: 3

