<template>
  <div class="font-[-apple-system,BlinkMacSystemFont,'Segoe UI'] w-full min-h-screen" style="line-height: 1.5; background: rgba(10, 25, 41, 1);">
    <header style="background: rgba(10, 25, 41, 1);" class="w-full">
      <nav style="padding: 1rem 1.5rem;" class="flex justify-between items-center w-full">
        <div class="flex items-center gap-y-8 gap-x-8">
          <div class="flex items-center gap-y-3 gap-x-3">
            <div style="background-color: color-mix( in oklab , #00D9FF 15% , transparent ); border-color: color-mix( in oklab , #00D9FF 30% , transparent );" class="flex justify-center items-center w-8 h-8 border-[1px] border-solid rounded-lg">
              <iconify-icon style="color: rgba(0, 217, 255, 1);" icon="lucide:workflow" class="text-lg"></iconify-icon>
            </div>
            <span style="color: color-mix( in oklab , #fff 95% , transparent );" class="text-lg font-semibold">WorkflowAI</span>
          </div>
          <div style="background-color: color-mix( in oklab , #fff 8% , transparent ); backdrop-filter: blur(24px); box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25); padding: 0.5rem 1rem; border-color: color-mix( in oklab , #fff 10% , transparent );" class="flex items-center min-w-[320px] border-[1px] border-solid rounded-full">
            <div class="bg-transparent flex justify-center items-center w-5 h-5 mr-3">
              <iconify-icon style="color: color-mix( in oklab , #fff 50% , transparent );" icon="lucide:search" class="text-base"></iconify-icon>
            </div>
            <input style="flex-basis: 0%; color: color-mix( in oklab , #fff 95% , transparent );" type="text" placeholder="搜索任务..." class="text-sm bg-transparent grow shrink outline-none border-none">
          </div>
        </div>
        <div class="flex items-center gap-y-4 gap-x-4">
          <button @click="backToList" class="hover:bg-white/10 hover:border-[#00D9FF]/30 flex items-center border-[1px] border-solid border-white/10 rounded-lg bg-white/5 px-4 py-2 cursor-pointer transition-all">
            <div class="bg-transparent flex justify-center items-center w-5 h-5 mr-2">
              <iconify-icon style="color: color-mix( in oklab , #fff 70% , transparent );" icon="lucide:arrow-left" class="text-base"></iconify-icon>
            </div>
            <span style="color: color-mix( in oklab , #fff 70% , transparent );" class="whitespace-nowrap font-medium">返回任务列表</span>
          </button>
          <div class="hover:bg-white/[0.08] hover:border-[#00D9FF]/30 flex relative justify-center items-center w-10 h-10 border-[1px] border-solid rounded-full" style="background-color: color-mix( in oklab , #fff 5% , transparent ); backdrop-filter: blur(24px); border-color: color-mix( in oklab , #fff 10% , transparent );">
            <iconify-icon style="color: color-mix( in oklab , #fff 70% , transparent );" icon="lucide:bell" class="text-base"></iconify-icon>
            <div style="background-color: rgba(255, 107, 107, 1); box-shadow: 0 2px 8px rgba(255, 107, 107, 0.4); border-color: rgba(10, 25, 41, 1);" class="flex absolute -top-1 -right-1 justify-center items-center w-5 h-5 border-[2px] border-solid rounded-full">
              <span style="color: rgba(255, 255, 255, 1);" class="text-[10px] font-semibold">3</span>
            </div>
          </div>
          <div class="flex items-center gap-y-2 gap-x-2">
            <img style="border-color: color-mix( in oklab , #fff 10% , transparent );" alt="Avatar" src="https://static.paraflowcontent.com/public/resource/image/654bc3a7-6d46-4317-a6be-80ceeac2474f.jpeg" class="w-9 h-9 object-cover border-[2px] border-solid rounded-full">
            <iconify-icon style="color: color-mix( in oklab , #fff 70% , transparent );" icon="lucide:chevron-down" class="text-sm"></iconify-icon>
          </div>
        </div>
      </nav>
    </header>

    <main class="flex flex-col pr-8 pl-8 overflow-x-hidden">
      <div class="pt-8 pb-6">
        <h1 style="color: color-mix( in oklab , #fff 95% , transparent );" class="text-3xl mb-6 font-semibold">创建新任务</h1>
        <div class="flex items-center gap-x-4 mb-8">
          <div v-for="(step, index) in steps" :key="index" class="flex items-center" :class="{ 'grow': index < steps.length - 1 }">
            <div class="flex items-center">
              <div :style="currentStep >= index + 1 ? activeStepStyle : inactiveStepStyle" class="flex justify-center items-center w-8 h-8 border-[2px] border-solid rounded-full transition-all">
                <span class="text-sm font-semibold">{{ index + 1 }}</span>
              </div>
              <span :style="currentStep >= index + 1 ? activeTextStyle : inactiveTextStyle" class="text-sm ml-3 font-medium">{{ step }}</span>
            </div>
            <div v-if="index < steps.length - 1" class="grow h-px mx-4" :style="currentStep > index + 1 ? activeStepStyle : inactiveLineStyle"></div>
          </div>
        </div>
      </div>

      <!-- Step 1: Input Description -->
      <div v-if="currentStep === 1" class="mb-8 animate-fade-in">
        <div style="background-color: color-mix( in oklab , #fff 8% , transparent ); backdrop-filter: blur(24px); box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25); border-color: color-mix( in oklab , #fff 10% , transparent );" class="p-8 border-[1px] border-solid rounded-2xl">
          <div class="mb-8">
            <label style="color: color-mix( in oklab , #fff 95% , transparent );" class="text-sm block mb-3 font-medium">任务描述</label>
            <textarea v-model="taskDescription" class="focus:border-[#00D9FF]/50 focus:shadow-[0_0_12px_rgba(0,217,255,0.3)] text-base bg-transparent w-full outline-none p-4 border-[1px] border-solid border-white/20 rounded-xl text-white transition-all" placeholder="请用自然语言详细描述您要执行的任务，例如：分析这个代码仓库的架构，生成文档，然后基于文档回答 5 个技术问题" rows="6"></textarea>
            <p style="color: color-mix( in oklab , #fff 50% , transparent );" class="text-sm mt-2">系统将根据您的描述自动分析并生成执行计划</p>
          </div>
          <div class="flex justify-end">
            <button @click="generatePlan" :disabled="!taskDescription" class="hover:bg-[#00B8DB] flex items-center rounded-xl px-8 py-3 bg-[#00D9FF] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all">
              <div class="bg-transparent flex justify-center items-center w-5 h-5 mr-2">
                <iconify-icon style="color: #0A1929;" icon="lucide:zap" class="text-base"></iconify-icon>
              </div>
              <span style="color: #0A1929;" class="whitespace-nowrap font-semibold">生成计划</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Step 2: Preview Plan -->
      <div v-if="currentStep === 2" class="mb-8 animate-fade-in">
        <div class="grid grid-cols-3 gap-6">
          <div class="col-span-2">
            <div style="background-color: color-mix( in oklab , #fff 8% , transparent ); backdrop-filter: blur(24px); box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25); border-color: color-mix( in oklab , #fff 10% , transparent );" class="min-h-[1000px] p-6 border-[1px] border-solid rounded-2xl relative overflow-hidden">
              <h3 style="color: color-mix( in oklab , #fff 95% , transparent );" class="text-lg mb-4 font-semibold">计划图谱</h3>
              
              <!-- Stage Sidebar -->
              <div class="absolute left-16 top-0 bottom-0 w-32 pointer-events-none z-10 pt-4">
                <div v-for="stage in graphStages" :key="stage.name" 
                  class="absolute left-0 w-full flex flex-col items-center"
                  :style="{ top: stage.startY + 'px', height: (stage.endY - stage.startY) + 'px' }">
                  <div class="w-1 h-full rounded-full opacity-20" :style="{ backgroundColor: stage.color }"></div>
                  <div class="absolute top-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-[13px] font-bold tracking-widest uppercase opacity-60"
                    :style="{ color: stage.color }">
                    {{ stage.name }}
                  </div>
                </div>
              </div>

              <!-- SVG Overlay for Connections -->
              <svg width="100%" height="100%" class="absolute top-0 left-0 pointer-events-none z-0 overflow-visible">
                <template v-for="node in planNodes" :key="'lines-' + node.id">
                  <path v-for="parentId in node.parents" :key="parentId"
                    :d="getBezierPath(parentId, node.id)"
                    stroke="rgba(255,255,255,0.3)" stroke-width="2" fill="none" />
                </template>
              </svg>

              <!-- Draggable Preview Nodes -->
              <div v-for="node in planNodes" :key="node.id" 
                @mousedown="onMouseDown($event, node.id)"
                class="flex items-center gap-x-4 p-2 bg-white/5 border border-white/10 rounded-xl min-w-[160px] absolute z-10 cursor-move select-none transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(255,255,255,0.1)]"
                :style="{
                  left: node.x + 'px',
                  top: node.y + 'px',
                  borderColor: node.color + '4D'
                }"
              >
                <div :style="{ backgroundColor: node.color + '26', borderColor: node.color + '4D' }" class="flex justify-center items-center w-8 h-8 border-[1px] border-solid rounded-lg shrink-0">
                  <iconify-icon :style="{ color: node.color }" :icon="node.icon" class="text-base"></iconify-icon>
                </div>
                <div class="grow">
                  <div style="color: color-mix( in oklab , #fff 95% , transparent );" class="text-xs font-medium">{{ node.title }}</div>
                  <div v-if="node.time" style="color: color-mix( in oklab , #fff 50% , transparent );" class="text-[10px]">预估: {{ node.time }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-span-1">
            <div style="background-color: color-mix( in oklab , #fff 8% , transparent ); backdrop-filter: blur(24px); box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25); border-color: color-mix( in oklab , #fff 10% , transparent );" class="p-6 border-[1px] border-solid rounded-2xl">
              <h3 style="color: color-mix( in oklab , #fff 95% , transparent );" class="text-lg mb-4 font-semibold">计划详情</h3>
              <div class="flex flex-col gap-y-4 mb-6">
                <div v-for="detail in planDetails" :key="detail.label" class="flex justify-between items-center">
                  <span style="color: color-mix( in oklab , #fff 70% , transparent );" class="text-sm">{{ detail.label }}</span>
                  <span style="color: color-mix( in oklab , #fff 95% , transparent );" class="text-lg font-semibold">{{ detail.value }}</span>
                </div>
              </div>
              <div class="mb-6">
                <h4 style="color: color-mix( in oklab , #fff 95% , transparent );" class="text-sm mb-3 font-medium">关联技能与工具</h4>
                <div class="flex flex-col gap-y-2">
                  <div v-for="tool in relatedTools" :key="tool.name" style="background-color: color-mix( in oklab , #fff 5% , transparent );" class="flex items-center gap-x-2 p-2 rounded-lg">
                    <iconify-icon :style="{ color: tool.color }" :icon="tool.icon" class="text-sm"></iconify-icon>
                    <span style="color: color-mix( in oklab , #fff 70% , transparent );" class="text-sm">{{ tool.name }}</span>
                  </div>
                </div>
              </div>
              <div class="flex flex-col gap-y-3">
                <button @click="confirmAndGo" class="hover:bg-[#00B8DB] flex justify-center items-center rounded-xl bg-[#00D9FF] px-6 py-3 cursor-pointer transition-all">
                  <div class="bg-transparent flex justify-center items-center w-5 h-5 mr-2">
                    <iconify-icon style="color: #0A1929;" icon="lucide:check-circle" class="text-base"></iconify-icon>
                  </div>
                  <span style="color: #0A1929;" class="whitespace-nowrap font-semibold">确认并创建</span>
                </button>
                <button @click="currentStep = 1" class="hover:bg-white/10 hover:border-[#00D9FF]/30 flex justify-center items-center border-[1px] border-solid border-white/10 rounded-xl bg-white/8 px-6 py-3 cursor-pointer transition-all">
                  <iconify-icon style="color: rgba(255, 255, 255, 0.7);" icon="lucide:edit" class="text-base mr-2"></iconify-icon>
                  <span style="color: rgba(255, 255, 255, 0.7);" class="whitespace-nowrap font-medium">调整计划</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentStep = ref(1)
const taskDescription = ref('穿戴运动手表采用LED光传感器发射到皮肤和血管，反射后再通过PD接收光信号来测量心率（PPG技术），当前心率测试准确性差，希望手表测试准确性提高至100%，即无论如何佩戴都测试准确。')

const steps = ['输入描述', '预览计划', '启动执行']

const activeStepStyle = {
  backgroundColor: '#00D9FF',
  borderColor: '#00D9FF',
  color: '#0A1929'
}

const inactiveStepStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  borderColor: 'rgba(255, 255, 255, 0.2)',
  color: 'rgba(255, 255, 255, 0.5)'
}

const inactiveLineStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.2)'
}

const activeTextStyle = { color: '#00D9FF' }
const inactiveTextStyle = { color: 'rgba(255, 255, 255, 0.5)' }

// Initial coordinates for a tree layout
const initialX = 650 // Center X in the col-span-2 container
const layerGap = 140
const initialY = 120

const planNodes = ref([
  { id: 'step_001', title: 'TRIZ难题定义', time: '1-2分钟', icon: 'lucide:target', color: '#00D9FF', x: initialX, y: initialY, parents: [] },
  { id: 'step_002', title: '根因分析 (RCA)', time: '4-6分钟', icon: 'lucide:search', color: '#A78BFA', x: initialX, y: initialY + layerGap, parents: ['step_001'] },
  
  { id: 'step_003_1', title: '创新方向1', time: '3-5分钟', icon: 'lucide:compass', color: '#F59E0B', x: initialX - 250, y: initialY + layerGap * 2, parents: ['step_002'] },
  { id: 'step_003_2', title: '创新方向2', time: '3-5分钟', icon: 'lucide:compass', color: '#F59E0B', x: initialX + 250, y: initialY + layerGap * 2, parents: ['step_002'] },
  
  { id: 'step_004_1', title: '工具推荐1', time: '1-2分钟', icon: 'lucide:wrench', color: '#EC4899', x: initialX - 250, y: initialY + layerGap * 3, parents: ['step_003_1'] },
  { id: 'step_004_2', title: '工具推荐2', time: '1-2分钟', icon: 'lucide:wrench', color: '#EC4899', x: initialX + 250, y: initialY + layerGap * 3, parents: ['step_003_2'] },
  
  { id: 'step_005_1', title: '39×39硬件矩阵', time: '1-2分钟', icon: 'lucide:cpu', color: '#EC4899', x: initialX - 375, y: initialY + layerGap * 4, parents: ['step_004_1'] },
  { id: 'step_005_2', title: '24×24软件矩阵', time: '1-2分钟', icon: 'lucide:code', color: '#EC4899', x: initialX - 125, y: initialY + layerGap * 4, parents: ['step_004_1'] },
  { id: 'step_005_3', title: '39×39硬件矩阵', time: '1-2分钟', icon: 'lucide:cpu', color: '#EC4899', x: initialX + 125, y: initialY + layerGap * 4, parents: ['step_004_2'] },
  { id: 'step_005_4', title: '24×24软件矩阵', time: '1-2分钟', icon: 'lucide:code', color: '#EC4899', x: initialX + 375, y: initialY + layerGap * 4, parents: ['step_004_2'] },
  
  { id: 'step_006_1', title: '点子1', time: '2-3分钟', icon: 'lucide:lightbulb', color: '#00D9FF', x: initialX - 375, y: initialY + layerGap * 5, parents: ['step_005_1'] },
  { id: 'step_006_2', title: '点子2', time: '2-3分钟', icon: 'lucide:lightbulb', color: '#00D9FF', x: initialX - 125, y: initialY + layerGap * 5, parents: ['step_005_2'] },
  { id: 'step_006_3', title: '点子3', time: '2-3分钟', icon: 'lucide:lightbulb', color: '#00D9FF', x: initialX + 125, y: initialY + layerGap * 5, parents: ['step_005_3'] },
  { id: 'step_006_4', title: '点子4', time: '2-3分钟', icon: 'lucide:lightbulb', color: '#00D9FF', x: initialX + 375, y: initialY + layerGap * 5, parents: ['step_005_4'] },
])

