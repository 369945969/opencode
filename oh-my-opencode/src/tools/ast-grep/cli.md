# cli.ts

## 文件信息

- **路径**: src/tools/ast-grep/cli.ts
- **目录**: src/tools/ast-grep
- **行数**: 231

## 文件功能

提供了 5 个函数/工具,用于实现特定功能。

## 接口定义

### RunOptions

- **定义位置**: 第14行
- **属性**: pattern, attern, ttern, tern, ern, rn, n, lang, ang, ng

## 函数定义

### getAstGrepPath()

- **定义位置**: 第27行
- **返回值**: `Promise<string | null>`

### startBackgroundInit()

- **定义位置**: 第57行

### runSg()

- **定义位置**: 第64行
- **参数**: `options: RunOptions`
- **返回值**: `Promise<SgResult>`

### isCliAvailable()

- **定义位置**: 第222行
- **返回值**: `boolean`

### ensureCliAvailable()

- **定义位置**: 第227行
- **返回值**: `Promise<boolean>`

## 依赖关系

- `bun`
- `fs`
- `./constants`
- `./downloader`
- `./types`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 5
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 5

