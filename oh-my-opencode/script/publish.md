# publish.ts

## 功能概述

该脚本是 oh-my-opencode 项目的完整发布流程管理工具。支持多包发布（主包 + 7 个平台特定包），包含版本管理、变更日志生成、GitHub Release 创建等功能。

## 主要函数

### `fetchPreviousVersion(): Promise<string>`

**功能**: 从 npm registry 获取最新版本号

**返回**: 最新版本号，如果没有则返回 "0.0.0"

### `bumpVersion(version: string, type: "major" | "minor" | "patch"): string`

**功能**: 根据版本类型递增版本号

**特性**:
- 支持预发布版本处理（如 `3.0.0-beta.7`）
- 正确处理 major、minor、patch 三种版本类型

### `updatePackageVersion(pkgPath: string, newVersion: string): Promise<void>`

**功能**: 更新单个 package.json 的版本号

### `updateAllPackageVersions(newVersion: string): Promise<void>`

**功能**: 同步更新所有包的版本号

**更新范围**:
- 主 package.json
- 主包的 optionalDependencies
- 7 个平台特定的 package.json

### `findPreviousTag(currentVersion: string): Promise<string | null>`

**功能**: 查找当前版本的先前 beta 标签

**用途**: 用于 beta 版本的变更日志对比

### `generateChangelog(previous: string, currentVersion?: string): Promise<string[]>`

**功能**: 生成变更日志

**特性**:
- 支持 beta 版本的增量日志
- 智能选择对比标签
- 过滤自动化提交

### `getContributors(previous: string): Promise<string[]>`

**功能**: 获取社区贡献者信息

**流程**: 与 `generate-changelog.ts` 中的实现类似

### `getDistTag(version: string): string | null`

**功能**: 根据版本号确定 npm dist-tag

**规则**: 预发布版本返回 tag 名称（如 `beta`），正式版本返回 null

### `checkPackageVersionExists(pkgName: string, version: string): Promise<boolean>`

**功能**: 检查指定版本是否已发布到 npm

### `publishPackage(cwd: string, distTag: string | null, useProvenance = true, pkgName?: string, version?: string): Promise<PublishResult>`

**功能**: 发布单个包到 npm

**特性**:
- 支持 republish 模式（跳过已存在的包）
- 支持 provenance（来源证明）
- 详细的错误处理（区分已存在 vs 权限错误）
- 支持 dist-tag

### `publishAllPackages(version: string): Promise<void>`

**功能**: 发布所有包（主包 + 平台包）

**流程**:
1. 分批发布平台包（每批 2 个，避免 OIDC token 过期）
2. 最后发布主包
3. 处理失败情况

### `buildPackages(): Promise<void>`

**功能**: 构建所有包

**流程**:
1. 清理并构建主包
2. 构建平台二进制文件（可选）

### `gitTagAndRelease(newVersion: string, notes: string[]): Promise<void>`

**功能**: 创建 Git 标签和 GitHub Release

**流程**:
1. 配置 Git 用户信息
2. 提交版本更新
3. 创建并推送标签
4. 推送分支
5. 创建 GitHub Release

### `checkVersionExists(version: string): Promise<boolean>`

**功能**: 检查主包版本是否已存在

### `main(): Promise<void>`

**功能**: 主函数，协调完整发布流程

**流程**:
```
1. 获取前一版本
2. 计算新版本（支持 BUMP 环境变量或 VERSION 覆盖）
3. 检查 prepare-only 模式
4. 检查版本是否已存在（支持 REPUBLISH 模式）
5. 更新所有包版本
6. 生成变更日志
7. 获取贡献者信息
8. 构建包
9. 发布所有包
10. 创建 Git 标签和 Release
```

## 环境变量

| 变量 | 说明 | 可选值 |
|------|------|--------|
| `BUMP` | 版本递增类型 | `major`, `minor`, `patch` |
| `VERSION` | 版本号覆盖 | 任意版本号 |
| `REPUBLISH` | 重新发布模式 | `true`, `false` |
| `SKIP_PLATFORM_PACKAGES` | 跳过平台包 | `true`, `false` |
| `CI` | CI 环境标识 | 自动设置 |

## 命令行参数

- `--prepare-only`: 仅更新版本号，不执行发布

## 使用示例

```bash
# 发布 patch 版本
BUMP=patch bun script/publish.ts

# 发布 minor 版本
BUMP=minor bun script/publish.ts

# 指定具体版本
VERSION=3.0.0 bun script/publish.ts

# 仅更新版本号
bun script/publish.ts --prepare-only

# 重新发布模式（跳过已存在的包）
REPUBLISH=true BUMP=patch bun script/publish.ts

# 跳过平台包
SKIP_PLATFORM_PACKAGES=true BUMP=patch bun script/publish.ts
```

## 依赖关系

- **bun**: `$` 函数用于执行命令
- **node:fs**: `existsSync` 用于文件检查
- **node:path**: `join` 用于路径拼接
- **npm**: 用于发布包
- **gh CLI**: 用于创建 GitHub Release
- **git**: 用于标签管理

## 注意事项

1. **发布顺序**: 先发布平台包（分批），最后发布主包
2. **批次大小**: 平台包每批 2 个，避免 OIDC token 过期
3. **版本同步**: 所有包的版本号必须保持一致
4. **错误处理**: 
   - E409/EPUBLISHCONFLICT: 视为已存在
   - E403: 通过 npm registry 验证是否已存在
   - 404: 始终视为失败
5. **Provenance**: 主包使用 provenance，平台包不使用
6. **Git 配置**: CI 环境下自动配置 Git 用户信息
7. **标签推送**: 优先推送标签，分支推送失败不中断流程

## 代码统计

- **行数**: 424
- **接口数量**: 1 (PublishResult)
- **类数量**: 0
- **函数数量**: 15
- **常量数量**: 6
- **导入模块数量**: 3

