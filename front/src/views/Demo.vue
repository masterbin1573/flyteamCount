<template>
  <div class="demo-page">
    <!-- 导航栏 -->
    <nav class="demo-navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-brand">
          <h2>🛸 飞天蒜子统计</h2>
        </router-link>
        <div class="nav-links">
          <el-button text @click="$router.push('/')">返回首页</el-button>
          <el-button text @click="$router.push('/docs')">使用文档</el-button>
          <el-button type="primary" @click="$router.push('/login')">登录</el-button>
        </div>
      </div>
    </nav>

    <div class="demo-container">
      <!-- 标题区域 -->
      <div class="demo-header">
        <h1>功能演示</h1>
        <p>体验飞天蒜子统计的各项功能，所有演示都基于真实的代码实现</p>
      </div>

      <!-- 统计功能演示 -->
      <section class="demo-section">
        <div class="section-header">
          <h2>📊 统计功能演示</h2>
          <p>以下是实时统计数据的演示效果</p>
        </div>
        
        <div class="demo-content">
          <div class="demo-stats">
            <!-- 基础统计 -->
            <div class="stat-demo">
              <h3>基础统计标签</h3>
              <div class="stat-items">
                <div class="stat-item">
                  <span class="stat-label">本站总访问量</span>
                  <span class="stat-value" ref="sitePvRef">{{ animatedStats.sitePv }}</span>
                  <span class="stat-unit">次</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">本站总访客数</span>
                  <span class="stat-value" ref="siteUvRef">{{ animatedStats.siteUv }}</span>
                  <span class="stat-unit">人</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">本页访问量</span>
                  <span class="stat-value" ref="pagePvRef">{{ animatedStats.pagePv }}</span>
                  <span class="stat-unit">次</span>
                </div>
              </div>
            </div>

            <!-- 卡片样式 -->
            <div class="card-demo">
              <h3>卡片样式</h3>
              <div class="stat-cards">
                <div class="stat-card primary">
                  <div class="card-icon">👁️</div>
                  <div class="card-content">
                    <div class="card-value">{{ formatNumber(demoData.totalViews) }}</div>
                    <div class="card-label">总访问量</div>
                  </div>
                </div>
                <div class="stat-card success">
                  <div class="card-icon">👥</div>
                  <div class="card-content">
                    <div class="card-value">{{ formatNumber(demoData.totalVisitors) }}</div>
                    <div class="card-label">总访客数</div>
                  </div>
                </div>
                <div class="stat-card warning">
                  <div class="card-icon">📊</div>
                  <div class="card-content">
                    <div class="card-value">{{ formatNumber(demoData.todayViews) }}</div>
                    <div class="card-label">今日访问</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 徽章样式 -->
            <div class="badge-demo">
              <h3>徽章样式</h3>
              <div class="badge-container">
                <span class="stat-badge blue">
                  <i class="badge-icon">🚀</i>
                  访问量: {{ formatNumber(demoData.totalViews) }}
                </span>
                <span class="stat-badge green">
                  <i class="badge-icon">⭐</i>
                  访客数: {{ formatNumber(demoData.totalVisitors) }}
                </span>
                <span class="stat-badge purple">
                  <i class="badge-icon">💫</i>
                  在线: {{ demoData.onlineUsers }}
                </span>
              </div>
            </div>
          </div>

          <!-- 代码示例 -->
          <div class="code-showcase">
            <h3>代码示例</h3>
            <el-tabs v-model="activeTab" class="demo-tabs">
              <el-tab-pane label="基础使用" name="basic">
                <div class="code-block">
                  <div class="code-header">
                    <span>HTML</span>
                    <el-button size="small" @click="copyCode(basicCode)">复制代码</el-button>
                  </div>
                  <pre><code>{{ basicCode }}</code></pre>
                </div>
              </el-tab-pane>
              
              <el-tab-pane label="卡片样式" name="card">
                <div class="code-block">
                  <div class="code-header">
                    <span>HTML + CSS</span>
                    <el-button size="small" @click="copyCode(cardCode)">复制代码</el-button>
                  </div>
                  <pre><code>{{ cardCode }}</code></pre>
                </div>
              </el-tab-pane>
              
              <el-tab-pane label="徽章样式" name="badge">
                <div class="code-block">
                  <div class="code-header">
                    <span>HTML + CSS</span>
                    <el-button size="small" @click="copyCode(badgeCode)">复制代码</el-button>
                  </div>
                  <pre><code>{{ badgeCode }}</code></pre>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </section>

      <!-- 点赞功能演示 -->
      <section class="demo-section">
        <div class="section-header">
          <h2>❤️ 点赞功能演示</h2>
          <p>体验简单易用的点赞功能</p>
        </div>
        
        <div class="like-demo-content">
          <div class="like-showcase">
            <div class="like-examples">
              <div class="like-example">
                <h4>默认样式</h4>
                <button 
                  class="like-btn default" 
                  :class="{ liked: likeStates.default }"
                  @click="toggleLike('default')"
                >
                  {{ likeStates.default ? '❤️' : '♡' }} {{ likeCounts.default }}
                </button>
              </div>
              
              <div class="like-example">
                <h4>圆角样式</h4>
                <button 
                  class="like-btn rounded" 
                  :class="{ liked: likeStates.rounded }"
                  @click="toggleLike('rounded')"
                >
                  <span class="like-icon">{{ likeStates.rounded ? '👍' : '👍🏻' }}</span>
                  <span class="like-count">{{ likeCounts.rounded }}</span>
                </button>
              </div>
              
              <div class="like-example">
                <h4>渐变样式</h4>
                <button 
                  class="like-btn gradient" 
                  :class="{ liked: likeStates.gradient }"
                  @click="toggleLike('gradient')"
                >
                  <span class="like-icon">💖</span>
                  <span class="like-text">{{ likeStates.gradient ? '已点赞' : '点赞' }}</span>
                  <span class="like-count">{{ likeCounts.gradient }}</span>
                </button>
              </div>
            </div>
            
            <div class="like-stats">
              <h4>点赞统计</h4>
              <div class="stats-grid">
                <div class="stats-item">
                  <span class="stats-label">总点赞数</span>
                  <span class="stats-value">{{ totalLikes }}</span>
                </div>
                <div class="stats-item">
                  <span class="stats-label">今日点赞</span>
                  <span class="stats-value">{{ todayLikes }}</span>
                </div>
                <div class="stats-item">
                  <span class="stats-label">点赞率</span>
                  <span class="stats-value">{{ likeRate }}%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="like-code">
            <h3>点赞功能代码</h3>
            <div class="code-block">
              <div class="code-header">
                <span>HTML + JavaScript</span>
                <el-button size="small" @click="copyCode(likeCode)">复制代码</el-button>
              </div>
              <pre><code>{{ likeCode }}</code></pre>
            </div>
          </div>
        </div>
      </section>

      <!-- 实时演示 -->
      <section class="demo-section">
        <div class="section-header">
          <h2>⚡ 实时数据演示</h2>
          <p>观察数据的实时变化效果</p>
        </div>
        
        <div class="realtime-demo">
          <div class="realtime-panel">
            <h3>实时访问监控</h3>
            <div class="realtime-indicators">
              <div class="indicator active">
                <span class="indicator-dot"></span>
                <span class="indicator-label">服务状态: 正常</span>
              </div>
              <div class="indicator">
                <span class="indicator-dot warning"></span>
                <span class="indicator-label">响应时间: {{ responseTime }}ms</span>
              </div>
              <div class="indicator">
                <span class="indicator-dot success"></span>
                <span class="indicator-label">当前在线: {{ onlineCount }} 人</span>
              </div>
            </div>
            
            <div class="realtime-chart">
              <div class="chart-placeholder">
                📈 实时访问趋势图
                <div class="chart-bars">
                  <div 
                    class="chart-bar" 
                    v-for="(value, index) in chartData" 
                    :key="index"
                    :style="{ height: value + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="realtime-logs">
            <h3>访问日志</h3>
            <div class="logs-container">
              <div 
                class="log-item" 
                v-for="log in realtimeLogs" 
                :key="log.id"
                :class="{ new: log.isNew }"
              >
                <span class="log-time">{{ log.time }}</span>
                <span class="log-ip">{{ log.ip }}</span>
                <span class="log-page">{{ log.page }}</span>
                <span class="log-location">{{ log.location }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA区域 -->
      <section class="cta-section">
        <div class="cta-content">
          <h2>准备开始使用了吗？</h2>
          <p>只需要一行代码，立即为您的网站添加专业的访问统计功能</p>
          <div class="cta-buttons">
            <el-button type="primary" size="large" @click="$router.push('/register')">
              立即注册
            </el-button>
            <el-button size="large" @click="$router.push('/docs')">
              查看文档
            </el-button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { ElMessage } from 'element-plus'

// 响应式数据
const activeTab = ref('basic')

// 动画统计数据
const animatedStats = reactive({
  sitePv: 0,
  siteUv: 0,
  pagePv: 0
})

// 演示数据
const demoData = reactive({
  totalViews: 258043,
  totalVisitors: 45892,
  todayViews: 1256,
  onlineUsers: 23
})

// 点赞状态
const likeStates = reactive({
  default: false,
  rounded: false,
  gradient: false
})

const likeCounts = reactive({
  default: 42,
  rounded: 18,
  gradient: 76
})

// 实时数据
const responseTime = ref(45)
const onlineCount = ref(23)
const chartData = ref([65, 45, 78, 52, 89, 63, 71, 55, 82, 67])

const realtimeLogs = ref([
  { id: 1, time: '14:23:45', ip: '192.168.1.***', page: '/', location: '北京', isNew: false },
  { id: 2, time: '14:23:32', ip: '10.0.0.***', page: '/blog', location: '上海', isNew: false },
  { id: 3, time: '14:23:18', ip: '172.16.0.***', page: '/about', location: '广州', isNew: false }
])

// 计算属性
const totalLikes = computed(() => {
  return Object.values(likeCounts).reduce((sum, count) => sum + count, 0)
})

const todayLikes = computed(() => {
  return Math.floor(totalLikes.value * 0.15)
})

const likeRate = computed(() => {
  return ((totalLikes.value / demoData.totalViews) * 100).toFixed(1)
})

// 代码示例
const basicCode = `<!-- 引入统计脚本 -->
<script async src="//api.flyteam.cloud/busuanzi/2.3/busuanzi.pure.mini.js"></script>

<!-- 显示统计数据 -->
<span id="busuanzi_container_site_pv">
  本站总访问量<span id="busuanzi_value_site_pv"></span>次
</span>
<span id="busuanzi_container_site_uv">
  本站总访客数<span id="busuanzi_value_site_uv"></span>人
</span>`

const cardCode = `<!-- HTML -->
<div class="stat-card">
  <div class="card-icon">👁️</div>
  <div class="card-content">
    <div class="card-value" id="busuanzi_value_site_pv">0</div>
    <div class="card-label">总访问量</div>
  </div>
</div>

<!-- CSS -->
<style>
.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}
.card-icon { font-size: 2rem; margin-right: 16px; }
.card-value { font-size: 1.5rem; font-weight: bold; }
.card-label { opacity: 0.9; }
</style>`

const badgeCode = `<!-- HTML -->
<span class="stat-badge">
  <i class="badge-icon">🚀</i>
  访问量: <span id="busuanzi_value_site_pv">0</span>
</span>

<!-- CSS -->
<style>
.stat-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background: #667eea;
  color: white;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}
.badge-icon { margin-right: 6px; }
</style>`

const likeCode = `<!-- 引入点赞脚本 -->
<script async src="//api.flyteam.cloud/api/like/script.js"></script>

<!-- 点赞按钮 -->
<button class="flyteam-like-btn">♡ 0</button>

<!-- CSS样式 -->
<style>
.flyteam-like-btn {
  padding: 8px 16px;
  border: 2px solid #e9ecef;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}
.flyteam-like-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}
.flyteam-like-btn.liked {
  color: #e74c3c;
  border-color: #e74c3c;
}
</style>`

// 方法
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const copyCode = async (code) => {
  try {
    await navigator.clipboard.writeText(code)
    ElMessage.success('代码已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败，请手动复制')
  }
}

const toggleLike = (type) => {
  likeStates[type] = !likeStates[type]
  if (likeStates[type]) {
    likeCounts[type]++
    ElMessage.success('点赞成功！')
  } else {
    likeCounts[type]--
    ElMessage.info('取消点赞')
  }
}

// 数字动画
const animateValue = (target, endValue, duration = 2000) => {
  const startValue = 0
  const startTime = Date.now()
  
  const updateValue = () => {
    const currentTime = Date.now()
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // 使用缓动函数
    const easeOutCubic = 1 - Math.pow(1 - progress, 3)
    const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutCubic)
    
    target.value = currentValue
    
    if (progress < 1) {
      requestAnimationFrame(updateValue)
    }
  }
  
  requestAnimationFrame(updateValue)
}

