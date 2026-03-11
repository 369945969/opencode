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
          <button @click="navigateToCreate" class="hover:bg-[#00B8DB] flex items-center rounded-xl cursor-pointer" style="background-color: rgba(0, 217, 255, 1); padding: 0.75rem 1.5rem;">
            <div class="bg-transparent flex justify-center items-center w-5 h-5 mr-2">
              <iconify-icon style="color: color-mix( in oklab , #0A1929 90% , transparent );" icon="lucide:plus" class="text-base"></iconify-icon>
            </div>
            <span style="color: color-mix( in oklab , #0A1929 90% , transparent );" class="whitespace-nowrap font-semibold">创建任务</span>
          </button>
          <div class="hover:bg-white/[0.08] hover:border-[#00D9FF]/30 flex relative justify-center items-center w-10 h-10 border-[1px] border-solid rounded-full" style="background-color: color-mix( in oklab , #fff 5% , transparent ); backdrop-filter: blur(24px); border-color: color-mix( in oklab , #fff 10% , transparent );">
            <iconify-icon style="color: color-mix( in oklab , #fff 70% , transparent );" icon="lucide:bell" class="text-base"></iconify-icon>
            <div style="background-color: rgba(255, 107, 107, 1); box-shadow: 0 2px 8px rgba(255, 107, 107, 0.4); border-color: rgba(10, 25, 41, 1);" class="flex absolute -top-1 -right-1 justify-center items-center w-5 h-5 border-[2px] border-solid rounded-full">
              <span style="color: rgba(255, 255, 255, 1);" class="text-[10px] font-semibold">3</span>
            </div>
          </div>
          <div class="flex items-center gap-y-2 gap-x-2">
            <img style="border-color: color-mix( in oklab , #fff 10% , transparent );" alt="Avatar" src="https://static.paraflowcontent.com/public/resource/image/12918bc4-4c44-4f60-84ce-0ba1828fed70.jpeg" class="w-9 h-9 object-cover border-[2px] border-solid rounded-full">
            <iconify-icon style="color: color-mix( in oklab , #fff 70% , transparent );" icon="lucide:chevron-down" class="text-sm"></iconify-icon>
          </div>
        </div>
      </nav>
    </header>

    <main class="flex flex-col pr-8 pl-8">
      <div class="pt-8 pb-8">
        <h1 style="color: color-mix( in oklab , #fff 95% , transparent );" class="text-3xl mb-6 font-semibold">我的任务</h1>
        <div class="grid grid-cols-4 gap-y-6 gap-x-6 mb-8">
          <div v-for="stat in stats" :key="stat.label" style="background-color: color-mix( in oklab , #fff 5% , transparent ); backdrop-filter: blur(24px); box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25); border-color: color-mix( in oklab , #fff 10% , transparent );" class="flex flex-col gap-y-3 gap-x-3 p-5 border-[1px] border-solid rounded-xl">
            <div :style="{ backgroundColor: stat.bgColor, borderColor: stat.borderColor }" class="flex justify-center items-center w-10 h-10 border-[1px] border-solid rounded-lg">
              <iconify-icon :style="{ color: stat.iconColor }" :icon="stat.icon" class="text-base"></iconify-icon>
            </div>
            <div style="color: rgba(255, 255, 255, 1);" class="text-2xl font-semibold">{{ stat.value }}</div>
            <div style="color: color-mix( in oklab , #fff 70% , transparent );" class="text-sm">{{ stat.label }}</div>
          </div>
        </div>

        <div style="background-color: color-mix( in oklab , #fff 8% , transparent ); backdrop-filter: blur(24px); border-color: color-mix( in oklab , #fff 10% , transparent );" class="mb-6 p-4 border-[1px] border-solid rounded-xl">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-y-4 gap-x-4">
              <div class="flex gap-x-2">
                <button v-for="filter in filters" :key="filter" :class="['text-sm px-3 py-2 rounded-lg border-[1px] border-solid transition-colors cursor-pointer', activeFilter === filter ? 'bg-[#00D9FF]/20 border-[#00D9FF]/50 text-white' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10']" @click="activeFilter = filter">
                  {{ filter }}
                </button>
              </div>
            </div>
            <div class="flex items-center gap-x-2">
              <button style="background-color: color-mix( in oklab , #00D9FF 15% , transparent ); border-color: color-mix( in oklab , #00D9FF 50% , transparent );" class="flex justify-center items-center w-9 h-9 border-[1px] border-solid rounded-lg">
                <iconify-icon style="color: rgba(0, 217, 255, 1);" icon="lucide:grid-3x3" class="text-base"></iconify-icon>
              </button>
              <button class="hover:bg-white/10 flex justify-center items-center w-9 h-9 border-[1px] border-solid border-white/10 rounded-lg bg-white/5">
                <iconify-icon style="color: color-mix( in oklab , #fff 50% , transparent );" icon="lucide:list" class="text-base"></iconify-icon>
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-y-6 gap-x-6">
          <div v-for="task in filteredTasks" :key="task.id" class="hover:bg-white/[0.12] hover:border-white/20 p-5 border-[1px] border-solid rounded-2xl transition-all flex flex-col justify-between" style="background-color: color-mix( in oklab , #fff 8% , transparent ); backdrop-filter: blur(24px); box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25); border-color: color-mix( in oklab , #fff 10% , transparent );">
            <div class="mb-4">
              <div class="flex items-center justify-between mb-3">
                <div :style="{ backgroundColor: task.statusColor + '26', borderColor: task.statusColor + '4D' }" class="flex items-center gap-x-1 px-2 py-0.5 border-[1px] border-solid rounded-full shrink-0">
                  <div :style="{ backgroundColor: task.statusColor }" class="w-1.5 h-1.5 rounded-full" :class="{ 'animate-pulse': task.status === 'running' }"></div>
                  <span :style="{ color: task.statusColor }" class="text-[10px] font-medium whitespace-nowrap">{{ task.statusText }}</span>
                </div>
                <div style="color: color-mix( in oklab , #fff 40% , transparent );" class="text-[10px]">{{ task.createdAt.split(' ')[0] }}</div>
              </div>
              <h3 style="color: color-mix( in oklab , #fff 95% , transparent );" class="text-base mb-2 font-semibold truncate w-full">{{ task.title }}</h3>
              <p style="color: color-mix( in oklab , #fff 60% , transparent );" class="text-xs line-clamp-2 mb-3 h-8 leading-relaxed">{{ task.description }}</p>
            </div>
            
            <div class="flex items-center justify-between gap-x-2 mt-auto">
              <button @click="navigateToMonitor(task)" class="hover:bg-white/10 hover:border-[#00D9FF]/30 grow flex justify-center items-center border-[1px] border-solid border-white/10 rounded-lg bg-white/8 py-1.5 cursor-pointer transition-all">
                <span style="color: color-mix( in oklab , #fff 70% , transparent );" class="text-xs whitespace-nowrap">查看</span>
              </button>
              <button @click="deleteTask(task.id)" class="hover:bg-red-500/20 hover:border-red-500/30 flex justify-center items-center w-8 h-8 border-[1px] border-solid border-white/10 rounded-lg bg-white/5 cursor-pointer transition-all">
                <iconify-icon class="hover:text-red-500 text-sm text-white/50" icon="lucide:trash-2"></iconify-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const tasks = ref<any[]>([])

