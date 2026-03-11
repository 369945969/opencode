<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const sessionId = ref(route.query.sessionId as string || '')
const taskTitle = ref('任务分析中...')
const taskDescription = ref(route.query.description as string || '')
const overallStatus = ref('running')
const startTime = ref('')
const isFetchingTitle = ref(false)

const navigateToTaskList = () => {
  router.push('/')
}

// 获取标题和 sessionId
const initializeNewTask = async (description: string) => {
  isFetchingTitle.value = true
  try {
    const response = await fetch('http://localhost:4098/get-title', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description })
    })
    
    if (!response.ok) throw new Error('Failed to get title')
    const { title, sessionId: newSessionId } = await response.json()

    // 更新状态
    taskTitle.value = title
    sessionId.value = newSessionId
    startTime.value = new Date().toLocaleString()

    // 保存到 localStorage
    const newTask = {
      id: newSessionId,
      title: title,
      description: description,
      status: 'running',
      created_at: startTime.value,
      sessionId: newSessionId
    }
    const savedTasks = JSON.parse(localStorage.getItem('symphony_tasks') || '[]')
    savedTasks.unshift(newTask)
    localStorage.setItem('symphony_tasks', JSON.stringify(savedTasks))

    // 开始轮询状态
    startPolling()
  } catch (error) {
    console.error('Initialization failed:', error)
    taskTitle.value = '未命名任务'
  } finally {
    isFetchingTitle.value = false
  }
}

// 轮询获取状态逻辑
let statusInterval: any = null

const startPolling = () => {
  if (statusInterval) clearInterval(statusInterval)
  fetchStatus()
  statusInterval = setInterval(fetchStatus, 3000)
}

const fetchStatus = async () => {
  if (!sessionId.value) return

  try {
    const response = await fetch(`http://localhost:4098/sessions/${sessionId.value}`)
    if (response.ok) {
      const data = await response.json()
      
      const savedTasks = JSON.parse(localStorage.getItem('symphony_tasks') || '[]')
      const taskIndex = savedTasks.findIndex((t: any) => t.sessionId === sessionId.value)
      
      if (taskIndex > -1) {
        const isIdle = data.status === 'idle'
        const newStatus = isIdle ? 'completed' : 'running'
        
        if (savedTasks[taskIndex].status !== newStatus) {
          savedTasks[taskIndex].status = newStatus
          localStorage.setItem('symphony_tasks', JSON.stringify(savedTasks))
          overallStatus.value = newStatus
        }
      }
    }
  } catch (e) {
    console.error('Fetch status failed:', e)
  }
}

onMounted(() => {
  const isNew = route.query.isNew === 'true'
  const description = route.query.description as string

  if (isNew && description) {
    // 如果是新任务，先初始化获取标题
    initializeNewTask(description)
  } else if (sessionId.value) {
    // 如果是已有任务，从 localStorage 加载
    const savedTasks = JSON.parse(localStorage.getItem('symphony_tasks') || '[]')
    const task = savedTasks.find((t: any) => t.sessionId === sessionId.value)
    if (task) {
      taskTitle.value = task.title
      taskDescription.value = task.description
      overallStatus.value = task.status
      startTime.value = task.created_at
    }
    startPolling()
  }
})

onUnmounted(() => {
  if (statusInterval) clearInterval(statusInterval)
})

// Initial coordinates for a tree layout
const initialX = 650 // Center X
const layerGap = 140
const initialY = 120

