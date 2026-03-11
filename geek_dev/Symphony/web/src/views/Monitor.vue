<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const sessionId = ref(route.query.sessionId as string || '')
const taskTitle = ref('任务分析中...')
const taskDescription = ref('')
const overallStatus = ref('running')
const startTime = ref('')
const isFetchingTitle = ref(false)

// 对话框消息逻辑
const chatMessages = ref<any[]>([])
const isAutoScroll = ref(true)
const chatScrollContainer = ref<HTMLElement | null>(null)
const expandedThoughts = ref<Record<number, boolean>>({})

const toggleThought = (idx: number) => {
  expandedThoughts.value[idx] = !expandedThoughts.value[idx]
}

const navigateToTaskList = () => {
  router.push('/')
}

// SSE 流式连接逻辑
let eventSource: EventSource | null = null

const startSseConnection = () => {
  if (!sessionId.value) return
  if (eventSource) eventSource.close()

  eventSource = new EventSource(`http://localhost:4098/sessions/${sessionId.value}/events`)

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      
      if (data.type === 'history') {
        // 加载全量历史消息
        chatMessages.value = data.messages
        overallStatus.value = data.status
      } else if (data.type === 'message') {
        // 处理单条消息更新或追加
        const updatedMsg = data.message
        const existingIdx = chatMessages.value.findIndex(m => m.id === updatedMsg.id)
        
        if (existingIdx > -1) {
          // 如果消息已存在且是助手消息，对比思考过程决定是否自动展开
          const oldMsg = chatMessages.value[existingIdx]
          if (updatedMsg.thinking && updatedMsg.thinking !== oldMsg.thinking && !expandedThoughts.value[existingIdx]) {
            expandedThoughts.value[existingIdx] = true
          }
          chatMessages.value[existingIdx] = { ...updatedMsg }
        } else if (!updatedMsg.isInternal) {
          // 如果是新消息且非内部，追加
          chatMessages.value.push(updatedMsg)
        }
      } else if (data.type === 'status') {
        // 更新全局状态
        overallStatus.value = data.status
        
        // 同步到本地存储
        const savedTasks = JSON.parse(localStorage.getItem('symphony_tasks') || '[]')
        const taskIndex = savedTasks.findIndex((t: any) => t.sessionId === sessionId.value)
        if (taskIndex > -1) {
          savedTasks[taskIndex].status = data.status === 'idle' ? 'completed' : 'running'
          localStorage.setItem('symphony_tasks', JSON.stringify(savedTasks))
        }
      }

      // 自动滚动
      if (isAutoScroll.value) {
        setTimeout(() => {
          if (chatScrollContainer.value) {
            chatScrollContainer.value.scrollTop = chatScrollContainer.value.scrollHeight
          }
        }, 100)
      }
    } catch (e) {
      console.error('Failed to parse SSE data:', e)
    }
  }

  eventSource.onerror = (err) => {
    console.error('SSE connection error:', err)
    eventSource?.close()
    // 5秒后尝试重连
    setTimeout(startSseConnection, 5000)
  }
}

onMounted(() => {
  const isNew = route.query.isNew === 'true'
  
  if (isNew) {
    const description = sessionStorage.getItem('pending_task_description')
    if (description) {
      initializeNewTask(description)
    } else {
      router.push('/')
    }
  } else if (sessionId.value) {
    const savedTasks = JSON.parse(localStorage.getItem('symphony_tasks') || '[]')
    const task = savedTasks.find((t: any) => t.sessionId === sessionId.value)
    if (task) {
      taskTitle.value = task.title
      taskDescription.value = task.description
      overallStatus.value = task.status
      startTime.value = task.created_at
    }
    startSseConnection()
  }
})

onUnmounted(() => {
  if (eventSource) eventSource.close()
})

// 获取标题并初始化（完成后启动 SSE）
const initializeNewTask = async (description: string) => {
  isFetchingTitle.value = true
  taskDescription.value = description
  try {
    const response = await fetch('http://localhost:4098/get-title', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description })
    })
    
    if (!response.ok) throw new Error('Failed to get title')
    const { title, sessionId: newSessionId } = await response.json()

    taskTitle.value = title
    sessionId.value = newSessionId
    startTime.value = new Date().toLocaleString()

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

    sessionStorage.removeItem('pending_task_description')

    // 初始化完成后，启动 SSE 连接
    startSseConnection()
  } catch (error) {
    console.error('Initialization failed:', error)
    taskTitle.value = '未命名任务'
  } finally {
    isFetchingTitle.value = false
  }
}

