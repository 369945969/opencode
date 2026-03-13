<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 基础状态
const sessionId = ref(route.query.sessionId as string || '')
const taskTitle = ref('待执行任务')
const taskDescription = ref('')
const overallStatus = ref('idle') // idle, running, completed
const startTime = ref('')
const isInitialized = ref(false)

// Agent 追踪状态
interface ExecutionNode {
  id: string         // 唯一标识: agentId_nodeId
  agentId: string
  nodeId: number
  name: string
  content?: string   // 节点详细内容
  status: 'running' | 'completed' | 'waiting'
  parentId?: string  // 指向上一个执行节点的唯一标识 (id)
  x?: number
  y?: number
  depth?: number     // 层级
}

const graphNodes = ref<Record<string, ExecutionNode>>({})
const lastNodeIdByAgent = ref<Record<string, string>>({}) 
const pendingClones = ref<Record<string, string>>({}) 
const graphContainer = ref<HTMLElement | null>(null)
const hoveredNodeId = ref<string | null>(null)
const selectedAgentId = ref('')
const chatMessages = ref<any[]>([])
const isAutoScroll = ref(true)
const chatScrollContainer = ref<HTMLElement | null>(null)

// 拖动状态
const draggingNodeId = ref<string | null>(null)
const nodeOffsets = ref<Record<string, { x: number, y: number }>>({})
let dragStartPos = { x: 0, y: 0 }
let initialNodePos = { x: 0, y: 0 }

const handleMouseDown = (e: MouseEvent, nodeId: string) => {
  const node = graphNodes.value[nodeId]
  if (!node) return
  
  draggingNodeId.value = nodeId
  dragStartPos = { x: e.clientX, y: e.clientY }
  initialNodePos = { x: node.x || 0, y: node.y || 0 }
  
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
  e.preventDefault()
}

const handleMouseMove = (e: MouseEvent) => {
  if (!draggingNodeId.value) return
  
  const dx = e.clientX - dragStartPos.x
  const dy = e.clientY - dragStartPos.y
  
  if (!nodeOffsets.value[draggingNodeId.value]) {
    nodeOffsets.value[draggingNodeId.value] = { x: 0, y: 0 }
  }
  
  // 实时更新偏移量
  nodeOffsets.value[draggingNodeId.value] = {
    x: initialNodePos.x + dx,
    y: initialNodePos.y + dy
  }
}

const handleMouseUp = () => {
  draggingNodeId.value = null
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
}

// 动态布局算法
const layerGap = 120
const nodeWidth = 180
const nodeHeight = 60
const containerWidth = ref(1000)

const nodesList = computed(() => {
  const list = Object.values(graphNodes.value)
  const layers: Record<number, string[]> = {}
  
  const calculateDepth = (id: string, depth: number) => {
    const node = graphNodes.value[id]
    if (!node) return
    node.depth = depth
    if (!layers[depth]) layers[depth] = []
    if (!layers[depth].includes(id)) layers[depth].push(id)
    
    list.filter(n => n.parentId === id).forEach(child => {
      calculateDepth(child.id, depth + 1)
    })
  }

  const rootNodes = list.filter(n => !n.parentId)
  rootNodes.forEach(root => calculateDepth(root.id, 0))

  Object.keys(layers).forEach(d => {
    const depth = parseInt(d)
    const nodesInLayer = layers[depth]
    const totalWidth = nodesInLayer.length * nodeWidth + (nodesInLayer.length - 1) * 40
    const startX = (containerWidth.value - totalWidth) / 2

    nodesInLayer.forEach((id, index) => {
      const node = graphNodes.value[id]
      // 只有在没有手动拖动偏移时才自动计算
      if (nodeOffsets.value[id]) {
        node.x = nodeOffsets.value[id].x
        node.y = nodeOffsets.value[id].y
      } else {
        node.x = startX + index * (nodeWidth + 40)
        node.y = 50 + depth * layerGap
      }
    })
  })

  return list
})

