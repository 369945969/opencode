# skills.ts

## 文件信息

- **路径**: src/features/builtin-skills/skills.ts
- **目录**: src/features/builtin-skills
- **行数**: 1730

## 文件功能

提供了 1 个函数/工具,用于实现特定功能。

## 接口定义

### CreateBuiltinSkillsOptions

- **定义位置**: 第1719行
- **属性**: browserProvider, rowserProvider, owserProvider, wserProvider, serProvider, erProvider, rProvider, Provider, rovider, ovider

## 函数定义

### createBuiltinSkills()

- **定义位置**: 第1723行
- **参数**: `options: CreateBuiltinSkillsOptions = {}`
- **返回值**: `BuiltinSkill[]`

## 常量定义

### client

- **定义位置**: 第1571行
- **描述**: *macOS/Linux:**
- **值**: `await connect()`

### page

- **定义位置**: 第1572行
- **描述**: *macOS/Linux:**
- **值**: `await client.page("example", { viewport: { width: 1920, height: 1080 } })`

### client

- **定义位置**: 第1588行
- **描述**: *Windows (PowerShell):**
- **值**: `await connect()`

### page

- **定义位置**: 第1589行
- **值**: `await client.page("example", { viewport: { width: 1920, height: 1080 } })`

### text

- **定义位置**: 第1621行
- **值**: `await page.evaluate(() => {`

### text

- **定义位置**: 第1626行
- **值**: `await page.evaluate(() => {`

### client

- **定义位置**: 第1639行
- **值**: `await connect()`

### page

- **定义位置**: 第1642行
- **值**: `await client.page("name")`

### pageWithSize

- **定义位置**: 第1643行
- **值**: `await client.page("name", { viewport: { width: 1920, height: 1080 } })`

### pages

- **定义位置**: 第1645行
- **值**: `await client.list()`

## 依赖关系

- `./types`
- `../../config/schema`
- `@/client.js`

## 代码统计

- 接口数量: 1
- 类数量: 0
- 函数数量: 1
- 常量数量: 16
- 类型定义数量: 0
- 导入模块数量: 3

