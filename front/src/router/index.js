import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '飞天蒜子统计 - 免费网站访问统计服务'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      title: '数据面板 - 飞天蒜子统计',
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '登录 - 飞天蒜子统计'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: {
      title: '注册 - 飞天蒜子统计'
    }
  },
  {
    path: '/docs',
    name: 'Docs',
    component: () => import('@/views/Docs.vue'),
    meta: {
      title: '使用文档 - 飞天蒜子统计'
    }
  },
  {
    path: '/preview',
    name: 'Preview',
    component: () => import('@/views/Preview.vue'),
    meta: {
      title: '数据预览 - 飞天蒜子统计'
    }
  },
  {
    path: '/demo',
    name: 'Demo',
    component: () => import('@/views/Demo.vue'),
    meta: {
      title: '功能演示 - 飞天蒜子统计'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '页面未找到 - 飞天蒜子统计'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // 检查是否需要认证
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    // 如果需要认证但用户未登录，跳转到登录页
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
  } else if ((to.name === 'Login' || to.name === 'Register') && userStore.isAuthenticated) {
    // 如果已登录用户访问登录/注册页，跳转到仪表板
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router