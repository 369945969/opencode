# install.ts

## 文件信息

- **路径**: src/cli/install.ts
- **目录**: src/cli
- **行数**: 521

## 文件功能

提供了 15 个函数/工具,用于实现特定功能。

## 函数定义

### formatProvider()

- **定义位置**: 第28行
- **参数**: `name: string, enabled: boolean, detail?: string`
- **返回值**: `string`

### formatConfigSummary()

- **定义位置**: 第35行
- **参数**: `config: InstallConfig`
- **返回值**: `string`

### printHeader()

- **定义位置**: 第61行
- **参数**: `isUpdate: boolean`

### printStep()

- **定义位置**: 第68行
- **参数**: `step: number, total: number, message: string`

### printSuccess()

- **定义位置**: 第73行
- **参数**: `message: string`

### printError()

- **定义位置**: 第77行
- **参数**: `message: string`

### printInfo()

- **定义位置**: 第81行
- **参数**: `message: string`

### printWarning()

- **定义位置**: 第85行
- **参数**: `message: string`

### printBox()

- **定义位置**: 第89行
- **参数**: `content: string, title?: string`

### validateNonTuiArgs()

- **定义位置**: 第111行
- **参数**: `args: InstallArgs`

### argsToConfig()

- **定义位置**: 第147行
- **参数**: `args: InstallArgs`
- **返回值**: `InstallConfig`

### detectedToInitialValues()

- **定义位置**: 第159行
- **参数**: `detected: DetectedConfig`

### runTuiMode()

- **定义位置**: 第175行
- **参数**: `detected: DetectedConfig`
- **返回值**: `Promise<InstallConfig | null>`

### runNonTuiInstall()

- **定义位置**: 第274行
- **参数**: `args: InstallArgs`
- **返回值**: `Promise<number>`

### install()

- **定义位置**: 第399行
- **参数**: `args: InstallArgs`
- **返回值**: `Promise<number>`

## 常量定义

### VERSION

- **定义位置**: 第16行
- **值**: `packageJson.version`

### SYMBOLS

- **定义位置**: 第18行
- **值**: `{`

## 依赖关系

- `./types`
- `./config-manager`
- `./model-fallback`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 15
- 常量数量: 2
- 类型定义数量: 0
- 导入模块数量: 3

