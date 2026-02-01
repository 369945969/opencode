# zip-extractor.ts

## 文件功能概述

该文件提供了跨平台的 ZIP 文件解压功能。针对不同的操作系统和环境（特别是 Windows），它会自动选择最合适的解压工具进行解压操作。

## 主要函数/类详细说明

### 类型定义

#### `WindowsZipExtractor`
- **类型**: `"tar" | "pwsh" | "powershell"`
- **说明**: Windows 平台支持的解压工具类型

### 辅助函数

#### `getWindowsBuildNumber(): number | null`
获取 Windows 系统的构建版本号。
- **返回值**: 构建版本号，非 Windows 系统返回 `null`
- **实现**: 解析 `os.release()` 的输出（格式如 `"10.0.17134"`）

#### `isPwshAvailable(): boolean`
检查 PowerShell Core (pwsh) 是否可用。
- **返回值**: 可用返回 `true`
- **实现**: 执行 `where pwsh` 命令检查

#### `escapePowerShellPath(path: string): string`
转义 PowerShell 路径中的单引号。
- **参数**: `path` - 文件路径
- **返回值**: 转义后的路径
- **转义规则**: `'` → `''`

#### `getWindowsZipExtractor(): WindowsZipExtractor`
确定 Windows 平台上可用的最佳解压工具。
- **选择优先级**:
  1. **tar**: Windows 10 build 17134+ 内置 tar 命令
  2. **pwsh**: PowerShell Core (跨平台 PowerShell)
  3. **powershell**: 传统 Windows PowerShell
- **返回值**: 选择的解压工具类型

### 核心函数

#### `extractZip(archivePath: string, destDir: string): Promise<void>`
解压 ZIP 文件到指定目录。
- **参数**:
  - `archivePath`: ZIP 文件路径
  - `destDir`: 解压目标目录
- **返回值**: Promise，成功时 resolve，失败时 reject
- **平台处理**:

**Windows 平台**:
| 工具 | 命令 |
|------|------|
| tar | `tar -xf {archive} -C {dest}` |
| pwsh | `pwsh -Command "Expand-Archive -Path '{archive}' -DestinationPath '{dest}' -Force"` |
| powershell | `powershell -Command "Expand-Archive ..."` |

**Unix/Linux/macOS 平台**:
使用系统标准的 `unzip` 命令:
```bash
unzip -o {archive} -d {dest}
```
- `-o`: 覆盖现有文件

- **错误处理**: 如果解压失败（exit code ≠ 0），抛出包含 stderr 内容的 Error

## 代码逻辑流程

```
extractZip(archivePath, destDir)
├── 检测操作系统
├── Windows 平台
│   ├── 调用 getWindowsZipExtractor()
│   │   ├── 检查 Windows 版本 >= 17134 → tar
│   │   ├── 检查 pwsh 可用 → pwsh
│   │   └── 默认 → powershell
│   └── 根据选择执行对应命令
│       ├── tar: tar -xf archive -C dest
│       ├── pwsh: Expand-Archive 命令
│       └── powershell: Expand-Archive 命令
├── Unix/Linux/macOS 平台
│   └── 执行: unzip -o archive -d dest
└── 检查退出码
    └── 非0 → 抛出错误（包含 stderr）
```

## 使用示例

```typescript
import { extractZip } from './zip-extractor';

// 基本使用
try {
  await extractZip('/path/to/archive.zip', '/path/to/destination');
  console.log('Extraction successful');
} catch (error) {
  console.error('Extraction failed:', error.message);
}

// 实际应用场景：下载并解压插件
async function installPlugin(pluginUrl: string, installDir: string) {
  const tempZip = '/tmp/plugin.zip';
  
  // 下载插件
  await downloadFile(pluginUrl, tempZip);
  
  // 解压插件
  try {
    await extractZip(tempZip, installDir);
    console.log(`Plugin installed to ${installDir}`);
  } catch (error) {
    console.error('Failed to install plugin:', error);
    throw error;
  } finally {
    // 清理临时文件
    await fs.unlink(tempZip);
  }
}

// 跨平台解压示例
async function extractReleaseArchive(archivePath: string) {
  const extractDir = path.join(os.tmpdir(), 'extracted');
  
  // 确保目标目录存在
  await fs.mkdir(extractDir, { recursive: true });
  
  // 自动选择最佳解压方式
  await extractZip(archivePath, extractDir);
  
  return extractDir;
}
```

## 依赖关系

- `bun`: 使用 `spawn`, `spawnSync` 执行系统命令
- `os`: 使用 `release()` 获取 Windows 版本

## 注意事项

1. **Windows 版本检测**: 使用 build 17134 作为 tar 命令可用性的分界点（Windows 10 版本 1803）
2. **路径转义**: PowerShell 命令中的路径使用单引号包裹，并对单引号进行转义
3. **错误信息**: 解压失败时会包含 stderr 输出，便于调试
4. **覆盖行为**: 
   - `unzip` 使用 `-o` 标志自动覆盖
   - `Expand-Archive` 使用 `-Force` 参数自动覆盖
5. **性能**: `tar` 命令通常比 PowerShell 的 `Expand-Archive` 更快
6. **兼容性**: 优先使用系统原生工具（tar/unzip），减少对 PowerShell 的依赖