const connections = computed(() => {
  const paths: { d: string; status: string }[] = []
  nodesList.value.forEach(node => {
    if (node.parentId && graphNodes.value[node.parentId]) {
      const parent = graphNodes.value[node.parentId]
      const startX = (parent.x || 0) + nodeWidth / 2
      const startY = (parent.y || 0) + nodeHeight
      const endX = (node.x || 0) + nodeWidth / 2
      const endY = node.y || 0

      const cp1y = startY + (endY - startY) / 2
      const cp2y = startY + (endY - startY) / 2
      
      paths.push({
        d: `M ${startX} ${startY} C ${startX} ${cp1y}, ${endX} ${cp2y}, ${endX} ${endY}`,
        status: node.status
      })
    }
  })
  return paths
})

const getIcon = (name: string) => {
  if (name.includes('标题')) return 'lucide:type'
  if (name.includes('根因')) return 'lucide:search'
  if (name.includes('工具推荐')) return 'lucide:wrench'
  if (name.includes('矛盾矩阵')) return 'lucide:cpu'
  if (name.includes('分析汇总')) return 'lucide:check-circle'
  if (name.includes('分析分支')) return 'lucide:git-branch'
  return 'lucide:workflow'
}

const getEmoji = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes('标题')) return '🏷️'
  if (n.includes('根因')) return '🔍'
  if (n.includes('创新方向')) return '🌿'
  if (n.includes('推荐') || n.includes('tool')) return '🛠️'
  if (n.includes('矛盾矩阵') || n.includes('matrix')) return '📊'
  if (n.includes('点子') || n.includes('方案') || n.includes('summary')) return '💡'
  return '🤖'
}

const selectAgent = async (agentId: string) => {
  selectedAgentId.value = agentId
  try {
    const response = await fetch(`http://localhost:4098/agents/${agentId}/history?include_ancestors=true`)
    if (response.ok) {
      const data = await response.json()
      chatMessages.value = data.messages
    }
  } catch (e) {
    console.error('Failed to fetch history:', e)
  }
}

const addExecutionNode = (agentId: string, nodeId: number, name: string, status: 'running' | 'completed' | 'waiting' = 'running', content?: string) => {
  const id = `${agentId}_${nodeId}`
  
  if (graphNodes.value[id]) {
    graphNodes.value[id].status = status
    graphNodes.value[id].name = name
    if (content) graphNodes.value[id].content = content
    return id
  }

  let parentId: string | undefined
  if (pendingClones.value[agentId]) {
    parentId = pendingClones.value[agentId]
    // 只有在真正创建了节点后才删除挂起关系
  } else if (lastNodeIdByAgent.value[agentId]) {
    parentId = lastNodeIdByAgent.value[agentId]
  }

  // 极端情况下的兜底：如果还是没找到父节点，且该 Agent 是裂变出来的，强制关联到主 Agent 的 RCA 节点
  if (!parentId && agentId !== sessionId.value) {
    const parentAgentId = sessionId.value // 假设所有裂变都源自初始 Agent
    // TRIZ 流程中，裂变通常发生在 RCA 之后 (NodeID 2)
    const fallbackParentId = `${parentAgentId}_2`
    if (graphNodes.value[fallbackParentId]) {
      parentId = fallbackParentId
      console.warn(`⚠️ 节点 ${id} 未找到父节点，已自动兜底至 RCA: ${fallbackParentId}`)
    }
  }

  graphNodes.value[id] = {
    id,
    agentId,
    nodeId,
    name,
    status,
    content,
    parentId
  }

  // 成功创建节点后，清除该 Agent 的挂起关联
  if (pendingClones.value[agentId]) {
    delete pendingClones.value[agentId]
  }

  lastNodeIdByAgent.value[agentId] = id
  return id
}