const steps = ref([
  { id: 'step_001', name: 'TRIZ难题定义', status: 'completed', duration: '1m 20s', icon: 'lucide:target', layer: 1, x: initialX, y: initialY, parents: [] },
  { id: 'step_002', name: '根因分析', status: 'completed', duration: '5m 45s', icon: 'lucide:search', layer: 2, x: initialX, y: initialY + layerGap, parents: ['step_001'] },
  
  { id: 'step_003_1', name: '创新方向1', status: 'completed', duration: '3m 12s', icon: 'lucide:compass', layer: 3, x: initialX - 250, y: initialY + layerGap * 2, parents: ['step_002'] },
  { id: 'step_003_2', name: '创新方向2', status: 'completed', duration: '3m 12s', icon: 'lucide:compass', layer: 3, x: initialX + 250, y: initialY + layerGap * 2, parents: ['step_002'] },
  
  { id: 'step_004_1', name: '工具推荐1', status: 'running', duration: '1m 05s', icon: 'lucide:wrench', layer: 4, x: initialX - 250, y: initialY + layerGap * 3, parents: ['step_003_1'] },
  { id: 'step_004_2', name: '工具推荐2', status: 'running', duration: '1m 05s', icon: 'lucide:wrench', layer: 4, x: initialX + 250, y: initialY + layerGap * 3, parents: ['step_003_2'] },
  
  { id: 'step_005_1', name: '39×39硬件矩阵', status: 'waiting', duration: '', icon: 'lucide:cpu', layer: 5, x: initialX - 375, y: initialY + layerGap * 4, parents: ['step_004_1'] },
  { id: 'step_005_2', name: '24×24软件矩阵', status: 'waiting', duration: '', icon: 'lucide:code', layer: 5, x: initialX - 125, y: initialY + layerGap * 4, parents: ['step_004_1'] },
  { id: 'step_005_3', name: '39×39硬件矩阵', status: 'waiting', duration: '', icon: 'lucide:cpu', layer: 5, x: initialX + 125, y: initialY + layerGap * 4, parents: ['step_004_2'] },
  { id: 'step_005_4', name: '24×24软件矩阵', status: 'waiting', duration: '', icon: 'lucide:code', layer: 5, x: initialX + 375, y: initialY + layerGap * 4, parents: ['step_004_2'] },
  
  { id: 'step_006_1', name: '点子1', status: 'waiting', duration: '', icon: 'lucide:lightbulb', layer: 6, x: initialX - 375, y: initialY + layerGap * 5, parents: ['step_005_1'] },
  { id: 'step_006_2', name: '点子2', status: 'waiting', duration: '', icon: 'lucide:lightbulb', layer: 6, x: initialX - 125, y: initialY + layerGap * 5, parents: ['step_005_2'] },
  { id: 'step_006_3', name: '点子3', status: 'waiting', duration: '', icon: 'lucide:lightbulb', layer: 6, x: initialX + 125, y: initialY + layerGap * 5, parents: ['step_005_3'] },
  { id: 'step_006_4', name: '点子4', status: 'waiting', duration: '', icon: 'lucide:lightbulb', layer: 6, x: initialX + 375, y: initialY + layerGap * 5, parents: ['step_005_4'] },
])

// Dragging Logic
const draggingNodeId = ref<string | null>(null)
const dragOffset = { x: 0, y: 0 }

const onMouseDown = (e: MouseEvent, id: string) => {
  const node = steps.value.find(s => s.id === id)
  if (node) {
    draggingNodeId.value = id
    dragOffset.x = e.clientX - node.x
    dragOffset.y = e.clientY - node.y
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }
}

const onMouseMove = (e: MouseEvent) => {
  if (draggingNodeId.value) {
    const node = steps.value.find(s => s.id === draggingNodeId.value)
    if (node) {
      node.x = e.clientX - dragOffset.x
      node.y = e.clientY - dragOffset.y
    }
  }
}

const onMouseUp = () => {
  draggingNodeId.value = null
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
}

// SVG Line Calculation
const getBezierPath = (parentId: string, childId: string) => {
  const parent = steps.value.find(s => s.id === parentId)
  const child = steps.value.find(s => s.id === childId)
  if (!parent || !child) return ''

  const startX = parent.x + 80 // Half of min-w-[160px]
  const startY = parent.y + 48 // Node height roughly
  const endX = child.x + 80
  const endY = child.y

  const cp1y = startY + (endY - startY) / 2
  const cp2y = startY + (endY - startY) / 2

  return `M ${startX} ${startY} C ${startX} ${cp1y}, ${endX} ${cp2y}, ${endX} ${endY}`
}

