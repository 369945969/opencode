# Script 目录文档

本目录包含 oh-my-opencode 项目的构建和发布脚本。

## 文件清单

| 文件 | 功能 | 使用场景 |
|------|------|----------|
| `build-schema.ts` | 从 Zod Schema 生成 JSON Schema | 配置验证 |
| `build-binaries.ts` | 构建多平台 CLI 二进制文件 | 发布前构建 |
| `generate-changelog.ts` | 自动生成变更日志 | 发布前准备 |
| `publish.ts` | 完整的发布流程管理 | CI/CD 发布 |

## 脚本详解

### 1. build-schema.ts

**功能**: 配置 Schema 生成器

**作用**: 将 TypeScript 的 Zod Schema 转换为标准 JSON Schema，用于配置文件的验证。

**输出**: `assets/oh-my-opencode.schema.json`

**使用**:
```bash
bun script/build-schema.ts
```

---

### 2. build-binaries.ts

**功能**: 多平台二进制构建器

**作用**: 使用 Bun 的编译功能，为 11 个不同平台构建独立的 CLI 二进制文件。

**支持平台**:
- **macOS**: ARM64, x64, x64-baseline
- **Linux**: x64, x64-baseline, ARM64, x64-musl, x64-musl-baseline, ARM64-musl
- **Windows**: x64, x64-baseline

**输出**: `packages/{platform}/bin/oh-my-opencode`

**使用**:
```bash
bun script/build-binaries.ts
```

---

### 3. generate-changelog.ts

**功能**: 变更日志生成器

**作用**: 自动分析 Git 提交历史，生成格式化的变更日志，并识别社区贡献者。

**特性**:
- 智能过滤自动化提交（test、chore、ci 等）
- 识别社区贡献者（排除团队成员）
- 基于 GitHub Releases 确定对比范围

**使用**:
```bash
bun script/generate-changelog.ts
```

---

### 4. publish.ts

**功能**: 完整发布管理器

**作用**: 协调整个发布流程，包括版本管理、构建、发布到 npm、创建 GitHub Release。

**发布包清单**:
1. `oh-my-opencode` - 主包
2. `oh-my-opencode-darwin-arm64` - macOS ARM64
3. `oh-my-opencode-darwin-x64` - macOS x64
4. `oh-my-opencode-linux-x64` - Linux x64
5. `oh-my-opencode-linux-arm64` - Linux ARM64
6. `oh-my-opencode-linux-x64-musl` - Linux x64 (musl)
7. `oh-my-opencode-linux-arm64-musl` - Linux ARM64 (musl)
8. `oh-my-opencode-windows-x64` - Windows x64

**环境变量**:
- `BUMP`: 版本递增类型（major/minor/patch）
- `VERSION`: 指定版本号
- `REPUBLISH`: 重新发布模式
- `SKIP_PLATFORM_PACKAGES`: 跳过平台包

**使用**:
```bash
# 发布 patch 版本
BUMP=patch bun script/publish.ts

# 指定版本
VERSION=3.0.0 bun script/publish.ts

# 仅更新版本号
bun script/publish.ts --prepare-only
```

## 发布流程

完整的发布流程由 `publish.ts` 协调：

```
┌─────────────────────────────────────────────────────────────┐
│  发布流程 (publish.ts)                                       │
├─────────────────────────────────────────────────────────────┤
│  1. 获取前一版本 (npm registry)                              │
│  2. 计算新版本 (BUMP 或 VERSION)                             │
│  3. 更新所有 package.json 版本                               │
│  4. 生成变更日志 (git log)                                   │
│  5. 获取贡献者信息 (GitHub API)                              │
│  6. 构建包 (bun run build)                                   │
│  7. 构建二进制 (build-binaries.ts)                           │
│  8. 发布平台包 (npm publish)                                 │
│  9. 发布主包 (npm publish)                                   │
│  10. 创建 Git 标签 (git tag)                                 │
│  11. 创建 GitHub Release (gh release)                        │
└─────────────────────────────────────────────────────────────┘
```

## 依赖要求

所有脚本都需要以下工具：
- **Bun**: JavaScript 运行时
- **Git**: 版本控制
- **npm**: 包发布
- **GitHub CLI (gh)**: GitHub 操作

## 注意事项

1. **执行权限**: 所有脚本都包含 shebang (`#!/usr/bin/env bun`)，可以直接执行
2. **CI/CD**: 这些脚本主要用于 GitHub Actions 自动化发布
3. **错误处理**: 脚本包含详细的错误处理和日志输出
4. **幂等性**: 支持重复执行（REPUBLISH 模式）