// SSE 全局监听
let globalEs: EventSource | null = null
const startGlobalSse = () => {
  if (globalEs) return
  
  globalEs = new EventSource(`http://localhost:4098/agents/all/events`)
  globalEs.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      // 处理 node_update 和 agent.cloned 等全局同步事件
      if (data.type === 'node_update' || data.type === 'agent.cloned' || data.type === 'title') {
        handleSseEvent(data, data.agentId)
      }
    } catch (e) {
      console.error('Global SSE error:', e)
    }
  }
}

const handleSseEvent = (data: any, agentId: string) => {
  console.log('📥 收到 SSE 事件:', data.type, 'Agent:', agentId?.slice(-6), data)
  
  if (data.type === 'message') {
    if (selectedAgentId.value === agentId) {
      const updatedMsg = data.message
      const existingIdx = chatMessages.value.findIndex(m => m.id === updatedMsg.id)
      if (existingIdx > -1) {
        chatMessages.value[existingIdx] = updatedMsg
      } else if (!updatedMsg.isInternal || updatedMsg.role === 'user' || updatedMsg.role === 'system') {
        chatMessages.value.push(updatedMsg)
      }
    }
  } else if (data.type === 'status') {
    const lastId = lastNodeIdByAgent.value[agentId]
    if (lastId && graphNodes.value[lastId]) {
      graphNodes.value[lastId].status = data.status === 'idle' ? 'completed' : 'running'
    }
  } else if (data.type === 'node_update') {
    addExecutionNode(agentId, data.node_id, data.node_name, data.status === 'completed' ? 'completed' : 'running', data.content)
  } else if (data.type === 'title') {
    taskTitle.value = data.title
    const savedTasks = JSON.parse(localStorage.getItem('symphony_tasks') || '[]')
    const taskIndex = savedTasks.findIndex((t: any) => t.id === sessionId.value)
    if (taskIndex > -1) {
      savedTasks[taskIndex].title = data.title
      localStorage.setItem('symphony_tasks', JSON.stringify(savedTasks))
    }
  } else if (data.type === 'agent.cloned') {
    const newAgentId = data.status
    const parentAgentId = data.agentId
    // 优先使用事件明确指定的父节点 ID，否则回退到父 Agent 的最后一个节点
    const parentNodeId = data.node_id ? `${parentAgentId}_${data.node_id}` : lastNodeIdByAgent.value[parentAgentId]
    
    console.log(`🌿 发现裂变: ${parentAgentId} -> ${newAgentId}, 挂载父节点: ${parentNodeId}`)
    pendingClones.value[newAgentId] = parentNodeId
    // 不再为每个新 Agent 建立独立连接，全局监听器会处理所有消息
  }
}

const addAgentNode = (id: string, name: string, parentId?: string) => {
  // 兼容旧调用，转发到新逻辑
  addExecutionNode(id, 0, name, 'running')
}

// 启动执行
const startExecution = async () => {
  if (!taskDescription.value) return
  
  overallStatus.value = 'running'
  try {
    const response = await fetch('http://localhost:4098/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initial_prompt: taskDescription.value })
    })
    
    if (!response.ok) throw new Error('Failed to start agent')
    const { id } = await response.json()
    
    sessionId.value = id
    selectedAgentId.value = id
    // 不再手动建立 SSE，由全局监听器 handleGlobalSse 处理
    selectAgent(id)
    
    // 更新本地存储
    const savedTasks = JSON.parse(localStorage.getItem('symphony_tasks') || '[]')
    const taskIndex = savedTasks.findIndex((t: any) => t.id === id)
    if (taskIndex === -1) {
      savedTasks.unshift({
        id,
        title: taskTitle.value,
        description: taskDescription.value,
        status: 'running',
        created_at: new Date().toLocaleString()
      })
      localStorage.setItem('symphony_tasks', JSON.stringify(savedTasks))
    }
  } catch (e) {
    console.error('Execution failed:', e)
    overallStatus.value = 'idle'
  }
}

