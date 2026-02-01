# formatter.ts

## 文件信息

- **路径**: src/cli/doctor/formatter.ts
- **目录**: src/cli/doctor
- **行数**: 141

## 文件功能

提供了 12 个函数/工具,用于实现特定功能。

## 函数定义

### formatStatusSymbol()

- **定义位置**: 第5行
- **参数**: `status: CheckResult["status"]`
- **返回值**: `string`

### formatCheckResult()

- **定义位置**: 第18行
- **参数**: `result: CheckResult, verbose: boolean`
- **返回值**: `string`

### formatCategoryHeader()

- **定义位置**: 第37行
- **参数**: `category: CheckCategory`
- **返回值**: `string`

### formatSummary()

- **定义位置**: 第42行
- **参数**: `summary: DoctorSummary`
- **返回值**: `string`

### formatHeader()

- **定义位置**: 第63行
- **返回值**: `string`

### formatFooter()

- **定义位置**: 第67行
- **参数**: `summary: DoctorSummary`
- **返回值**: `string`

### formatProgress()

- **定义位置**: 第77行
- **参数**: `current: number, total: number, name: string`
- **返回值**: `string`

### formatJsonOutput()

- **定义位置**: 第82行
- **参数**: `result: DoctorResult`
- **返回值**: `string`

### formatDetails()

- **定义位置**: 第86行
- **参数**: `details: string[]`
- **返回值**: `string`

### stripAnsi()

- **定义位置**: 第90行
- **参数**: `str: string`
- **返回值**: `string`

### formatBox()

- **定义位置**: 第95行
- **参数**: `content: string, title?: string`
- **返回值**: `string`

### formatHelpSuggestions()

- **定义位置**: 第126行
- **参数**: `results: CheckResult[]`
- **返回值**: `string[]`

## 依赖关系

- `./types`
- `./constants`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 12
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 2