// 实时数据更新
let intervals = []

const startRealTimeUpdates = () => {
  // 更新统计数据
  intervals.push(setInterval(() => {
    if (Math.random() > 0.7) {
      demoData.totalViews += Math.floor(Math.random() * 3) + 1
      demoData.todayViews += Math.floor(Math.random() * 2) + 1
    }
    if (Math.random() > 0.9) {
      demoData.totalVisitors += 1
    }
  }, 3000))

  // 更新响应时间
  intervals.push(setInterval(() => {
    responseTime.value = Math.floor(Math.random() * 50) + 20
  }, 5000))

  // 更新在线人数
  intervals.push(setInterval(() => {
    onlineCount.value = Math.floor(Math.random() * 10) + 20
  }, 8000))

  // 更新图表数据
  intervals.push(setInterval(() => {
    chartData.value.shift()
    chartData.value.push(Math.floor(Math.random() * 60) + 30)
  }, 2000))

  // 添加访问日志
  intervals.push(setInterval(() => {
    const pages = ['/', '/blog', '/about', '/products', '/contact']
    const locations = ['北京', '上海', '广州', '深圳', '杭州']
    const now = new Date()
    
    const newLog = {
      id: Date.now(),
      time: now.toTimeString().slice(0, 8),
      ip: `192.168.${Math.floor(Math.random() * 255)}.***`,
      page: pages[Math.floor(Math.random() * pages.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      isNew: true
    }
    
    realtimeLogs.value.unshift(newLog)
    if (realtimeLogs.value.length > 10) {
      realtimeLogs.value.pop()
    }
    
    // 移除新标记
    setTimeout(() => {
      newLog.isNew = false
    }, 2000)
  }, 4000))
}

const stopRealTimeUpdates = () => {
  intervals.forEach(interval => clearInterval(interval))
  intervals = []
}

onMounted(() => {
  // 启动数字动画
  animateValue({ value: (val) => animatedStats.sitePv = val }, 258043, 3000)
  animateValue({ value: (val) => animatedStats.siteUv = val }, 45892, 3000)
  animateValue({ value: (val) => animatedStats.pagePv = val }, 1256, 2000)
  
  // 启动实时更新
  startRealTimeUpdates()
})

onUnmounted(() => {
  stopRealTimeUpdates()
})
</script>

<style lang="scss" scoped>
.demo-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

// 导航栏样式
.demo-navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.nav-brand {
  text-decoration: none;
  color: inherit;
  
  h2 {
    margin: 0;
    color: $primary-color;
    font-weight: 600;
  }
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 16px;
}

// 主要内容样式
.demo-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px;
}

.demo-header {
  text-align: center;
  margin-bottom: 60px;
  color: white;
  
  h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 16px;
  }
  
  p {
    font-size: 1.25rem;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;
  }
}