onMounted(() => {
  // 监听容器大小变化以重新计算布局
  const observer = new ResizeObserver(entries => {
    if (entries[0]) {
      containerWidth.value = entries[0].contentRect.width
    }
  })
  if (graphContainer.value) observer.observe(graphContainer.value)

  startGlobalSse()

  const isNew = route.query.isNew === 'true'
  if (isNew) {
    taskDescription.value = sessionStorage.getItem('pending_task_description') || ''
    taskTitle.value = '新任务 (待启动)'
  } else if (sessionId.value) {
    // 加载已有任务逻辑...
    const savedTasks = JSON.parse(localStorage.getItem('symphony_tasks') || '[]')
    const task = savedTasks.find((t: any) => t.id === sessionId.value)
    if (task) {
      taskTitle.value = task.title
      taskDescription.value = task.description
      overallStatus.value = task.status
      // 如果已经在运行，恢复显示
      if (task.status === 'running') {
        selectAgent(task.id)
      }
    }
  }
})

onUnmounted(() => {
  if (globalEs) {
    globalEs.close()
    globalEs = null
  }
})

const navigateToTaskList = () => router.push('/')
</script>

<template>
  <div class="font-[-apple-system,BlinkMacSystemFont,'Segoe UI'] w-full min-h-screen bg-[#0A1929] text-white">
    <header class="h-16 border-b border-white/10 flex items-center justify-between px-6">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 cursor-pointer" @click="navigateToTaskList">
          <div class="w-8 h-8 bg-[#00D9FF26] border border-[#00D9FF4D] rounded-lg flex items-center justify-center">
            <iconify-icon icon="lucide:workflow" class="text-[#00D9FF]"></iconify-icon>
          </div>
          <span class="font-semibold text-lg">WorkflowAI</span>
        </div>
        <div class="h-4 w-px bg-white/20 mx-2"></div>
        <span class="text-white/70 text-sm truncate max-w-[300px]">{{ taskTitle }}</span>
      </div>
      
      <div class="flex items-center gap-3">
        <button v-if="overallStatus === 'idle'" @click="startExecution" class="bg-[#00D9FF] text-[#0A1929] px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#00B8DB] transition-all">
          <iconify-icon icon="lucide:play"></iconify-icon>
          开始执行
        </button>
        <div v-else class="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
          <div class="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div>
          <span class="text-xs text-[#10B981] font-medium">执行中</span>
        </div>
      </div>
    </header>

    <div class="flex h-[calc(100vh-64px)] p-6 gap-6">
      <!-- 左侧：执行图谱 -->
      <div class="flex-1 bg-white/5 border border-white/10 rounded-2xl flex flex-col overflow-hidden relative">
        <div class="p-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
          <h3 class="font-semibold flex items-center gap-2">
            <iconify-icon icon="lucide:git-graph" class="text-[#00D9FF]"></iconify-icon>
            执行图谱
          </h3>
          <div class="text-[10px] text-white/40 italic">点击节点切换右侧历史</div>
        </div>
        
        <div ref="graphContainer" class="flex-1 overflow-auto relative p-8">
          <!-- 连线层 -->
          <svg class="absolute inset-0 pointer-events-none w-full h-full min-h-[1000px]">
            <path 
              v-for="(conn, idx) in connections" 
              :key="idx" 
              :d="conn.d" 
              fill="none" 
              :stroke="conn.status === 'completed' ? '#10B981' : '#00D9FF'" 
              stroke-width="2" 
              opacity="0.4"
              class="transition-all duration-500"
            />
          </svg>

          <!-- 节点层 -->
          <div 
            v-for="node in nodesList" 
            :key="node.id"
            @click="selectAgent(node.agentId)"
            @mousedown="handleMouseDown($event, node.id)"
            @mouseenter="hoveredNodeId = node.id"
            @mouseleave="hoveredNodeId = null"
            class="absolute transition-all duration-500 cursor-pointer group"
            :class="{ 'z-50': draggingNodeId === node.id, 'transition-none': draggingNodeId === node.id }"
            :style="{ 
              left: (node.x || 0) + 'px', 
              top: (node.y || 0) + 'px',
              width: nodeWidth + 'px'
            }"
          >
            <div :class="['node-container p-3 rounded-xl border transition-all relative', 
              node.status === 'running' ? 'bg-[#00D9FF1A] border-[#00D9FF4D] shadow-[0_0_15px_rgba(0,217,255,0.2)]' : 
              node.status === 'completed' ? 'bg-[#10B9811A] border-[#10B9814D]' : 'bg-white/5 border-white/10']">
              
              <!-- Tooltip: 始终显示，如果没有内容则显示状态占位 -->
              <div v-if="hoveredNodeId === node.id" 
                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-[#1A2634] border border-white/10 rounded-lg shadow-2xl z-[100] animate-fade-in pointer-events-none">
                <div class="flex items-center justify-between mb-1.5">
                  <div class="text-[10px] text-[#00D9FF] font-bold uppercase tracking-wider">{{ node.name }}</div>
                  <div :class="['text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase', 
                    node.status === 'running' ? 'bg-[#00D9FF26] text-[#00D9FF]' : 
                    node.status === 'completed' ? 'bg-[#10B98126] text-[#10B981]' : 'bg-white/10 text-white/40']">
                    {{ node.status === 'running' ? '进行中' : node.status === 'completed' ? '已完成' : '等待中' }}
                  </div>
                </div>
                <div class="text-[11px] text-white/70 leading-relaxed whitespace-pre-wrap line-clamp-6">
                  {{ node.content || (node.status === 'running' ? '正在执行分析流程，请稍候...' : '分析已完成，点击节点查看详细对话。') }}
                </div>
                <div class="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#1A2634]"></div>
              </div>

              <div :class="['node-icon-box w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0',
                node.status === 'running' ? 'bg-[#00D9FF26] text-[#00D9FF]' : 
                node.status === 'completed' ? 'bg-[#10B98126] text-[#10B981]' : 'bg-white/5 text-white/40']">
                {{ getEmoji(node.name) }}
              </div>
              <div class="flex flex-col gap-0.5 overflow-hidden">
                <div class="text-xs font-bold text-white line-clamp-2 leading-snug">{{ node.name }}</div>
                <div class="text-[9px] text-white/40 font-mono">Agent: {{ node.agentId.slice(-4) }}</div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="nodesList.length === 0" class="h-full flex flex-col items-center justify-center text-white/20 gap-3">
            <iconify-icon icon="lucide:play-circle" class="text-5xl"></iconify-icon>
            <p class="text-sm italic">点击“开始执行”开启创新旅程</p>
          </div>
        </div>
      </div>

      <!-- 右侧：消息历史 -->
      <div class="w-[500px] bg-white/5 border border-white/10 rounded-2xl flex flex-col overflow-hidden">
        <div class="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-[#A78BFA26] border border-[#A78BFA4D] flex items-center justify-center">
              <iconify-icon icon="lucide:message-square" class="text-[#A78BFA]"></iconify-icon>
            </div>
            <div>
              <div class="text-sm font-semibold">执行详情</div>
              <div class="text-[10px] text-white/50 truncate w-40">Agent: {{ selectedAgentId || '未选择' }}</div>
            </div>
          </div>
        </div>

        <div ref="chatScrollContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
          <div v-if="chatMessages.length === 0" class="h-full flex flex-col items-center justify-center text-white/20 gap-3">
            <iconify-icon icon="lucide:message-circle-off" class="text-4xl"></iconify-icon>
            <p class="text-sm">暂无执行记录</p>
          </div>
          
          <div v-for="(msg, idx) in chatMessages" :key="idx" class="flex flex-col gap-2">
            <!-- 用户输入消息 -->
            <div v-if="msg.role === 'user'" class="self-end max-w-[90%] bg-[#00D9FF1A] border border-[#00D9FF33] p-3 rounded-2xl rounded-tr-sm shadow-sm">
              <div class="flex items-center gap-1.5 text-[10px] text-[#00D9FF] mb-1 uppercase font-bold justify-end">
                <iconify-icon icon="lucide:user"></iconify-icon>输入
              </div>
              <p class="text-sm text-white/90 leading-relaxed">{{ msg.content }}</p>
            </div>

            <!-- 系统/策略消息 -->
            <div v-else-if="msg.role === 'system'" class="self-start max-w-[90%] bg-white/[0.03] border border-dashed border-white/20 p-3 rounded-2xl rounded-tl-sm opacity-80">
              <div class="flex items-center gap-1.5 text-[10px] text-white/40 mb-1 uppercase font-bold">
                <iconify-icon icon="lucide:settings-2"></iconify-icon>策略引导
              </div>
              <p class="text-[11px] text-white/60 leading-relaxed font-mono whitespace-pre-wrap">{{ msg.content }}</p>
            </div>

            <!-- 助手回复消息 -->
            <div v-else class="self-start max-w-[90%] flex flex-col gap-2">
              <div v-if="msg.thinking" class="bg-white/[0.03] border-l-2 border-[#A78BFA4D] p-2 rounded-r-lg">
                <div class="flex items-center gap-1.5 text-[10px] text-[#A78BFA] mb-1 uppercase font-bold">
                  <iconify-icon icon="lucide:brain"></iconify-icon>思考中
                </div>
                <p class="text-[11px] text-white/40 italic whitespace-pre-wrap">{{ msg.thinking }}</p>
              </div>
              <div class="bg-white/[0.05] border border-white/10 p-3 rounded-2xl rounded-tl-sm shadow-xl">
                <p class="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">{{ msg.content }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="p-3 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="isAutoScroll" type="checkbox" class="hidden">
            <div :class="['w-4 h-4 border rounded transition-all flex items-center justify-center', isAutoScroll ? 'bg-[#00D9FF] border-[#00D9FF]' : 'border-white/20']">
              <iconify-icon v-if="isAutoScroll" icon="lucide:check" class="text-[10px] text-[#0A1929]"></iconify-icon>
            </div>
            <span class="text-[10px] text-white/40">自动滚动</span>
          </label>
          <div class="text-[10px] text-white/20">Symphony Engine v1.0</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Mermaid 样式覆盖 */
#mermaid-svg {
  max-width: none !important;
  height: auto !important;
  font-family: inherit !important;
}

