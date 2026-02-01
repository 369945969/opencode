# config-manager.ts

## 文件信息

- **路径**: src/cli/config-manager.ts
- **目录**: src/cli
- **行数**: 665

## 文件功能

提供了 31 个函数/工具,用于实现特定功能。

## 接口定义

### ConfigContext

- **定义位置**: 第13行
- **属性**: binary, inary, nary, ary, ry, y, version, ersion, rsion, sion

### NodeError

- **定义位置**: 第61行
- **属性**: code, ode, de, e

### NpmDistTags

- **定义位置**: 第112行
- **属性**: latest, atest, test, est, st, t, beta, eta, ta, a

### OpenCodeConfig

- **定义位置**: 第155行
- **属性**: plugin, lugin, ugin, gin, in, n, key, ey, y

### ParseConfigResult

- **定义位置**: 第173行
- **属性**: config, onfig, nfig, fig, ig, g, error, rror, ror, or

### OpenCodeBinaryResult

- **定义位置**: 第361行
- **属性**: binary, inary, nary, ary, ry, y, version, ersion, rsion, sion

### BunInstallResult

- **定义位置**: 第437行
- **属性**: success, uccess, ccess, cess, ess, ss, s, timedOut, imedOut, medOut

## 函数定义

### initConfigContext()

- **定义位置**: 第21行
- **参数**: `binary: OpenCodeBinaryType, version: string | null`

### getConfigContext()

- **定义位置**: 第26行
- **返回值**: `ConfigContext`

### resetConfigContext()

- **定义位置**: 第34行

### getConfigDir()

- **定义位置**: 第38行
- **返回值**: `string`

### getConfigJson()

- **定义位置**: 第42行
- **返回值**: `string`

### getConfigJsonc()

- **定义位置**: 第46行
- **返回值**: `string`

### getPackageJson()

- **定义位置**: 第50行
- **返回值**: `string`

### getOmoConfig()

- **定义位置**: 第54行
- **返回值**: `string`

### isPermissionError()

- **定义位置**: 第65行
- **参数**: `err: unknown`
- **返回值**: `boolean`

### isFileNotFoundError()

- **定义位置**: 第70行
- **参数**: `err: unknown`
- **返回值**: `boolean`

### formatErrorWithSuggestion()

- **定义位置**: 第75行
- **参数**: `err: unknown, context: string`
- **返回值**: `string`

### fetchLatestVersion()

- **定义位置**: 第101行
- **参数**: `packageName: string`
- **返回值**: `Promise<string | null>`

### fetchNpmDistTags()

- **定义位置**: 第121行
- **参数**: `packageName: string`
- **返回值**: `Promise<NpmDistTags | null>`

### getPluginNameWithVersion()

- **定义位置**: 第138行
- **参数**: `currentVersion: string`
- **返回值**: `Promise<string>`

### detectConfigFormat()

- **定义位置**: 第160行

### isEmptyOrWhitespace()

- **定义位置**: 第178行
- **参数**: `content: string`
- **返回值**: `boolean`

### parseConfig()

- **定义位置**: 第182行
- **参数**: `path: string, _isJsonc: boolean`
- **返回值**: `OpenCodeConfig | null`

### parseConfigWithError()

- **定义位置**: 第187行
- **参数**: `path: string`
- **返回值**: `ParseConfigResult`

### ensureConfigDir()

- **定义位置**: 第216行

### addPluginToOpenCodeConfig()

- **定义位置**: 第223行
- **参数**: `currentVersion: string`
- **返回值**: `Promise<ConfigMergeResult>`

### generateOmoConfig()

- **定义位置**: 第310行
- **参数**: `installConfig: InstallConfig`
- **返回值**: `Record<string, unknown>`

### writeOmoConfig()

- **定义位置**: 第314行
- **参数**: `installConfig: InstallConfig`
- **返回值**: `ConfigMergeResult`

### findOpenCodeBinaryWithVersion()

- **定义位置**: 第366行
- **返回值**: `Promise<OpenCodeBinaryResult | null>`

### isOpenCodeInstalled()

- **定义位置**: 第387行
- **返回值**: `Promise<boolean>`

### getOpenCodeVersion()

- **定义位置**: 第392行
- **返回值**: `Promise<string | null>`

### addAuthPlugins()

- **定义位置**: 第397行
- **参数**: `config: InstallConfig`
- **返回值**: `Promise<ConfigMergeResult>`

### runBunInstall()

- **定义位置**: 第443行
- **返回值**: `Promise<boolean>`

### runBunInstallWithDetails()

- **定义位置**: 第448行
- **返回值**: `Promise<BunInstallResult>`

### addProviderConfig()

- **定义位置**: 第562行
- **参数**: `config: InstallConfig`
- **返回值**: `ConfigMergeResult`

### detectProvidersFromOmoConfig()

- **定义位置**: 第601行

### detectCurrentConfig()

- **定义位置**: 第625行
- **返回值**: `DetectedConfig`

## 常量定义

### OPENCODE_BINARIES

- **定义位置**: 第11行
- **值**: `["opencode", "opencode-desktop"] as const`

### BUN_INSTALL_TIMEOUT_SECONDS

- **定义位置**: 第58行
- **值**: `60`

### BUN_INSTALL_TIMEOUT_MS

- **定义位置**: 第59行
- **值**: `BUN_INSTALL_TIMEOUT_SECONDS * 1000`

### NPM_FETCH_TIMEOUT_MS

- **定义位置**: 第119行
- **值**: `5000`

### PACKAGE_NAME

- **定义位置**: 第134行
- **值**: `"oh-my-opencode"`

### PRIORITIZED_TAGS

- **定义位置**: 第136行
- **值**: `["latest", "beta", "next"] as const`

### ANTIGRAVITY_PROVIDER_CONFIG

- **定义位置**: 第509行
- **描述**: Legacy tier-suffixed names (e.g., `antigravity-gemini-3-pro-high`) still work but variants are the recommended approach. /
- **值**: `{`

## 类型定义

- `ConfigFormat`

## 依赖关系

- `node:fs`
- `../shared`
- `./types`
- `./model-fallback`

## 代码统计

- 接口数量: 7
- 类数量: 0
- 函数数量: 31
- 常量数量: 7
- 类型定义数量: 1
- 导入模块数量: 4

