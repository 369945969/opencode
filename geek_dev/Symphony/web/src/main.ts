import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css' // Import styles if needed

const app = createApp(App)
app.use(router)
app.mount('#app')
