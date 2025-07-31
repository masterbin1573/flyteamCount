<template>
  <div class="not-found-page">
    <div class="not-found-container">
      <div class="not-found-content">
        <!-- 404图标 -->
        <div class="error-icon">
          <div class="icon-404">404</div>
          <div class="icon-ufo">🛸</div>
        </div>
        
        <!-- 错误信息 -->
        <div class="error-info">
          <h1>页面走丢了</h1>
          <p>抱歉，您访问的页面不存在或已被移动到其他位置</p>
        </div>
        
        <!-- 操作按钮 -->
        <div class="error-actions">
          <el-button type="primary" size="large" @click="goHome">
            <el-icon><House /></el-icon>
            返回首页
          </el-button>
          <el-button size="large" @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
            返回上页
          </el-button>
        </div>
        
        <!-- 建议链接 -->
        <div class="suggested-links">
          <h3>您可能感兴趣的页面：</h3>
          <div class="links-grid">
            <router-link to="/" class="link-item">
              <el-icon><House /></el-icon>
              <span>首页</span>
            </router-link>
            <router-link to="/docs" class="link-item">
              <el-icon><Document /></el-icon>
              <span>使用文档</span>
            </router-link>
            <router-link to="/preview" class="link-item">
              <el-icon><DataAnalysis /></el-icon>
              <span>数据预览</span>
            </router-link>
            <router-link to="/demo" class="link-item">
              <el-icon><VideoPlay /></el-icon>
              <span>功能演示</span>
            </router-link>
          </div>
        </div>
      </div>
      
      <!-- 装饰元素 -->
      <div class="decoration">
        <div class="floating-element" v-for="i in 6" :key="i" :style="getFloatingStyle(i)">
          {{ getFloatingIcon(i) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

const getFloatingStyle = (index) => {
  const positions = [
    { top: '20%', left: '10%', animationDelay: '0s' },
    { top: '30%', right: '15%', animationDelay: '1s' },
    { bottom: '25%', left: '20%', animationDelay: '2s' },
    { top: '60%', right: '25%', animationDelay: '0.5s' },
    { bottom: '15%', right: '10%', animationDelay: '1.5s' },
    { top: '15%', left: '60%', animationDelay: '2.5s' }
  ]
  
  return {
    ...positions[index - 1],
    animationDelay: positions[index - 1].animationDelay
  }
}

const getFloatingIcon = (index) => {
  const icons = ['📊', '📈', '🚀', '⭐', '💫', '🌟']
  return icons[index - 1]
}
</script>

<style lang="scss" scoped>
.not-found-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.not-found-container {
  max-width: 800px;
  width: 100%;
  text-align: center;
  position: relative;
  z-index: 10;
}

.not-found-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 60px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

// 404图标样式
.error-icon {
  position: relative;
  margin-bottom: 40px;
  
  .icon-404 {
    font-size: 8rem;
    font-weight: 900;
    color: $primary-color;
    opacity: 0.8;
    letter-spacing: -0.05em;
    text-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  }
  
  .icon-ufo {
    position: absolute;
    top: -20px;
    right: -40px;
    font-size: 3rem;
    animation: float 3s ease-in-out infinite;
  }
}

// 错误信息样式
.error-info {
  margin-bottom: 40px;
  
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: $text-primary;
    margin-bottom: 16px;
  }
  
  p {
    font-size: 1.125rem;
    color: $text-secondary;
    line-height: 1.6;
    max-width: 500px;
    margin: 0 auto;
  }
}

// 操作按钮样式
.error-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 50px;
  
  .el-button {
    border-radius: 12px;
    padding: 12px 32px;
    font-weight: 500;
  }
}

// 建议链接样式
.suggested-links {
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 24px;
  }
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  max-width: 500px;
  margin: 0 auto;
}

.link-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 16px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  text-decoration: none;
  color: $primary-color;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.2);
    transform: translateY(-2px);
  }
  
  .el-icon {
    font-size: 1.5rem;
  }
  
  span {
    font-size: 0.875rem;
    font-weight: 500;
  }
}

// 装饰元素样式
.decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.floating-element {
  position: absolute;
  font-size: 2rem;
  opacity: 0.6;
  animation: float 4s ease-in-out infinite;
  color: rgba(255, 255, 255, 0.8);
}

// 动画效果
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .not-found-content {
    padding: 40px 24px;
  }
  
  .error-icon {
    .icon-404 {
      font-size: 6rem;
    }
    
    .icon-ufo {
      font-size: 2rem;
      top: -10px;
      right: -20px;
    }
  }
  
  .error-info {
    h1 {
      font-size: 2rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
    
    .el-button {
      width: 200px;
    }
  }
  
  .links-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .link-item {
    padding: 16px 12px;
    
    .el-icon {
      font-size: 1.25rem;
    }
    
    span {
      font-size: 0.8rem;
    }
  }
  
  .floating-element {
    font-size: 1.5rem;
  }
}

// 页面进入动画
.not-found-content {
  animation: slideInUp 0.8s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>