// Initial coordinates for a tree layout
const initialX = 650 // Center X
const layerGap = 140
const initialY = 120

const steps = ref<any[]>([
  { id: 'step_001', name: 'TRIZ难题定义', status: 'running', duration: '等待中...', icon: 'lucide:target', layer: 1, x: initialX, y: initialY, parents: [], displayId: '' },
  { id: 'step_002', name: '根因分析', status: 'waiting', duration: '', icon: 'lucide:search', layer: 2, x: initialX, y: initialY + layerGap, parents: ['step_001'], displayId: 'step_002' },
  
  { id: 'step_003_1', name: '创新方向1', status: 'waiting', duration: '', icon: 'lucide:compass', layer: 3, x: initialX - 250, y: initialY + layerGap * 2, parents: ['step_002'], displayId: 'step_003_1' },
  { id: 'step_003_2', name: '创新方向2', status: 'waiting', duration: '', icon: 'lucide:compass', layer: 3, x: initialX + 250, y: initialY + layerGap * 2, parents: ['step_002'], displayId: 'step_003_2' },
  
  { id: 'step_004_1', name: '工具推荐1', status: 'waiting', duration: '', icon: 'lucide:wrench', layer: 4, x: initialX - 250, y: initialY + layerGap * 3, parents: ['step_003_1'], displayId: 'step_004_1' },
  { id: 'step_004_2', name: '工具推荐2', status: 'waiting', duration: '', icon: 'lucide:wrench', layer: 4, x: initialX + 250, y: initialY + layerGap * 3, parents: ['step_003_2'], displayId: 'step_004_2' },
  
  { id: 'step_005_1', name: '39×39硬件矩阵', status: 'waiting', duration: '', icon: 'lucide:cpu', layer: 5, x: initialX - 375, y: initialY + layerGap * 4, parents: ['step_004_1'], displayId: 'step_005_1' },
  { id: 'step_005_2', name: '24×24软件矩阵', status: 'waiting', duration: '', icon: 'lucide:code', layer: 5, x: initialX - 125, y: initialY + layerGap * 4, parents: ['step_004_1'], displayId: 'step_005_2' },
  { id: 'step_005_3', name: '39×39硬件矩阵', status: 'waiting', duration: '', icon: 'lucide:cpu', layer: 5, x: initialX + 125, y: initialY + layerGap * 4, parents: ['step_004_2'], displayId: 'step_005_3' },
  { id: 'step_005_4', name: '24×24软件矩阵', status: 'waiting', duration: '', icon: 'lucide:code', layer: 5, x: initialX + 375, y: initialY + layerGap * 4, parents: ['step_004_2'], displayId: 'step_005_4' },
  
  { id: 'step_006_1', name: '点子1', status: 'waiting', duration: '', icon: 'lucide:lightbulb', layer: 6, x: initialX - 375, y: initialY + layerGap * 5, parents: ['step_005_1'], displayId: 'step_006_1' },
  { id: 'step_006_2', name: '点子2', status: 'waiting', duration: '', icon: 'lucide:lightbulb', layer: 6, x: initialX - 125, y: initialY + layerGap * 5, parents: ['step_005_2'], displayId: 'step_006_2' },
  { id: 'step_006_3', name: '点子3', status: 'waiting', duration: '', icon: 'lucide:lightbulb', layer: 6, x: initialX + 125, y: initialY + layerGap * 5, parents: ['step_005_3'], displayId: 'step_006_3' },
  { id: 'step_006_4', name: '点子4', status: 'waiting', duration: '', icon: 'lucide:lightbulb', layer: 6, x: initialX + 375, y: initialY + layerGap * 5, parents: ['step_005_4'], displayId: 'step_006_4' },
])

// 动态更新第一个节点的状态
const updateFirstNode = () => {
  const firstNode = steps.value.find(s => s.id === 'step_001')
  if (firstNode) {
    if (isFetchingTitle.value) {
      firstNode.name = '正在定义难题...'
      firstNode.status = 'running'
      firstNode.duration = '处理中...'
      // 正在获取标题时，如果已经有了 sessionId 也可以显示，否则显示等待中
      firstNode.displayId = sessionId.value || '初始化中...'
    } else {
      firstNode.name = taskTitle.value || 'TRIZ难题定义'
      firstNode.status = 'completed'
      firstNode.duration = '已完成'
      firstNode.displayId = sessionId.value
    }
  }
}