const loadTasks = () => {
  const savedTasks = JSON.parse(localStorage.getItem('symphony_tasks') || '[]')
  tasks.value = savedTasks.map((t: any) => ({
    ...t,
    statusText: t.status === 'running' ? '运行中' : t.status === 'completed' ? '已完成' : '失败',
    statusColor: t.status === 'running' ? '#10B981' : t.status === 'completed' ? '#10B981' : '#FF6B6B',
    progress: t.status === 'completed' ? 100 : t.status === 'running' ? 10 : 0,
    steps: t.status === 'completed' ? '12/12' : '1/12',
    duration: t.duration || '未知',
    createdAt: t.created_at || t.createdAt
  }))
}

onMounted(() => {
  loadTasks()
})

const stats = computed(() => [
  { label: '总任务数', value: tasks.value.length, icon: 'lucide:layers', iconColor: '#00D9FF', bgColor: 'rgba(0, 217, 255, 0.15)', borderColor: 'rgba(0, 217, 255, 0.3)' },
  { label: '运行中', value: tasks.value.filter(t => t.status === 'running').length, icon: 'lucide:play-circle', iconColor: '#10B981', bgColor: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)' },
  { label: '已完成', value: tasks.value.filter(t => t.status === 'completed').length, icon: 'lucide:check-circle', iconColor: '#10B981', bgColor: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)' },
  { label: '失败', value: tasks.value.filter(t => t.status === 'failed').length, icon: 'lucide:x-circle', iconColor: '#FF6B6B', bgColor: 'rgba(255, 107, 107, 0.15)', borderColor: 'rgba(255, 107, 107, 0.3)' }
])

const filters = ['全部', '运行中', '已完成', '失败']
const activeFilter = ref('全部')

const filteredTasks = computed(() => {
  if (activeFilter.value === '全部') return tasks.value
  return tasks.value.filter(task => task.statusText === activeFilter.value)
})

const deleteTask = (id: string) => {
  const savedTasks = JSON.parse(localStorage.getItem('symphony_tasks') || '[]')
  const filtered = savedTasks.filter((t: any) => t.id !== id)
  localStorage.setItem('symphony_tasks', JSON.stringify(filtered))
  loadTasks()
}

const navigateToCreate = () => {
  router.push('/create')
}

const navigateToMonitor = (task: any) => {
  router.push({
    path: '/monitor',
    query: { sessionId: task.sessionId || task.id }
  })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