/* 节点容器样式，模拟 CreateTask.vue */
.node-container {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 140px;
  padding: 8px;
  text-align: left;
}

.node-icon-box {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
  font-size: 18px;
}

.node-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.node-name {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
}

.node-id {
  font-size: 10px;
  opacity: 0.5;
  font-family: monospace;
}

/* Mermaid 节点样式重置 */
.node rect {
  stroke-width: 1.5px !important;
  rx: 12px !important;
  ry: 12px !important;
  transition: all 0.3s ease;
}

/* 状态样式 */
.running rect {
  fill: rgba(0, 217, 255, 0.15) !important;
  stroke: #00D9FF !important;
}
.running .node-icon-box {
  background: rgba(0, 217, 255, 0.1) !important;
  border-color: rgba(0, 217, 255, 0.3) !important;
  color: #00D9FF;
}

.completed rect {
  fill: rgba(16, 185, 129, 0.1) !important;
  stroke: #10B981 !important;
}
.completed .node-icon-box {
  background: rgba(16, 185, 129, 0.1) !important;
  border-color: rgba(16, 185, 129, 0.3) !important;
  color: #10B981;
}

.waiting rect {
  fill: rgba(255, 255, 255, 0.05) !important;
  stroke: rgba(255, 255, 255, 0.2) !important;
  stroke-dasharray: 5, 5;
}

.node:hover rect {
  filter: brightness(1.3);
  cursor: pointer;
}

/* 连接线 */
.mermaid .edgePath path {
  stroke: rgba(255, 255, 255, 0.2) !important;
  stroke-width: 1.5px !important;
}

.node foreignObject {
  overflow: visible;
}
</style>