// 监听标题和加载状态的变化
import { watch } from 'vue'
watch([taskTitle, isFetchingTitle], updateFirstNode, { immediate: true })

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

// 追踪节点实际尺寸
const nodeElements = ref<Record<string, HTMLElement>>({})
const nodeDimensions = ref<Record<string, { width: number, height: number }>>({})

const setNodeRef = (el: any, id: string) => {
  if (el) {
    nodeElements.value[id] = el
    updateNodeDimensions(id)
  }
}

const updateNodeDimensions = (id: string) => {
  const el = nodeElements.value[id]
  if (el) {
    nodeDimensions.value[id] = {
      width: el.offsetWidth,
      height: el.offsetHeight
    }
  }
}

// SVG Line Calculation
const getBezierPath = (parentId: string, childId: string) => {
  const parent = steps.value.find(s => s.id === parentId)
  const child = steps.value.find(s => s.id === childId)
  if (!parent || !child) return ''

  // 获取实际尺寸，如果没有则使用默认值
  const pDim = nodeDimensions.value[parentId] || { width: 160, height: 80 }
  const cDim = nodeDimensions.value[childId] || { width: 160, height: 80 }

  const startX = parent.x + pDim.width / 2 // 父节点水平中心
  const startY = parent.y + pDim.height     // 父节点底部
  const endX = child.x + cDim.width / 2    // 子节点水平中心
  const endY = child.y                     // 子节点顶部

  const verticalDistance = endY - startY
  const cp1y = startY + verticalDistance * 0.5
  const cp2y = startY + verticalDistance * 0.5

  return `M ${startX} ${startY} C ${startX} ${cp1y}, ${endX} ${cp2y}, ${endX} ${endY}`
}

