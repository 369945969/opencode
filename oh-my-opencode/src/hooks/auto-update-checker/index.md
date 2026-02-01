# index.ts

## 文件信息

- **路径**: src/hooks/auto-update-checker/index.ts
- **目录**: src/hooks/auto-update-checker
- **行数**: 305

## 文件功能

这是模块的入口文件,统一导出本模块的所有公共 API。

## 函数定义

### isPrereleaseVersion()

- **定义位置**: 第14行
- **参数**: `version: string`
- **返回值**: `boolean`

### isDistTag()

- **定义位置**: 第18行
- **参数**: `version: string`
- **返回值**: `boolean`

### isPrereleaseOrDistTag()

- **定义位置**: 第23行
- **参数**: `pinnedVersion: string | null`
- **返回值**: `boolean`

### extractChannel()

- **定义位置**: 第28行
- **参数**: `version: string | null`
- **返回值**: `string`

### createAutoUpdateCheckerHook()

- **定义位置**: 第48行
- **参数**: `ctx: PluginInput, options: AutoUpdateCheckerOptions = {}`

### runBackgroundUpdateCheck()

- **定义位置**: 第103行
- **参数**: `ctx: PluginInput,
  autoUpdate: boolean,
  getToastMessage: (isUpdate: boolean, latestVersion?: string`

### runBunInstallSafe()

- **定义位置**: 第164行
- **返回值**: `Promise<boolean>`

### showModelCacheWarningIfNeeded()

- **定义位置**: 第174行
- **参数**: `ctx: PluginInput`
- **返回值**: `Promise<void>`

### updateAndShowConnectedProvidersCacheStatus()

- **定义位置**: 第191行
- **参数**: `ctx: PluginInput`
- **返回值**: `Promise<void>`

### showConfigErrorsIfAny()

- **定义位置**: 第214行
- **参数**: `ctx: PluginInput`
- **返回值**: `Promise<void>`

### showVersionToast()

- **定义位置**: 第234行
- **参数**: `ctx: PluginInput, version: string | null, message: string`
- **返回值**: `Promise<void>`

### showSpinnerToast()

- **定义位置**: 第240行
- **参数**: `ctx: PluginInput, version: string, message: string`
- **返回值**: `Promise<void>`

### showUpdateAvailableToast()

- **定义位置**: 第261行
- **参数**: `ctx: PluginInput,
  latestVersion: string,
  getToastMessage: (isUpdate: boolean, latestVersion?: string`

### showAutoUpdatedToast()

- **定义位置**: 第279行
- **参数**: `ctx: PluginInput, oldVersion: string, newVersion: string`
- **返回值**: `Promise<void>`

### showLocalDevToast()

- **定义位置**: 第293行
- **参数**: `ctx: PluginInput, version: string | null, isSisyphusEnabled: boolean`
- **返回值**: `Promise<void>`

## 常量定义

### SISYPHUS_SPINNER

- **定义位置**: 第12行
- **值**: `["·", "•", "●", "○", "◌", "◦", " "]`

## 导出内容

```typescript
export { UpdateCheckResult, AutoUpdateCheckerOptions };
export { checkForUpdate };
export { invalidatePackage, invalidateCache };
```

## 依赖关系

- `@opencode-ai/plugin`
- `./checker`
- `./cache`
- `./constants`
- `../../shared/logger`
- `../../shared/config-errors`
- `../../cli/config-manager`
- `../../shared/model-availability`
- `../../shared/connected-providers-cache`
- `./types`

## 代码统计

- 接口数量: 0
- 类数量: 0
- 函数数量: 15
- 常量数量: 1
- 类型定义数量: 0
- 导入模块数量: 10

