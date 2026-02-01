# generate-changelog.ts

## 功能概述

该脚本用于自动生成项目的变更日志（Changelog），基于 Git 提交历史和 GitHub API 获取贡献者信息。过滤掉自动化提交（如 test、chore、ci 等）。

## 主要函数

### `getLatestReleasedTag(): Promise<string | null>`

**功能**: 获取最新的已发布标签

**流程**:
1. 使用 `gh release list` 命令获取最新发布
2. 排除草稿和预发布版本
3. 返回标签名称或 null

**返回**: 最新标签名或 null（如果没有发布）

### `generateChangelog(previousTag: string): Promise<string[]>`

**功能**: 生成变更日志条目

**参数**:
- `previousTag`: 上一个版本的标签名

**流程**:
1. 执行 `git log` 获取从上一个标签到 HEAD 的提交
2. 过滤掉特定类型的提交（ignore、test、chore、ci、release）
3. 格式化提交信息为 Markdown 列表

**返回**: 变更日志条目数组

### `getContributors(previousTag: string): Promise<string[]>`

**功能**: 获取社区贡献者信息

**参数**:
- `previousTag`: 上一个版本的标签名

**流程**:
1. 使用 GitHub API 获取提交对比信息
2. 解析每个提交的作者信息
3. 过滤掉团队成员（actions-user、github-actions[bot]、code-yeongyu）
4. 过滤掉自动化提交
5. 按用户分组提交信息
6. 生成贡献者感谢列表

**返回**: 贡献者信息数组（Markdown 格式）

### `main(): Promise<void>`

**功能**: 主函数，协调日志生成流程

**流程**:
1. 获取最新发布的标签
2. 如果没有标签，输出 "Initial release"
3. 生成变更日志
4. 获取贡献者信息
5. 合并并输出结果

## 代码逻辑流程

```
开始
  ↓
获取最新发布标签
  ↓
如果没有标签?
  ├─ 是: 输出 "Initial release" 并退出
  └─ 否: 继续
  ↓
生成变更日志
  ├─ 执行 git log
  ├─ 过滤提交类型
  └─ 格式化输出
  ↓
获取贡献者信息
  ├─ 调用 GitHub API
  ├─ 解析作者信息
  ├─ 过滤团队成员
  └─ 按用户分组
  ↓
合并输出结果
  ↓
结束
```

## 使用示例

```bash
# 生成变更日志
bun script/generate-changelog.ts

# 示例输出:
# - abc1234 feat: add new feature
# - def5678 fix: resolve bug
#
# **Thank you to 2 community contributors:**
# - @contributor1:
#   - feat: add new feature
```

## 依赖关系

- **bun**: `$` 函数用于执行命令
- **gh CLI**: 需要安装 GitHub CLI 工具
- **git**: 需要 Git 命令行工具

## 注意事项

1. **过滤规则**: 自动过滤以下前缀的提交：
   - `ignore:`
   - `test:`
   - `chore:`
   - `ci:`
   - `release:`

2. **团队成员**: 以下用户不被视为社区贡献者：
   - `actions-user`
   - `github-actions[bot]`
   - `code-yeongyu`

3. **环境要求**: 需要配置好 GitHub CLI（`gh`）并登录

4. **错误处理**: 使用 try-catch 静默处理错误，确保脚本不会因单个步骤失败而崩溃

## 代码统计

- **行数**: 93
- **接口数量**: 0
- **类数量**: 0
- **函数数量**: 4
- **常量数量**: 1
- **导入模块数量**: 1

