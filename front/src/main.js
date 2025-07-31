import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIcons from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import App from './App.vue'
import router from './router'
import { useUserStore } from '@/stores/user'
import './styles/index.scss'

// 初始化应用
async function initApp() {
  const app = createApp(App)
  
  // 注册 Element Plus 图标
  for (const [key, component] of Object.entries(ElementPlusIcons)) {
    app.component(key, component)
  }
  
  const pinia = createPinia()
  app.use(pinia)
  app.use(router)
  app.use(ElementPlus, {
    locale: {
      name: 'zh-cn'
    }
  })
  
  // 初始化用户认证状态
  const userStore = useUserStore()
  await userStore.initializeAuth()
  
  app.mount('#app')
}

initApp()