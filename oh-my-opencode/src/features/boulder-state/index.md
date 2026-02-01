# Boulder State Module

## 文件功能概述

`boulder-state` 模块管理 Sisyphus 编排器的活动工作计划状态。以希腊神话中西西弗斯的巨石命名，象征着需要不断推进的永恒任务。

## 模块组成

- `types.ts`: 类型定义（BoulderState, PlanProgress）
- `storage.ts`: 存储操作（读写 boulder.json）
- `constants.ts`: 常量定义（路径、文件名）
- `index.ts`: 模块入口，统一导出

## 核心概念

### BoulderState

表示当前活动的工作计划状态，存储在 `.sisyphus/boulder.json` 文件中。

```typescript
interface BoulderState {
  active_plan: string      // 活动计划文件的绝对路径
  started_at: string       // 工作开始时间（ISO 格式）
  session_ids: string[]    // 参与此计划的工作会话ID列表
  plan_name: string        // 计划名称（从文件名派生）
}
```

### PlanProgress

跟踪计划执行进度，通过解析 Markdown 文件中的复选框计算。

```typescript
interface PlanProgress {
  total: number        // 总任务数（复选框数）
  completed: number    // 已完成任务数
  isComplete: boolean  // 是否全部完成
}
```

## 使用示例

```typescript
import { 
  readBoulderState, 
  writeBoulderState, 
  createBoulderState,
  getPlanProgress,
  findPrometheusPlans 
} from "./storage"

// 读取当前状态
const state = readBoulderState("/project/path")

// 创建新状态
const newState = createBoulderState(
  "/project/path/.sisyphus/plans/feature.md",
  "session-123"
)
writeBoulderState("/project/path", newState)

// 跟踪进度
const progress = getPlanProgress("/project/path/.sisyphus/plans/feature.md")
console.log(`${progress.completed}/${progress.total} tasks done`)

// 查找所有计划
const plans = findPrometheusPlans("/project/path")
```

## 文件结构

```
project/
└── .sisyphus/
    ├── boulder.json          # 当前活动计划状态
    ├── notepads/             # 笔记目录
    └── plans/                # 计划文件目录
        ├── feature-a.md
        └── feature-b.md
```

## 依赖关系

- `node:fs`: 文件系统操作
- `node:path`: 路径处理

## 相关模块

- `../sisyphus-tasks`: 任务管理
- `../sisyphus-swarm`: 多代理编排
