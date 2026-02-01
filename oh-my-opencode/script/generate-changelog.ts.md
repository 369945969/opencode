# generate-changelog.ts

## 文件功能

自动生成发布变更日志的脚本,基于 Git 提交历史和 GitHub API 提取有意义的变更和社区贡献者信息。

## 核心功能

### 1. 获取最新发布标签
使用 `gh release list` 命令获取最新的非草稿、非预发布版本标签。

### 2. 生成变更日志
- 获取自上次发布以来的所有提交
- 过滤掉忽略类型的提交(ignore、test、chore、ci、release)
- 格式化提交信息为 Markdown 列表

### 3. 获取贡献者
- 使用 GitHub API 比较版本差异
- 识别非团队成员的社区贡献者
- 按贡献者分组显示其提交

## 主要函数

### getLatestReleasedTag()
```typescript
async function getLatestReleasedTag(): Promise<string | null>
```
获取最新的正式发布标签。

### generateChangelog(previousTag: string)
```typescript
async function generateChangelog(previousTag: string): Promise<string[]>
```
生成自指定标签以来的变更日志条目。

### getContributors(previousTag: string)
```typescript
async function getContributors(previousTag: string): Promise<string[]>
```
获取社区贡献者列表及其贡献。

## 过滤规则

忽略的提交前缀:
- `ignore:`
- `test:`
- `chore:`
- `ci:`
- `release:`

## 团队成员

```typescript
const TEAM = ["actions-user", "github-actions[bot]", "code-yeongyu"];
```

## 依赖关系

- `bun`: Shell 命令执行
- `gh`: GitHub CLI 工具

## 使用方式

```bash
# 生成变更日志
bun run script/generate-changelog.ts
```

## 输出格式

```markdown
- abc1234 feat: 新增功能 X
- def5678 fix: 修复问题 Y

**Thank you to 2 community contributors:**
- @contributor1:
  - feat: 新增功能 A
- @contributor2:
  - fix: 修复问题 B
```
