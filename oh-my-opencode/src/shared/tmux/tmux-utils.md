# tmux-utils.ts

## 文件功能概述

该文件提供了完整的 tmux 窗格（pane）管理功能，包括检测 tmux 环境、创建/关闭/替换窗格、应用布局以及管理窗格尺寸等。主要用于支持 oh-my-opencode 插件在 tmux 会话中创建子代理（subagent）窗格。

## 主要函数/类详细说明

### 类型定义

#### `SplitDirection`
- **类型**: `"-h" | "-v"`
- **说明**: 窗格分割方向，`-h` 表示水平分割（左右），`-v` 表示垂直分割（上下）

#### `PaneDimensions`
- **接口**:
  - `paneWidth: number` - 窗格宽度
  - `windowWidth: number` - 窗口宽度
- **用途**: 存储窗格和窗口的尺寸信息

### 核心函数

#### `isInsideTmux(): boolean`
检查当前是否在 tmux 会话中。
- **实现**: 检查 `process.env.TMUX` 是否存在
- **返回值**: 在 tmux 中返回 `true`，否则返回 `false`

#### `isServerRunning(serverUrl: string): Promise<boolean>`
检查 OpenCode 服务器是否正在运行。
- **参数**: 
  - `serverUrl`: 服务器 URL
- **实现逻辑**:
  1. 使用缓存避免重复检查
  2. 向 `/health` 端点发送请求
  3. 最多重试 2 次，每次超时 3 秒
- **返回值**: 服务器可访问返回 `true`

#### `resetServerCheck(): void`
重置服务器检查缓存，强制下次重新检测。

#### `getCurrentPaneId(): string | undefined`
获取当前窗格 ID。
- **返回值**: 如 `%42`，如果不在 tmux 中返回 `undefined`

#### `getPaneDimensions(paneId: string): Promise<PaneDimensions | null>`
获取指定窗格的尺寸信息。
- **参数**: `paneId` - 窗格 ID
- **返回值**: 包含 `paneWidth` 和 `windowWidth` 的对象，失败返回 `null`

#### `spawnTmuxPane(sessionId, description, config, serverUrl, targetPaneId?, splitDirection?): Promise<SpawnPaneResult>`
创建新的 tmux 窗格并运行 opencode 子代理。
- **参数**:
  - `sessionId`: 会话 ID
  - `description`: 窗格描述（用于标题）
  - `config`: TmuxConfig 配置对象
  - `serverUrl`: OpenCode 服务器 URL
  - `targetPaneId?`: 目标窗格 ID（可选）
  - `splitDirection?`: 分割方向，默认 `-h`
- **前置检查**:
  1. 检查 `config.enabled`
  2. 检查是否在 tmux 中
  3. 检查服务器是否运行
  4. 检查 tmux 是否可用
- **返回值**: `SpawnPaneResult` 对象

#### `closeTmuxPane(paneId: string): Promise<boolean>`
关闭指定的 tmux 窗格。
- **参数**: `paneId` - 要关闭的窗格 ID
- **返回值**: 成功返回 `true`

#### `replaceTmuxPane(paneId, sessionId, description, config, serverUrl): Promise<SpawnPaneResult>`
替换现有窗格中的命令（使用 respawn-pane）。
- **用途**: 重用现有窗格而不是创建新的
- **参数**: 与 `spawnTmuxPane` 类似

#### `applyLayout(tmux, layout, mainPaneSize): Promise<void>`
应用 tmux 布局。
- **参数**:
  - `tmux`: tmux 可执行文件路径
  - `layout`: 布局名称（如 `main-horizontal`, `main-vertical`）
  - `mainPaneSize`: 主窗格大小百分比

#### `enforceMainPaneWidth(mainPaneId, windowWidth): Promise<void>`
强制主窗格宽度为窗口宽度的一半。
- **用途**: 确保主窗格和子窗格各占 50% 宽度
- **计算**: `mainWidth = (windowWidth - DIVIDER_WIDTH) / 2`

## 代码逻辑流程

### 创建子代理窗格流程

```
spawnTmuxPane()
├── 检查 config.enabled
├── 检查 isInsideTmux()
├── 检查 isServerRunning()
├── 获取 tmux 路径
├── 执行 split-window 命令
├── 设置窗格标题
└── 返回 SpawnPaneResult
```

### 服务器健康检查流程

```
isServerRunning()
├── 检查缓存
├── 构建 health URL
├── 尝试 fetch (最多2次)
├── 更新缓存
└── 返回结果
```

## 使用示例

```typescript
import { 
  isInsideTmux, 
  spawnTmuxPane, 
  closeTmuxPane,
  getPaneDimensions 
} from './tmux/tmux-utils';

// 检查环境
if (!isInsideTmux()) {
  console.log('Not in tmux session');
  return;
}

// 创建子代理窗格
const config = {
  enabled: true,
  layout: 'main-vertical' as TmuxLayout,
  main_pane_size: 50
};

const result = await spawnTmuxPane(
  'session-123',
  'code-reviewer',
  config,
  'http://localhost:3000',
  undefined,
  '-v'  // 垂直分割
);

if (result.success && result.paneId) {
  console.log(`Created pane: ${result.paneId}`);
  
  // 获取窗格尺寸
  const dims = await getPaneDimensions(result.paneId);
  console.log(`Pane width: ${dims?.paneWidth}`);
  
  // 稍后关闭窗格
  await closeTmuxPane(result.paneId);
}
```

## 依赖关系

- `bun`: 使用 `spawn` 执行 tmux 命令
- `../../config/schema`: `TmuxConfig`, `TmuxLayout` 类型
- `./types`: `SpawnPaneResult` 类型
- `../../tools/interactive-bash/utils`: `getTmuxPath()` 函数
- `../logger`: 日志记录

## 注意事项

1. **缓存机制**: `serverAvailable` 和 `serverCheckUrl` 用于缓存服务器状态，避免频繁检查
2. **错误处理**: 所有函数都包含适当的错误处理和日志记录
3. **环境依赖**: 必须在 tmux 会话中才能创建窗格
4. **并发安全**: 使用模块级变量缓存服务器状态，注意并发访问
5. **窗格标题**: 创建窗格时会设置标题格式为 `omo-subagent-{description(前20字符)}`
6. **路径转义**: 使用 zsh/bash 执行命令时正确处理引号转义
