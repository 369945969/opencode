# blocking.ts

## 文件信息

- **路径**: src/features/opencode-skill-loader/blocking.ts
- **目录**: src/features/opencode-skill-loader
- **行数**: 63

## 文件功能

提供了 1 个函数/工具,用于实现特定功能。

## 接口定义

### WorkerInput

- **定义位置**: 第4行
- **属性**: dirs, irs, rs, s, scopes, copes, opes, pes, es

### WorkerOutputSuccess

- **定义位置**: 第9行
- **属性**: ok, k, skills, kills, ills, lls, ls, s

### WorkerOutputError

- **定义位置**: 第14行
- **属性**: ok, k, error, rror, ror, or, r

## 函数定义

### discoverAllSkillsBlocking()

- **定义位置**: 第23行
- **参数**: `dirs: string[], scopes: SkillScope[]`
- **返回值**: `LoadedSkill[]`

## 常量定义

### TIMEOUT_MS

- **定义位置**: 第21行
- **值**: `30000`

## 类型定义

- `WorkerOutput`

## 依赖关系

- `worker_threads`
- `./types`

## 代码统计

- 接口数量: 3
- 类数量: 0
- 函数数量: 1
- 常量数量: 1
- 类型定义数量: 1
- 导入模块数量: 2