const graphStages = [
  { name: 'TRIZ难题定义', startY: 90, endY: 190, color: '#00D9FF' },
  { name: '根因分析 (RCA)', startY: 240, endY: 470, color: '#A78BFA' },
  { name: '工具推荐', startY: 520, endY: 750, color: '#EC4899' },
  { name: '生成点子', startY: 800, endY: 890, color: '#00D9FF' },
]

// Dragging Logic
const draggingNodeId = ref<string | null>(null)
const dragOffset = { x: 0, y: 0 }

const onMouseDown = (e: MouseEvent, id: string) => {
  const node = planNodes.value.find(n => n.id === id)
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
    const node = planNodes.value.find(n => n.id === draggingNodeId.value)
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
  const parent = planNodes.value.find(n => n.id === parentId)
  const child = planNodes.value.find(n => n.id === childId)
  if (!parent || !child) return ''

  const startX = parent.x + 80 // Half of min-w-[160px]
  const startY = parent.y + 48 // Node height roughly
  const endX = child.x + 80
  const endY = child.y

  const cp1y = startY + (endY - startY) / 2
  const cp2y = startY + (endY - startY) / 2

  return `M ${startX} ${startY} C ${startX} ${cp1y}, ${endX} ${cp2y}, ${endX} ${endY}`
}

const planDetails = [
  { label: '核心步骤', value: '6' },
  { label: '创新分支', value: '2' },
  { label: '预估时长', value: '15-20分钟' }
]

const relatedTools = [
  { name: '39×39 硬件矩阵', icon: 'lucide:cpu', color: '#00D9FF' },
  { name: '24×24 软件矩阵', icon: 'lucide:code', color: '#10B981' },
  { name: '物理效应库', icon: 'lucide:database', color: '#A78BFA' },
  { name: '76标准解系统', icon: 'lucide:layers', color: '#EC4899' }
]

const backToList = () => {
  router.push('/')
}

const generatePlan = () => {
  currentStep.value = 2
}

const confirmAndGo = async () => {
  if (!taskDescription.value) return

  // 使用 sessionStorage 存储描述，模拟 POST 行为，避免 URL 编码和长度限制问题
  sessionStorage.setItem('pending_task_description', taskDescription.value)

  // 立即跳转到 monitor 页面，仅通过 query 传递标识
  router.push({
    path: '/monitor',
    query: { 
      isNew: 'true' 
    }
  })
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