// 演示区域样式
.demo-section {
  margin-bottom: 80px;
  
  .section-header {
    text-align: center;
    margin-bottom: 40px;
    color: white;
    
    h2 {
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: 12px;
    }
    
    p {
      font-size: 1.125rem;
      opacity: 0.8;
    }
  }
}

.demo-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: flex-start;
}

// 统计演示样式
.demo-stats {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 20px;
  }
}

.stat-demo {
  margin-bottom: 40px;
  
  .stat-items {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .stat-item {
    display: flex;
    align-items: center;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 12px;
    
    .stat-label {
      flex: 1;
      color: $text-secondary;
    }
    
    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: $primary-color;
      margin: 0 8px;
    }
    
    .stat-unit {
      color: $text-secondary;
    }
  }
}

.card-demo {
  margin-bottom: 40px;
  
  .stat-cards {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .stat-card {
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 12px;
    color: white;
    
    &.primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    &.success {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }
    
    &.warning {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    
    .card-icon {
      font-size: 2rem;
      margin-right: 16px;
    }
    
    .card-content {
      .card-value {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 4px;
      }
      
      .card-label {
        opacity: 0.9;
        font-size: 0.9rem;
      }
    }
  }
}

.badge-demo {
  .badge-container {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .stat-badge {
    display: inline-flex;
    align-items: center;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
    color: white;
    
    &.blue {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    &.green {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }
    
    &.purple {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    
    .badge-icon {
      margin-right: 6px;
    }
  }
}

// 代码展示样式
.code-showcase {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 20px;
  }
}

.demo-tabs {
  :deep(.el-tabs__header) {
    margin: 0 0 20px 0;
  }
  
  :deep(.el-tabs__nav-wrap::after) {
    display: none;
  }
}

.code-block {
  background: #282c34;
  border-radius: 12px;
  overflow: hidden;
  
  .code-header {
    background: #21252b;
    padding: 12px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    span {
      color: #abb2bf;
      font-size: 0.875rem;
      font-weight: 500;
    }
  }
  
  pre {
    margin: 0;
    padding: 20px;
    color: #abb2bf;
    font-family: 'Monaco', 'Consolas', monospace;
    font-size: 0.9rem;
    line-height: 1.5;
    overflow-x: auto;
    
    code {
      background: none;
      padding: 0;
      color: inherit;
    }
  }
}

// 点赞演示样式
.like-demo-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.like-showcase {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  
  .like-examples {
    margin-bottom: 32px;
    
    .like-example {
      margin-bottom: 24px;
      
      h4 {
        font-size: 1rem;
        font-weight: 600;
        color: $text-primary;
        margin-bottom: 12px;
      }
    }
  }
  
  .like-btn {
    padding: 12px 20px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
    
    &.liked {
      color: #e74c3c;
      border-color: #e74c3c;
    }
    
    &.rounded {
      border-radius: 25px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    &.gradient {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      display: flex;
      align-items: center;
      gap: 8px;
      
      &.liked {
        background: linear-gradient(135deg, #e74c3c 0%, #f56c6c 100%);
      }
    }
  }
  
  .like-stats {
    border-top: 1px solid #e9ecef;
    padding-top: 24px;
    
    h4 {
      font-size: 1rem;
      font-weight: 600;
      color: $text-primary;
      margin-bottom: 16px;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
      
      .stats-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        
        .stats-label {
          color: $text-secondary;
        }
        
        .stats-value {
          font-weight: 600;
          color: $primary-color;
        }
      }
    }
  }
}

.like-code {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 20px;
  }
}

// 实时演示样式
.realtime-demo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.realtime-panel {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 20px;
  }
  
  .realtime-indicators {
    margin-bottom: 24px;
    
    .indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      
      .indicator-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #67c23a;
        animation: pulse 2s infinite;
        
        &.warning {
          background: #e6a23c;
        }
        
        &.success {
          background: #67c23a;
        }
      }
      
      .indicator-label {
        font-size: 0.875rem;
        color: $text-secondary;
      }
    }
  }
  
  .realtime-chart {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 24px;
    text-align: center;
    
    .chart-placeholder {
      color: $text-secondary;
      font-size: 1rem;
      margin-bottom: 16px;
    }
    
    .chart-bars {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      height: 100px;
      gap: 4px;
      
      .chart-bar {
        flex: 1;
        background: linear-gradient(to top, #667eea 0%, #764ba2 100%);
        border-radius: 2px 2px 0 0;
        transition: height 0.3s ease;
        min-height: 10px;
      }
    }
  }
}

.realtime-logs {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 20px;
  }
  
  .logs-container {
    max-height: 300px;
    overflow-y: auto;
    
    .log-item {
      display: grid;
      grid-template-columns: auto 1fr auto auto;
      gap: 12px;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.875rem;
      margin-bottom: 4px;
      transition: all 0.3s ease;
      
      &.new {
        background: rgba(102, 126, 234, 0.1);
        transform: scale(1.02);
      }
      
      .log-time {
        color: $text-secondary;
        font-family: monospace;
      }
      
      .log-ip {
        color: $text-secondary;
        font-family: monospace;
      }
      
      .log-page {
        color: $primary-color;
        font-weight: 500;
      }
      
      .log-location {
        color: $text-regular;
      }
    }
  }
}

// CTA区域样式
.cta-section {
  text-align: center;
  
  .cta-content {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 60px 40px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    
    h2 {
      font-size: 2rem;
      font-weight: 600;
      color: $text-primary;
      margin-bottom: 16px;
    }
    
    p {
      font-size: 1.125rem;
      color: $text-secondary;
      margin-bottom: 32px;
    }
    
    .cta-buttons {
      display: flex;
      justify-content: center;
      gap: 16px;
    }
  }
}

// 动画效果
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .demo-content,
  .like-demo-content,
  .realtime-demo {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .demo-container {
    padding: 20px 16px;
  }
  
  .nav-container {
    padding: 0 16px;
  }
  
  .demo-header {
    h1 {
      font-size: 2rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
  
  .demo-stats,
  .code-showcase,
  .like-showcase,
  .like-code,
  .realtime-panel,
  .realtime-logs {
    padding: 24px 20px;
  }
  
  .stat-cards {
    grid-template-columns: 1fr;
  }
  
  .cta-content {
    padding: 40px 24px;
    
    .cta-buttons {
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>