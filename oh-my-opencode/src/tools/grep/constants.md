# constants.ts

## 文件信息

- **路径**: src/tools/grep/constants.ts
- **目录**: src/tools/grep
- **行数**: 128

## 文件功能

提供了 4 个函数/工具,用于实现特定功能。

## 接口定义

### ResolvedCli

- **定义位置**: 第9行
- **属性**: path, ath, th, h, backend, ackend, ckend, kend, end, nd

## 函数定义

### findExecutable()

- **定义位置**: 第17行
- **参数**: `name: string`
- **返回值**: `string | null`

### getOpenCodeBundledRg()

- **定义位置**: 第32行
- **返回值**: `string | null`

### resolveGrepCli()

- **定义位置**: 第58行
- **返回值**: `ResolvedCli`

### resolveGrepCliWithAutoInstall()

- **定义位置**: 第89行
- **返回值**: `Promise<ResolvedCli>`

## 常量定义

### DEFAULT_MAX_DEPTH

- **定义位置**: 第111行
- **值**: `20`

### DEFAULT_MAX_FILESIZE

- **定义位置**: 第112行
- **值**: `"10M"`

### DEFAULT_MAX_COUNT

- **定义位置**: 第113行
- **值**: `500`

### DEFAULT_MAX_COLUMNS

- **定义位置**: 第114行
- **值**: `1000`

### DEFAULT_CONTEXT

- **定义位置**: 第115行
- **值**: `2`

### DEFAULT_TIMEOUT_MS

- **定义位置**: 第116行
- **值**: `300_000`

### DEFAULT_MAX_OUTPUT_BYTES

- **定义位置**: 第117行
- **值**: `10 * 1024 * 1024`

### RG_SAFETY_FLAGS

- **定义位置**: 第119行
- **值**: `[`

### GREP_SAFETY_FLAGS

- **定义位置**: 第127行
- **值**: `["-n", "-H", "--color=never"] as const`

## 类型定义

- `GrepBackend`

## 依赖关系

- `node:fs`
- `node:path`
- `node:child_process`
- `./downloader`
- `../../shared/data-path`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 4
- 常量数量: 9
- 类型定义数量: 1
- 导入模块数量: 5

