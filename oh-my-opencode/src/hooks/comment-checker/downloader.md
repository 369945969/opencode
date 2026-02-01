# downloader.ts

## 文件信息

- **路径**: src/hooks/comment-checker/downloader.ts
- **目录**: src/hooks/comment-checker
- **行数**: 197

## 文件功能

提供了 8 个函数/工具,用于实现特定功能。

## 接口定义

### PlatformInfo

- **定义位置**: 第20行
- **属性**: os, s, arch, rch, ch, h, ext, xt, t

## 函数定义

### debugLog()

- **定义位置**: 第11行
- **参数**: `...args: unknown[]`

### getCacheDir()

- **定义位置**: 第39行
- **描述**: Get the cache directory for oh-my-opencode binaries. On Windows: Uses %LOCALAPPDATA% or %APPDATA% (Windows conventions) On Unix: Follows XDG Base Directory Specification /
- **返回值**: `string`

### getBinaryName()

- **定义位置**: 第54行
- **描述**: Get the binary name based on platform. /
- **返回值**: `string`

### getCachedBinaryPath()

- **定义位置**: 第61行
- **描述**: Get the cached binary path if it exists. /
- **返回值**: `string | null`

### getPackageVersion()

- **定义位置**: 第69行
- **描述**: Get the version from the installed @code-yeongyu/comment-checker package. /
- **返回值**: `string`

### extractTarGz()

- **定义位置**: 第83行
- **描述**: Extract tar.gz archive using system tar command. /
- **参数**: `archivePath: string, destDir: string`
- **返回值**: `Promise<void>`

### downloadCommentChecker()

- **定义位置**: 第105行
- **描述**: Download the comment-checker binary from GitHub Releases. Returns the path to the downloaded binary, or null on failure. /
- **返回值**: `Promise<string | null>`

### ensureCommentCheckerBinary()

- **定义位置**: 第186行
- **描述**: Ensure the comment-checker binary is available. First checks cache, then downloads if needed. Returns the binary path or null if unavailable. /
- **返回值**: `Promise<string | null>`

## 常量定义

### DEBUG

- **定义位置**: 第8行
- **值**: `process.env.COMMENT_CHECKER_DEBUG === "1"`

### DEBUG_FILE

- **定义位置**: 第9行
- **值**: `join(tmpdir(), "comment-checker-debug.log")`

### REPO

- **定义位置**: 第18行
- **值**: `"code-yeongyu/go-claude-code-comment-checker"`

## 依赖关系

- `bun`
- `fs`
- `path`
- `os`
- `module`
- `../../shared`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 8
- 常量数量: 3
- 类型定义数量: 0
- 导入模块数量: 6

