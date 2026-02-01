# dependencies.ts

## 文件信息

- **路径**: src/cli/doctor/checks/dependencies.ts
- **目录**: src/cli/doctor/checks
- **行数**: 187

## 文件功能

提供了 10 个函数/工具,用于实现特定功能。

## 函数定义

### checkBinaryExists()

- **定义位置**: 第4行
- **参数**: `binary: string`
- **返回值**: `Promise<`

### getBinaryVersion()

- **定义位置**: 第18行
- **参数**: `binary: string`
- **返回值**: `Promise<string | null>`

### checkAstGrepCli()

- **定义位置**: 第32行
- **返回值**: `Promise<DependencyInfo>`

### checkAstGrepNapi()

- **定义位置**: 第59行
- **返回值**: `Promise<DependencyInfo>`

### checkCommentChecker()

- **定义位置**: 第104行
- **返回值**: `Promise<DependencyInfo>`

### dependencyToCheckResult()

- **定义位置**: 第129行
- **参数**: `dep: DependencyInfo, checkName: string`
- **返回值**: `CheckResult`

### checkDependencyAstGrepCli()

- **定义位置**: 第147行
- **返回值**: `Promise<CheckResult>`

### checkDependencyAstGrepNapi()

- **定义位置**: 第152行
- **返回值**: `Promise<CheckResult>`

### checkDependencyCommentChecker()

- **定义位置**: 第157行
- **返回值**: `Promise<CheckResult>`

### getDependencyCheckDefinitions()

- **定义位置**: 第162行
- **返回值**: `CheckDefinition[]`

## 依赖关系

- `../types`
- `../constants`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 10
- 常量数量: 0
- 类型定义数量: 0
- 导入模块数量: 2

