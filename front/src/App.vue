<template>
  <div id="app" class="app-container">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onMounted(() => {
  // 初始化用户信息
  userStore.initializeAuth()
})
</script>

<style lang="scss">
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
  
  > * {
    position: relative;
    z-index: 1;
  }
}

// 全局滚动条样式
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  
  &:hover {
    background: rgba(0, 0, 0, 0.5);
  }
}

// Element Plus 样式覆盖
.el-message {
  z-index: 3000;
}

.el-loading-mask {
  z-index: 2000;
}

.el-dialog {
  border-radius: 12px;
  overflow: hidden;
}

.el-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.el-button {
  border-radius: 8px;
  font-weight: 500;
}

.el-input__wrapper {
  border-radius: 8px;
}

// 响应式设计
@media (max-width: 768px) {
  .app-container {
    padding: 0;
  }
}
</style>