const logs = ref<any[]>([])
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
              <div class="flex items-center gap-x-3 mb-2">
                <iconify-icon v-if="isFetchingTitle" icon="lucide:loader-2" class="text-xl text-[#00D9FF] animate-spin"></iconify-icon>
                <h1 style="color: color-mix( in oklab , #fff 95% , transparent );" class="text-xl font-semibold">
                  {{ isFetchingTitle ? '正在生成任务标题...' : taskTitle }}
                </h1>
              </div>
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
            <div class="flex justify-end items-center mb-6">
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
                :ref="(el) => setNodeRef(el, step.id)"
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
                <div style="color: color-mix( in oklab , #fff 70% , transparent );" class="text-xs">ID: {{ step.displayId || step.id }}</div>
                <div :style="{ color: step.status === 'completed' ? '#10B981' : step.status === 'running' ? '#00D9FF' : '#fff5' }" class="text-xs">
                  {{ step.status === 'completed' ? '✓ 已完成' : 
                     step.status === 'running' ? '⏳ 运行中 (' + step.duration + ')' : '⏸ 等待中' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Chat Sidebar -->
          <div style="background-color: color-mix( in oklab , #fff 8% , transparent ); backdrop-filter: blur(24px); box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25); border-color: color-mix( in oklab , #fff 10% , transparent );" class="flex flex-col w-[540px] border-[1px] border-solid rounded-xl">
            <div style="border-bottom-style: solid; border-color: color-mix( in oklab , #fff 10% , transparent );" class="border-b-[1px] p-4 flex justify-between items-center">
              <div class="flex items-center gap-x-3">
                <div style="background-color: color-mix( in oklab , #00D9FF 15% , transparent );" class="w-8 h-8 rounded-lg flex justify-center items-center border border-[#00D9FF]/30">
                  <iconify-icon icon="lucide:bot" class="text-[#00D9FF] text-lg"></iconify-icon>
                </div>
                <div>
                  <h3 style="color: color-mix( in oklab , #fff 95% , transparent );" class="text-sm font-semibold">AI 助手分析</h3>
                  <div class="flex items-center gap-x-1.5">
                    <div :style="{ backgroundColor: overallStatus === 'running' ? '#10B981' : '#00D9FF' }" class="w-1.5 h-1.5 rounded-full" :class="{ 'animate-pulse': overallStatus === 'running' }"></div>
                    <span style="color: color-mix( in oklab , #fff 50% , transparent );" class="text-[10px]">{{ overallStatus === 'running' ? '正在处理任务...' : '分析已完成' }}</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-x-2">
                <button class="hover:bg-white/[0.08] flex justify-center items-center w-8 h-8 rounded-lg border border-white/10">
                  <iconify-icon style="color: color-mix( in oklab , #fff 70% , transparent );" icon="lucide:download" class="text-sm"></iconify-icon>
                </button>
                <label class="flex items-center gap-x-1.5 cursor-pointer">
                  <input v-model="isAutoScroll" type="checkbox" class="hidden">
                  <div :class="['w-4 h-4 border border-white/20 rounded flex justify-center items-center transition-colors', isAutoScroll ? 'bg-[#00D9FF] border-[#00D9FF]' : 'bg-white/5']">
                    <iconify-icon v-if="isAutoScroll" icon="lucide:check" class="text-[10px] text-white"></iconify-icon>
                  </div>
                  <span style="color: color-mix( in oklab , #fff 50% , transparent );" class="text-[10px] whitespace-nowrap">自动滚动</span>
                </label>
              </div>
            </div>

            <!-- Messages Area -->
            <div ref="chatScrollContainer" class="overflow-y-auto grow shrink p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
              <div v-for="(msg, idx) in chatMessages" :key="idx" class="flex flex-col gap-y-2">
                <!-- User Message -->
                <div v-if="msg.role === 'user'" class="flex justify-end pl-12">
                  <div style="background-color: color-mix( in oklab , #00D9FF 15% , transparent ); border-color: color-mix( in oklab , #00D9FF 30% , transparent );" class="p-3 border-[1px] border-solid rounded-2xl rounded-tr-sm">
                    <p style="color: color-mix( in oklab , #fff 90% , transparent );" class="text-sm leading-relaxed">{{ msg.content }}</p>
                  </div>
                </div>

                <!-- Assistant Message -->
                <div v-else class="flex flex-col gap-y-3 pr-12">
                  <!-- Thinking Process (Collapsible) -->
                  <div v-if="msg.thinking" class="flex flex-col">
                    <button 
                      @click="toggleThought(idx)"
                      class="flex items-center gap-x-2 p-2 hover:bg-white/5 rounded-lg transition-colors w-fit group"
                    >
                      <div class="flex items-center gap-x-2">
                        <iconify-icon icon="lucide:brain" class="text-[#A78BFA] text-sm group-hover:scale-110 transition-transform"></iconify-icon>
                        <span style="color: #A78BFA;" class="text-[11px] font-medium uppercase tracking-wider">思考过程</span>
                      </div>
                      <iconify-icon 
                        :icon="expandedThoughts[idx] ? 'lucide:chevron-up' : 'lucide:chevron-down'" 
                        class="text-[#A78BFA] text-xs"
                      ></iconify-icon>
                    </button>
                    
                    <div v-if="expandedThoughts[idx]" 
                      style="background-color: color-mix( in oklab , #A78BFA 5% , transparent ); border-left: 2px solid #A78BFA4D;" 
                      class="mt-1 p-3 rounded-r-lg animate-fade-in"
                    >
                      <p style="color: color-mix( in oklab , #fff 50% , transparent );" class="text-xs leading-relaxed italic whitespace-pre-wrap">{{ msg.thinking }}</p>
                    </div>
                  </div>

                  <!-- Content -->
                  <div v-if="msg.content" style="background-color: color-mix( in oklab , #fff 5% , transparent ); border-color: color-mix( in oklab , #fff 10% , transparent );" class="p-3 border-[1px] border-solid rounded-2xl rounded-tl-sm shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                    <p style="color: color-mix( in oklab , #fff 90% , transparent );" class="text-sm leading-relaxed whitespace-pre-wrap">{{ msg.content }}</p>
                  </div>
                </div>
              </div>

              <!-- Loading Indicator -->
              <div v-if="overallStatus === 'running'" class="flex gap-x-2 items-center">
                <div class="flex gap-x-1">
                  <div class="w-1.5 h-1.5 bg-[#00D9FF] rounded-full animate-bounce" style="animation-delay: 0s"></div>
                  <div class="w-1.5 h-1.5 bg-[#00D9FF] rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                  <div class="w-1.5 h-1.5 bg-[#00D9FF] rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                </div>
              </div>
            </div>

            <!-- Footer Info -->
            <div style="border-top-style: solid; border-color: color-mix( in oklab , #fff 10% , transparent );" class="border-t-[1px] p-3 text-center">
              <span style="color: color-mix( in oklab , #fff 30% , transparent );" class="text-[10px]">Session ID: {{ sessionId }}</span>
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