const logs = [
  {
    time: '10:05:12',
    type: 'thought',
    label: 'AI 思考',
    content: '正在进行根因分析。PPG 测量误差主要源于皮肤-传感器界面的微动、环境光干扰以及血流灌注不足。',
    details: '根本原因识别：\n1. 运动伪影 (Motion Artifacts)\n2. 传感器接触压力不均\n3. 皮肤透射率差异',
    status: 'success'
  },
  {
    time: '10:08:30',
    type: 'thought',
    label: 'AI 思考',
    content: '识别到硬件结构和软件算法均有优化空间。正在并行启动多维创新方向分析：1. 硬件结构改进 2. 信号处理算法优化。',
    details: '创新方向：\n- 硬件：多波长光源阵列、压力自适应结构\n- 软件：深度学习降噪、动态运动补偿',
    status: 'success'
  },
  {
    time: '10:09:15',
    type: 'mcp',
    label: 'MCP 调用',
    icon: 'lucide:database',
    name: 'matrix_recommender',
    params: '{\n  "problem_type": "hybrid",\n  "matrices": ["matrix39", "matrix24"]\n}',
    duration: '1.2s',
    status: 'success'
  },
  {
    time: '10:09:17',
    type: 'return',
    label: '工具返回',
    data: '{\n  "tool_recommendation_1": [\n    {"id": "matrix39", "name": "39×39 硬件矩阵", "relevance": 0.95},\n    {"id": "effects_db", "name": "物理效应库", "relevance": 0.82}\n  ],\n  "tool_recommendation_2": [\n    {"id": "matrix24", "name": "24×24 软件矩阵", "relevance": 0.88},\n    {"id": "standard_solutions", "name": "76标准解系统", "relevance": 0.75}\n  ]\n}',
    meta: '推荐引擎: TRIZ Advisor v2',
    status: 'success'
  }
]
</script>

