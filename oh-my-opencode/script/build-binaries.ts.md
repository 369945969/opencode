# build-binaries.ts

## 文件功能

CLI 分发平台特定二进制文件的构建脚本。使用 Bun 的编译功能为多个平台生成优化的可执行文件。

## 核心功能

### 平台目标定义
定义了 11 个平台目标,覆盖:
- **macOS**: ARM64、x64、x64-baseline
- **Linux**: x64(glibc/musl)、ARM64(glibc/musl)、baseline 变体
- **Windows**: x64、x64-baseline

### 构建流程
1. 验证入口文件存在
2. 遍历所有平台目标
3. 使用 `bun build --compile` 编译每个平台
4. 验证生成的二进制文件
5. 输出构建摘要

## 主要接口

### PlatformTarget
```typescript
interface PlatformTarget {
  dir: string;        // 输出目录名
  target: string;     // Bun 编译目标
  binary: string;     // 二进制文件名
  description: string;// 平台描述
}
```

### buildPlatform
为单个平台构建二进制文件:
- 使用 `--minify --sourcemap --bytecode` 优化
- 验证输出文件存在
- 使用 `file` 命令验证二进制格式

## 使用方式

```bash
# 构建所有平台
bun run script/build-binaries.ts

# 构建特定平台(修改 PLATFORMS 数组)
```

## 依赖关系

- `bun`: 构建工具
- `node:fs`: 文件系统操作
- `node:path`: 路径处理

## 配置常量

- `ENTRY_POINT`: 入口文件路径 (`src/cli/index.ts`)
- `PLATFORMS`: 平台目标数组(11 个目标)
- 输出目录: `packages/{platform.dir}/bin/`
