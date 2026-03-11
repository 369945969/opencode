import { createRouter, createWebHashHistory } from 'vue-router'
import TaskList from '../views/TaskList.vue'
import CreateTask from '../views/CreateTask.vue'
import Monitor from '../views/Monitor.vue'

const routes = [
  {
    path: '/',
    name: 'TaskList',
    component: TaskList
  },
  {
    path: '/create',
    name: 'CreateTask',
    component: CreateTask
  },
  {
    path: '/monitor',
    name: 'Monitor',
    component: Monitor
  }
]

const router = createRouter({
  history: createWebHashHistory(), // Using hash history to avoid issues with static hosting
  routes
})

export default router