<template>
  <div class="font-[-apple-system,BlinkMacSystemFont,'Segoe UI'] w-full min-h-screen" style="line-height: 1.5; background: rgba(10, 25, 41, 1);">
    <header style="background: rgba(10, 25, 41, 1);" class="w-full">
      <nav style="padding: 1rem 1.5rem;" class="flex justify-between items-center w-full">
        <div class="flex items-center gap-y-8 gap-x-8">
          <div class="flex items-center gap-y-3 gap-x-3 cursor-pointer" @click="navigateToTaskList">
            <div style="background-color: color-mix( in oklab , #00D9FF 15% , transparent ); border-color: color-mix( in oklab , #00D9FF 30% , transparent );" class="flex justify-center items-center w-8 h-8 border-[1px] border-solid rounded-lg">
              <iconify-icon style="color: rgba(0, 217, 255, 1);" icon="lucide:workflow" class="text-lg"></iconify-icon>
            </div>
            <span style="color: color-mix( in oklab , #fff 95% , transparent );" class="text-lg font-semibold">WorkflowAI</span>
          </div>

          <div style="color: color-mix( in oklab , #fff 70% , transparent );" class="text-sm flex items-center gap-y-2 gap-x-2">
            <span class="hover:text-white cursor-pointer" @click="navigateToTaskList">任务列表</span>
            <iconify-icon icon="lucide:chevron-right" class="text-xs"></iconify-icon>
            <span style="color: color-mix( in oklab , #fff 95% , transparent );" class="truncate max-w-[200px]">{{ taskTitle }}</span>
          </div>

          <div style="background-color: color-mix( in oklab , #fff 8% , transparent ); backdrop-filter: blur(24px); padding: 0.5rem 0.75rem; border-color: color-mix( in oklab , #fff 10% , transparent );" class="flex items-center min-w-[200px] border-[1px] border-solid rounded-lg">
            <span style="color: color-mix( in oklab , #fff 70% , transparent );" class="text-sm mr-2">当前任务</span>
            <div class="bg-transparent flex justify-center items-center w-4 h-4">
              <iconify-icon style="color: color-mix( in oklab , #fff 50% , transparent );" icon="lucide:chevron-down" class="text-sm"></iconify-icon>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-y-4 gap-x-4">
          <button class="hover:bg-white/[0.08] hover:border-[#00D9FF]/30 flex justify-center items-center w-10 h-10 border-[1px] border-solid rounded-lg" style="background-color: color-mix( in oklab , #fff 5% , transparent ); backdrop-filter: blur(24px); border-color: color-mix( in oklab , #fff 10% , transparent );">
            <iconify-icon style="color: color-mix( in oklab , #fff 70% , transparent );" icon="lucide:refresh-cw" class="text-base"></iconify-icon>
          </button>

          <div class="hover:bg-white/[0.08] hover:border-[#00D9FF]/30 flex relative justify-center items-center w-10 h-10 border-[1px] border-solid rounded-full" style="background-color: color-mix( in oklab , #fff 5% , transparent ); backdrop-filter: blur(24px); border-color: color-mix( in oklab , #fff 10% , transparent );">
            <iconify-icon style="color: color-mix( in oklab , #fff 70% , transparent );" icon="lucide:bell" class="text-base"></iconify-icon>
            <div style="background-color: rgba(255, 107, 107, 1); box-shadow: 0 2px 8px rgba(255, 107, 107, 0.4); border-color: rgba(10, 25, 41, 1);" class="flex absolute -top-1 -right-1 justify-center items-center w-5 h-5 border-[2px] border-solid rounded-full">
              <span style="color: rgba(255, 255, 255, 1);" class="text-[10px] font-semibold">3</span>
            </div>
          </div>

          <div class="flex items-center gap-y-2 gap-x-2">
            <img style="border-color: color-mix( in oklab , #fff 10% , transparent );" alt="Avatar" src="https://static.paraflowcontent.com/public/resource/image/c7061dc6-4665-4e15-b851-92f61bb46803.jpeg" class="w-9 h-9 object-cover border-[2px] border-solid rounded-full">
            <div class="bg-transparent flex justify-center items-center w-4 h-4">
              <iconify-icon style="color: color-mix( in oklab , #fff 70% , transparent );" icon="lucide:chevron-down" class="text-sm"></iconify-icon>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <div class="flex w-full min-h-[calc(100vh-64px)]">
      <main class="overflow-x-hidden flex flex-col grow shrink pr-6 pl-6">
        <!-- Status Bar -->
        <div style="background-color: color-mix( in oklab , #fff 8% , transparent ); backdrop-filter: blur(24px); box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25); border-color: color-mix( in oklab , #fff 10% , transparent );" class="mt-6 mb-6 p-6 border-[1px] border-solid rounded-xl">
          <div class="flex justify-between items-start mb-6">
            <div class="grow shrink">
              <h1 style="color: color-mix( in oklab , #fff 95% , transparent );" class="text-xl mb-2 font-semibold">{{ taskTitle }}</h1>
              <div class="flex items-center gap-y-4 gap-x-4 mb-4">
                <div :style="{ 
                  backgroundColor: overallStatus === 'running' ? 'color-mix(in oklab, #10B981 15%, transparent)' : 'color-mix(in oklab, #00D9FF 15%, transparent)',
                  borderColor: overallStatus === 'running' ? 'color-mix(in oklab, #10B981 30%, transparent)' : 'color-mix(in oklab, #00D9FF 30%, transparent)'
                }" class="flex items-center gap-y-1 gap-x-1 border-[1px] border-solid rounded-full px-3 py-1">
                  <div :style="{ backgroundColor: overallStatus === 'running' ? '#10B981' : '#00D9FF' }" class="w-2 h-2 rounded-full" :class="{ 'animate-pulse': overallStatus === 'running' }"></div>
                  <span :style="{ color: overallStatus === 'running' ? '#10B981' : '#00D9FF' }" class="text-xs font-medium">
                    {{ overallStatus === 'running' ? '运行中' : '已完成' }}
                  </span>
                </div>
                <span style="color: color-mix( in oklab , #fff 70% , transparent );" class="text-sm">Session: {{ sessionId }}</span>
                <span style="color: color-mix( in oklab , #fff 50% , transparent );">•</span>
                <span style="color: color-mix( in oklab , #fff 70% , transparent );" class="text-sm">开始时间: {{ startTime }}</span>
              </div>

              <p style="color: color-mix( in oklab , #fff 60% , transparent );" class="text-sm line-clamp-2 max-w-3xl mb-4">{{ taskDescription }}</p>
            </div>

            <div class="flex items-center gap-y-2 gap-x-2">
              <button class="hover:bg-white/[0.12] hover:border-[#00D9FF]/30 hover:shadow-[0_4px_16px_rgba(0,217,255,0.2)] flex items-center border-[1px] border-solid rounded-lg" style="background-color: color-mix( in oklab , #fff 8% , transparent ); backdrop-filter: blur(24px); box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25); padding: 0.5rem 1rem; border-color: color-mix( in oklab , #fff 10% , transparent );">
                <iconify-icon style="color: color-mix( in oklab , #fff 70% , transparent );" icon="lucide:pause" class="text-sm mr-2"></iconify-icon>
                <span style="color: color-mix( in oklab , #fff 70% , transparent );" class="text-sm">暂停</span>
              </button>
              <button class="hover:bg-[#FF6B6B]/[0.15] hover:border-[#FF6B6B]/30 flex items-center border-[1px] border-solid rounded-lg" style="background-color: color-mix( in oklab , #fff 8% , transparent ); backdrop-filter: blur(24px); box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25); padding: 0.5rem 1rem; border-color: color-mix( in oklab , #fff 10% , transparent );">
                <iconify-icon style="color: color-mix( in oklab , #fff 70% , transparent );" icon="lucide:square" class="text-sm mr-2"></iconify-icon>
                <span style="color: color-mix( in oklab , #fff 70% , transparent );" class="text-sm">停止</span>
              </button>
              <button class="hover:bg-[#00D9FF]/[0.15] hover:border-[#00D9FF]/30 flex items-center border-[1px] border-solid rounded-lg" style="background-color: color-mix( in oklab , #fff 8% , transparent ); backdrop-filter: blur(24px); box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25); padding: 0.5rem 1rem; border-color: color-mix( in oklab , #fff 10% , transparent );">
                <iconify-icon style="color: color-mix( in oklab , #fff 70% , transparent );" icon="lucide:repeat" class="text-sm mr-2"></iconify-icon>
                <span style="color: color-mix( in oklab , #fff 70% , transparent );" class="text-sm">重新执行</span>
              </button>
            </div>
          </div>
        </div>

        <div class="flex grow shrink gap-y-6 gap-x-6 pb-6">
          <!-- Graph Area -->
          <div style="background-color: color-mix( in oklab , #fff 5% , transparent ); backdrop-filter: blur(24px); box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25); border-color: color-mix( in oklab , #fff 10% , transparent );" class="grow shrink p-6 border-[1px] border-solid rounded-xl relative overflow-hidden">
            <div class="flex justify-between items-center mb-6">
              <h2 style="color: color-mix( in oklab , #fff 95% , transparent );" class="text-lg font-semibold">执行图谱</h2>
              <div class="flex items-center gap-y-2 gap-x-2">
                <button class="hover:bg-white/[0.08] flex justify-center items-center w-8 h-8 border-[1px] border-solid rounded-lg" style="background-color: color-mix( in oklab , #fff 5% , transparent ); backdrop-filter: blur(24px); border-color: color-mix( in oklab , #fff 10% , transparent );">
                  <iconify-icon style="color: color-mix( in oklab , #fff 70% , transparent );" icon="lucide:zoom-in" class="text-sm"></iconify-icon>
                </button>
                <button class="hover:bg-white/[0.08] flex justify-center items-center w-8 h-8 border-[1px] border-solid rounded-lg" style="background-color: color-mix( in oklab , #fff 5% , transparent ); backdrop-filter: blur(24px); border-color: color-mix( in oklab , #fff 10% , transparent );">
                  <iconify-icon style="color: color-mix( in oklab , #fff 70% , transparent );" icon="lucide:zoom-out" class="text-sm"></iconify-icon>
                </button>
                <button class="hover:bg-white/[0.08] flex justify-center items-center w-8 h-8 border-[1px] border-solid rounded-lg" style="background-color: color-mix( in oklab , #fff 5% , transparent ); backdrop-filter: blur(24px); border-color: color-mix( in oklab , #fff 10% , transparent );">
                  <iconify-icon style="color: color-mix( in oklab , #fff 70% , transparent );" icon="lucide:maximize" class="text-sm"></iconify-icon>
                </button>
              </div>
            </div>

            <div style="background-color: color-mix( in oklab , #fff 2% , transparent ); backdrop-filter: blur(24px); border-color: color-mix( in oklab , #fff 5% , transparent );" class="relative min-h-[1000px] p-4 border-[1px] border-solid rounded-lg overflow-hidden">
              <!-- SVG Overlay for Connections -->
              <svg width="100%" height="100%" class="absolute top-0 left-0 pointer-events-none z-0 overflow-visible">
                <template v-for="step in steps" :key="'lines-' + step.id">
                  <path v-for="parentId in step.parents" :key="parentId"
                    :d="getBezierPath(parentId, step.id)"
                    stroke="rgba(255,255,255,0.3)" stroke-width="2" fill="none" />
                </template>
              </svg>

              <!-- Draggable Nodes -->
              <div v-for="step in steps" :key="step.id" 
                @mousedown="onMouseDown($event, step.id)"
                :class="[
                  'p-2 border-[1px] rounded-lg min-w-[160px] transition-shadow duration-200 absolute z-20 cursor-move select-none',
                  step.status === 'completed' ? 'hover:shadow-[0_6px_16px_rgba(16,185,129,0.4)]' : 
                  step.status === 'running' ? 'hover:shadow-[0_6px_16px_rgba(0,217,255,0.4)]' : '',
                  step.status === 'waiting' ? 'opacity-50 border-dashed border-white/10 bg-white/2' : 'border-solid'
                ]"
                :style="{
                  left: step.x + 'px',
                  top: step.y + 'px',
                  backgroundColor: step.status === 'completed' ? 'color-mix(in oklab, #10B981 15%, transparent)' : 
                                   step.status === 'running' ? 'color-mix(in oklab, #00D9FF 15%, transparent)' : 'color-mix(in oklab, #fff 2%, transparent)',
                  borderColor: step.status === 'completed' ? 'color-mix(in oklab, #10B981 50%, transparent)' : 
                               step.status === 'running' ? 'color-mix(in oklab, #00D9FF 50%, transparent)' : 'color-mix(in oklab, #fff 10%, transparent)',
                  backdropFilter: 'blur(24px)',
                  boxShadow: step.status === 'completed' ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 
                             step.status === 'running' ? '0 4px 12px rgba(0, 217, 255, 0.4)' : 'none'
                }"
              >
                <div class="flex items-center gap-y-2 gap-x-2 mb-1">
                  <div class="relative">
                    <div :style="{ backgroundColor: step.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : step.status === 'running' ? 'rgba(0, 217, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)' }" class="flex justify-center items-center w-8 h-8 rounded-lg border border-white/10 shrink-0">
                      <iconify-icon 
                        :style="{ color: step.status === 'completed' ? '#10B981' : step.status === 'running' ? '#00D9FF' : '#fff8' }" 
                        :icon="step.icon" 
                        class="text-sm"
                      ></iconify-icon>
                    </div>
                    <div v-if="step.status === 'running'" style="background-color: rgba(0, 217, 255, 1);" class="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse"></div>
                  </div>
                  <span style="color: color-mix( in oklab , #fff 95% , transparent );" class="text-[13px] font-medium leading-tight truncate">{{ step.name }}</span>
                </div>
                <div style="color: color-mix( in oklab , #fff 70% , transparent );" class="text-xs">ID: {{ step.id }}</div>
                <div :style="{ color: step.status === 'completed' ? '#10B981' : step.status === 'running' ? '#00D9FF' : '#fff5' }" class="text-xs">
                  {{ step.status === 'completed' ? '✓ 已完成 (' + step.duration + ')' : 
                     step.status === 'running' ? '⏳ 运行中 (' + step.duration + ')' : '⏸ 等待中' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar Monitor -->
          <div style="background-color: color-mix( in oklab , #fff 8% , transparent ); backdrop-filter: blur(24px); box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25); border-color: color-mix( in oklab , #fff 10% , transparent );" class="flex flex-col w-[400px] border-[1px] border-solid rounded-xl">
            <div style="border-bottom-style: solid; border-color: color-mix( in oklab , #fff 10% , transparent );" class="border-b-[1px] p-4">
              <div class="flex justify-between items-center mb-2">
                <h3 style="color: color-mix( in oklab , #fff 95% , transparent );" class="text-lg font-semibold">TRIZ 创新分析</h3>
                <button class="hover:bg-white/[0.08] flex justify-center items-center w-6 h-6 rounded-sm">
                  <iconify-icon style="color: color-mix( in oklab , #fff 70% , transparent );" icon="lucide:x" class="text-sm"></iconify-icon>
                </button>
              </div>
              <div class="flex items-center gap-y-2 gap-x-2 mb-2">
                <div style="background-color: color-mix( in oklab , #00D9FF 15% , transparent ); backdrop-filter: blur(24px); padding: 0.25rem 0.5rem; border-color: color-mix( in oklab , #00D9FF 30% , transparent );" class="flex items-center gap-y-1 gap-x-1 border-[1px] border-solid rounded-full">
                  <div style="background-color: rgba(0, 217, 255, 1);" class="w-2 h-2 rounded-full"></div>
                  <span style="color: rgba(0, 217, 255, 1);" class="text-xs font-medium">运行中</span>
                </div>
              </div>
              <div style="color: color-mix( in oklab , #fff 50% , transparent );" class="text-xs">
                <span>Session ID: {{ sessionId }}</span>
                <iconify-icon class="hover:text-white/70 text-xs ml-1 cursor-pointer" style="color: color-mix( in oklab , #fff 50% , transparent );" icon="lucide:copy"></iconify-icon>
              </div>
            </div>

            <div style="border-bottom-style: solid; border-color: color-mix( in oklab , #fff 10% , transparent );" class="border-b-[1px] p-4">
              <div class="flex justify-between items-center mb-3">
                <div class="flex items-center gap-x-2">
                  <button style="background-color: color-mix( in oklab , #00D9FF 15% , transparent ); backdrop-filter: blur(24px); color: rgba(0, 217, 255, 1); padding: 0.25rem 0.5rem; border-color: color-mix( in oklab , #00D9FF 30% , transparent );" class="text-xs border-[1px] border-solid rounded-sm">全部</button>
                  <button class="hover:bg-white/[0.08] text-xs border-[1px] border-solid rounded-sm" style="background-color: color-mix( in oklab , #fff 5% , transparent ); backdrop-filter: blur(24px); color: color-mix( in oklab , #fff 70% , transparent ); padding: 0.25rem 0.5rem; border-color: color-mix( in oklab , #fff 10% , transparent );">思考</button>
                  <button class="hover:bg-white/[0.08] text-xs border-[1px] border-solid rounded-sm" style="background-color: color-mix( in oklab , #fff 5% , transparent ); backdrop-filter: blur(24px); color: color-mix( in oklab , #fff 70% , transparent ); padding: 0.25rem 0.5rem; border-color: color-mix( in oklab , #fff 10% , transparent );">工具调用</button>
                </div>
                <button class="hover:bg-white/[0.08] flex justify-center items-center w-6 h-6 rounded-sm">
                  <iconify-icon style="color: color-mix( in oklab , #fff 70% , transparent );" icon="lucide:download" class="text-sm"></iconify-icon>
                </button>
              </div>
              <div class="flex items-center gap-x-2">
                <div style="background-color: color-mix( in oklab , #fff 5% , transparent ); backdrop-filter: blur(24px); flex-basis: 0%; padding: 0.25rem 0.5rem; border-color: color-mix( in oklab , #fff 10% , transparent );" class="flex grow shrink items-center border-[1px] border-solid rounded-lg">
                  <iconify-icon style="color: color-mix( in oklab , #fff 50% , transparent );" icon="lucide:search" class="text-xs mr-2"></iconify-icon>
                  <input style="flex-basis: 0%; color: color-mix( in oklab , #fff 95% , transparent );" type="text" placeholder="搜索消息..." class="text-xs bg-transparent grow shrink outline-none border-none">
                </div>
                <label class="flex items-center gap-x-1 cursor-pointer">
                  <input class="hidden" type="checkbox" checked>
                  <div style="background-color: color-mix( in oklab , #fff 5% , transparent ); backdrop-filter: blur(24px); border-color: color-mix( in oklab , #fff 10% , transparent );" class="flex justify-center items-center w-4 h-4 text-[#00D9FF] border-[1px] border-solid rounded-sm">
                    <iconify-icon icon="lucide:check" class="text-[10px]"></iconify-icon>
                  </div>
                  <span style="color: color-mix( in oklab , #fff 70% , transparent );" class="text-xs">自动滚动</span>
                </label>
              </div>
            </div>

            <div class="overflow-y-auto grow shrink p-4 space-y-4">
              <div v-for="(log, idx) in logs" :key="idx" style="background-color: color-mix( in oklab , #fff 3% , transparent ); backdrop-filter: blur(24px); border-color: color-mix( in oklab , #fff 5% , transparent );" class="p-3 border-[1px] border-solid rounded-lg">
                <div class="flex items-center gap-x-2 mb-2">
                  <div style="color: color-mix( in oklab , #fff 50% , transparent );" class="text-xs">{{ log.time }}</div>
                  <div :style="{
                    backgroundColor: log.type === 'thought' ? 'color-mix(in oklab, #A78BFA 15%, transparent)' : 'color-mix(in oklab, #00D9FF 15%, transparent)',
                    color: log.type === 'thought' ? '#A78BFA' : '#00D9FF',
                    borderColor: log.type === 'thought' ? 'color-mix(in oklab, #A78BFA 30%, transparent)' : 'color-mix(in oklab, #00D9FF 30%, transparent)'
                  }" class="text-xs border-[1px] border-solid rounded-sm px-2 py-0.5">{{ log.label }}</div>
                </div>
                
                <div v-if="log.type === 'thought'">
                  <div style="color: color-mix( in oklab , #fff 70% , transparent );" class="text-sm mb-2">{{ log.content }}</div>
                  <div style="color: color-mix( in oklab , #fff 50% , transparent );" class="text-xs whitespace-pre-line">{{ log.details }}</div>
                </div>

                <div v-if="log.type === 'mcp'">
                  <div class="flex items-center gap-x-2 mb-2">
                    <iconify-icon style="color: rgba(0, 217, 255, 1);" :icon="log.icon" class="text-sm"></iconify-icon>
                    <span style="color: color-mix( in oklab , #fff 95% , transparent );" class="text-sm font-medium">{{ log.name }}</span>
                    <div style="background-color: color-mix( in oklab , #10B981 15% , transparent ); color: #10B981;" class="text-xs px-2 py-0.5 rounded-sm">成功</div>
                  </div>
                  <details class="text-xs">
                    <summary style="color: color-mix( in oklab , #fff 70% , transparent );" class="mb-2 cursor-pointer">调用参数</summary>
                    <pre style="background-color: color-mix( in oklab , #000 20% , transparent ); color: color-mix( in oklab , #fff 60% , transparent );" class="text-[10px] p-2 rounded-sm">{{ log.params }}</pre>
                  </details>
                  <div style="color: color-mix( in oklab , #fff 50% , transparent );" class="text-xs mt-2">执行耗时: {{ log.duration }}</div>
                </div>

                <div v-if="log.type === 'return'">
                  <details class="text-xs">
                    <summary style="color: color-mix( in oklab , #fff 70% , transparent );" class="mb-2 cursor-pointer">返回数据</summary>
                    <pre style="background-color: color-mix( in oklab , #000 20% , transparent ); color: color-mix( in oklab , #fff 60% , transparent );" class="overflow-y-auto max-h-20 text-[10px] p-2 rounded-sm">{{ log.data }}</pre>
                  </details>
                  <div style="color: color-mix( in oklab , #fff 50% , transparent );" class="text-xs mt-2">{{ log.meta }}</div>
                </div>
              </div>

              <!-- Running Item -->
              <div style="background-color: color-mix( in oklab , #00D9FF 8% , transparent ); backdrop-filter: blur(24px); border-color: color-mix( in oklab , #00D9FF 30% , transparent );" class="p-3 border-[1px] border-solid rounded-lg">
                <div class="flex items-center gap-x-2 mb-2">
                  <div style="color: color-mix( in oklab , #fff 50% , transparent );" class="text-xs">14:35:42</div>
                  <div style="background-color: color-mix( in oklab , #00D9FF 15% , transparent ); color: #00D9FF;" class="text-xs border-[1px] border-solid rounded-sm px-2 py-0.5">MCP 调用</div>
                </div>
                <div class="flex items-center gap-x-2">
                  <iconify-icon style="color: rgba(0, 217, 255, 1);" icon="lucide:chart-bar" class="text-sm"></iconify-icon>
                  <span style="color: color-mix( in oklab , #fff 95% , transparent );" class="text-sm font-medium">statistical_engine</span>
                  <div class="flex items-center gap-x-1">
                    <div style="background-color: rgba(0, 217, 255, 1);" class="w-2 h-2 rounded-full animate-pulse"></div>
                    <span style="color: rgba(0, 217, 255, 1);" class="text-xs">执行中</span>
                  </div>
                </div>
              </div>
            </div>

            <div style="border-top-style: solid; border-color: color-mix( in oklab , #fff 10% , transparent );" class="border-t-[1px] p-4">
              <div style="color: rgba(0, 217, 255, 1);" class="text-sm flex items-center gap-x-2">
                <div style="background-color: rgba(0, 217, 255, 1);" class="w-2 h-2 rounded-full animate-pulse"></div>
                <span>正在根据推荐的多个工具识别创新原理并生成点子...</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Any additional local styles if needed */
</style>
