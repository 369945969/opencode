# publish.ts

## 文件功能

多包发布脚本,负责协调主包和平台特定包的发布流程,包括版本管理、构建、发布和 GitHub Release 创建。

## 核心功能

### 1. 版本管理
- 获取 NPM 上的当前版本
- 支持语义化版本升级(major/minor/patch)
- 处理预发布版本(beta)
- 支持版本覆盖(通过 VERSION 环境变量)

### 2. 多包发布
发布 8 个平台特定包 + 1 个主包:
- darwin-arm64
- darwin-x64
- linux-x64
- linux-arm64
- linux-x64-musl
- linux-arm64-musl
- windows-x64
- 主包 (oh-my-opencode)

### 3. 发布流程
1. 获取/计算新版本
2. 更新所有包的版本号
3. 生成变更日志
4. 构建项目
5. 分批发布平台包(避免 OIDC 令牌过期)
6. 发布主包
7. 创建 Git Tag 和 GitHub Release

## 环境变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `BUMP` | 版本升级类型 | `patch`, `minor`, `major` |
| `VERSION` | 覆盖版本号 | `1.2.3` |
| `REPUBLISH` | 重新发布模式 | `true` |
| `SKIP_PLATFORM_PACKAGES` | 跳过平台包 | `true` |
| `CI` | CI 环境标识 | `true` |

## 主要函数

### fetchPreviousVersion()
从 NPM registry 获取最新版本。

### bumpVersion(version, type)
升级版本号,支持预发布版本处理。

### updateAllPackageVersions(newVersion)
同步更新所有包的版本号。

### publishAllPackages(version)
分批发布所有包,每批 2 个以避免 OIDC 令牌过期。

### gitTagAndRelease(newVersion, notes)
创建 Git 标签和 GitHub Release。

## 错误处理

- **EPUBLISHCONFLICT/E409**: 版本已存在,视为成功
- **E403**: 验证包是否存在,存在则视为已发布
- **404**: 视为真实错误

## 依赖关系

- `bun`: Shell 执行和文件操作
- `node:fs`: 文件系统检查
- `node:path`: 路径处理

## 使用方式

```bash
# 发布 patch 版本
BUMP=patch bun run script/publish.ts

# 指定版本发布
VERSION=1.2.3 bun run script/publish.ts

# 重新发布模式
REPUBLISH=true bun run script/publish.ts

# 仅准备(更新版本号)
bun run script/publish.ts --prepare-only
```

## 发布批次策略

为避免 OIDC 令牌过期,平台包分批次发布:
- 批次大小: 2 个包/批
- 总批次数: 4 批(8 个平台包)
- 主包最后发布
