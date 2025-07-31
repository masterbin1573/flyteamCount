<template>
  <div class="home-page">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <h2>🛸 飞天蒜子统计</h2>
        </div>
        <div class="nav-links">
          <el-button text @click="scrollToSection('features')">功能特性</el-button>
          <el-button text @click="scrollToSection('usage')">使用方法</el-button>
          <el-button text @click="$router.push('/docs')">使用文档</el-button>
          <el-button text @click="$router.push('/preview')">数据预览</el-button>
          <el-button type="primary" @click="$router.push('/login')">登录</el-button>
        </div>
      </div>
    </nav>

    <!-- 英雄区域 -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title fade-in">
            免费网站访问统计服务
          </h1>
          <p class="hero-subtitle fade-in">
            兼容不蒜子，提供详细的数据分析面板，轻松掌握网站访问情况
          </p>
          <div class="hero-buttons fade-in">
            <el-button 
              type="primary" 
              size="large" 
              @click="scrollToSection('usage')"
              class="hero-btn"
            >
              立即开始使用
            </el-button>
            <el-button 
              size="large" 
              @click="$router.push('/demo')"
              class="hero-btn"
            >
              查看演示
            </el-button>
          </div>
          
          <!-- 实时统计展示 -->
          <div class="stats-showcase">
            <div class="stat-item">
              <div class="stat-number">{{ formatNumber(demoStats.totalSites) }}</div>
              <div class="stat-label">接入网站</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ formatNumber(demoStats.totalViews) }}</div>
              <div class="stat-label">总访问量</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ formatNumber(demoStats.todayViews) }}</div>
              <div class="stat-label">今日访问</div>
            </div>
          </div>
        </div>
        
        <div class="hero-image">
          <div class="dashboard-preview">
            <div class="preview-header">
              <div class="preview-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div class="preview-content">
              <div class="chart-placeholder">
                📊 数据统计面板
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 功能特性 -->
    <section id="features" class="features-section">
      <div class="container">
        <h2 class="section-title">功能特性</h2>
        <div class="features-grid">
          <div class="feature-card" v-for="feature in features" :key="feature.title">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 使用方法 -->
    <section id="usage" class="usage-section">
      <div class="container">
        <h2 class="section-title">使用方法</h2>
        <div class="usage-steps">
          <div class="step-item" v-for="(step, index) in usageSteps" :key="index">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-content">
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-description">{{ step.description }}</p>
              <div class="step-code" v-if="step.code">
                <pre><code>{{ step.code }}</code></pre>
                <el-button 
                  size="small" 
                  type="primary" 
                  @click="copyCode(step.code)"
                  class="copy-btn"
                >
                  复制代码
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 兼容性说明 -->
    <section class="compatibility-section">
      <div class="container">
        <h2 class="section-title">完全兼容不蒜子</h2>
        <div class="compatibility-content">
          <div class="compatibility-text">
            <p>飞天蒜子统计完全兼容不蒜子的使用方式，无需修改现有代码即可直接使用。</p>
            <ul>
              <li>✅ 支持所有不蒜子的标签格式</li>
              <li>✅ 相同的 JavaScript 调用方式</li>
              <li>✅ 无缝迁移，零成本切换</li>
              <li>✅ 提供更详细的数据分析</li>
            </ul>
          </div>
          <div class="compatibility-demo">
            <h4>兼容示例</h4>
            <div class="demo-code">
              <pre><code>&lt;script async src="//api.flyteam.cloud/stats/flyteam-stats.min.js"&gt;&lt;/script&gt;
&lt;span id="busuanzi_container_site_pv"&gt;
  本站总访问量&lt;span id="busuanzi_value_site_pv"&gt;&lt;/span&gt;次
&lt;/span&gt;</code></pre>
            </div>
            
            <!-- 实时演示 -->
            <div class="live-demo">
              <h4>实时演示</h4>
              <div class="demo-stats">
                <span class="demo-stat">
                  本站总访问量 <span class="stat-value">{{ demoStats.totalViews }}</span> 次
                </span>
                <span class="demo-stat">
                  本站总访客数 <span class="stat-value">{{ demoStats.totalVisitors }}</span> 人
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 点赞功能演示 -->
    <section class="like-demo-section">
      <div class="container">
        <h2 class="section-title">一键点赞功能</h2>
        <div class="like-demo-content">
          <div class="like-demo-text">
            <p>除了访问统计，我们还提供了简单易用的点赞功能，让访客可以为优质内容点赞。</p>
            <ul>
              <li>🚫 无需登录即可点赞</li>
              <li>⚡ 智能防抖，防止频繁操作</li>
              <li>📊 点赞数据统计和排行</li>
              <li>🎨 多种样式可选</li>
            </ul>
          </div>
          <div class="like-demo-interactive">
            <h4>试试点赞功能</h4>
            <div class="like-buttons">
              <button class="like-btn" :class="{ liked: isLiked }" @click="toggleLike">
                {{ isLiked ? '❤️' : '♡' }} {{ likeCount }}
              </button>
              <button class="like-btn-alt">
                👍 {{ likeCount + 5 }}
              </button>
            </div>
            <p class="like-note">* 这只是演示，实际点赞需要注册登录并集成代码</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <h3>🛸 飞天蒜子统计</h3>
            <p>免费、可靠、易用的网站访问统计服务</p>
          </div>
          <div class="footer-links">
            <div class="link-group">
              <h4>产品</h4>
              <router-link to="/docs">使用文档</router-link>
              <router-link to="/preview">数据预览</router-link>
              <router-link to="/demo">功能演示</router-link>
            </div>
            <div class="link-group">
              <h4>支持</h4>
              <a href="mailto:support@flyteam.cloud">技术支持</a>
              <a href="https://github.com/flyteam" target="_blank">GitHub</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2023 飞天蒜子统计. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 响应式数据
const demoStats = ref({
  totalSites: 1280,
  totalViews: 2580000,
  todayViews: 8640,
  totalVisitors: 156000
})

const isLiked = ref(false)
const likeCount = ref(42)

// 功能特性数据
const features = [
  {
    icon: '🚀',
    title: '快速集成',
    description: '一行代码即可集成，支持不蒜子无缝迁移'
  },
  {
    icon: '📊',
    title: '详细统计',
    description: '提供 PV、UV、地域、浏览器等详细数据分析'
  },
  {
    icon: '🔒',
    title: '隐私保护',
    description: '所有敏感信息都经过哈希处理，保护用户隐私'
  },
  {
    icon: '⚡',
    title: '高性能',
    description: '优化的数据库设计，快速响应，低延迟'
  },
  {
    icon: '🎨',
    title: '多种样式',
    description: '支持普通文本、卡片、徽章等多种显示样式'
  },
  {
    icon: '💝',
    title: '完全免费',
    description: '永久免费使用，无任何隐藏费用'
  }
]

// 使用步骤
const usageSteps = [
  {
    title: '引入统计脚本',
    description: '在你的网页 &lt;head&gt; 或 &lt;body&gt; 中添加统计脚本，完全兼容不蒜子',
    code: '<script async src="//api.flyteam.cloud/stats/flyteam-stats.min.js"><\/script>'
  },
  {
    title: '添加统计标签',
    description: '在需要显示统计数据的地方添加对应的 HTML 标签，与不蒜子完全相同',
    code: `<!-- 站点总访问量 -->
<span id="busuanzi_container_site_pv">
  本站总访问量<span id="busuanzi_value_site_pv"><\/span>次
<\/span>

<!-- 站点总访客数 -->
<span id="busuanzi_container_site_uv">
  本站总访客数<span id="busuanzi_value_site_uv"><\/span>人
<\/span>

<!-- 页面访问量 -->
<span id="busuanzi_container_page_pv">
  本页访问量<span id="busuanzi_value_page_pv"><\/span>次
<\/span>`
  },
  {
    title: '添加点赞功能（可选）',
    description: '引入点赞脚本，为页面添加互动点赞功能',
    code: `<!-- 引入点赞脚本 -->
<script async src="//api.flyteam.cloud/like/flyteam-like.min.js"><\/script>

<!-- 添加点赞按钮 -->
<button class="like-btn">♡ 点赞<\/button>
<div data-flyteam-like>❤️ 喜欢这篇文章<\/div>`
  },
  {
    title: '注册账号获取详细数据',
    description: '注册账号可以获得详细的数据分析面板、图表统计和更多功能',
    code: null
  }
]

// 方法
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const copyCode = async (code) => {
  try {
    await navigator.clipboard.writeText(code)
    ElMessage.success('代码已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败，请手动复制')
  }
}

const toggleLike = () => {
  if (isLiked.value) {
    isLiked.value = false
    likeCount.value -= 1
    ElMessage.info('取消点赞')
  } else {
    isLiked.value = true
    likeCount.value += 1
    ElMessage.success('点赞成功')
  }
}

// 模拟实时数据更新
onMounted(() => {
  const interval = setInterval(() => {
    // 随机增加访问量
    if (Math.random() > 0.7) {
      demoStats.value.totalViews += Math.floor(Math.random() * 3) + 1
      demoStats.value.todayViews += Math.floor(Math.random() * 2) + 1
    }
    if (Math.random() > 0.9) {
      demoStats.value.totalVisitors += 1
    }
  }, 3000)

  // 页面卸载时清除定时器
  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
}

// 导航栏样式
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
  padding: 0;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.nav-brand h2 {
  margin: 0;
  color: $primary-color;
  font-weight: 600;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 16px;
}

// 英雄区域样式
.hero-section {
  padding: 120px 24px 80px;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.hero-content {
  color: white;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 24px;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 40px;
  opacity: 0.9;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  margin-bottom: 60px;
}

.hero-btn {
  padding: 12px 32px;
  font-size: 16px;
  border-radius: 8px;
}

.stats-showcase {
  display: flex;
  gap: 40px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
  color: white;
}

// 仪表板预览样式
.hero-image {
  display: flex;
  justify-content: center;
}

.dashboard-preview {
  width: 400px;
  height: 300px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.preview-header {
  height: 40px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  padding: 0 16px;
}

.preview-dots {
  display: flex;
  gap: 8px;
  
  span {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ddd;
    
    &:nth-child(1) { background: #ff5f56; }
    &:nth-child(2) { background: #ffbd2e; }
    &:nth-child(3) { background: #27ca3f; }
  }
}

.preview-content {
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100% - 40px);
}

.chart-placeholder {
  font-size: 1.5rem;
  color: $primary-color;
  text-align: center;
}

// 通用容器和标题样式
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 60px;
  color: white;
}

// 功能特性样式
.features-section {
  padding: 80px 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px 30px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
  }
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: $text-primary;
}

.feature-description {
  color: $text-secondary;
  line-height: 1.6;
  margin: 0;
}

// 使用方法样式
.usage-section {
  padding: 80px 0;
}

.usage-steps {
  max-width: 800px;
  margin: 0 auto;
}

.step-item {
  display: flex;
  gap: 30px;
  margin-bottom: 50px;
  align-items: flex-start;
}

.step-number {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: $primary-gradient;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: white;
}

.step-description {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 20px;
  line-height: 1.6;
}

.step-code {
  position: relative;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  overflow: hidden;
  
  pre {
    margin: 0;
    padding: 20px;
    background: none;
    
    code {
      color: #e6e6e6;
      background: none;
      padding: 0;
    }
  }
  
  .copy-btn {
    position: absolute;
    top: 12px;
    right: 12px;
  }
}

// 兼容性样式
.compatibility-section {
  padding: 80px 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.compatibility-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.compatibility-text {
  color: white;
  
  p {
    font-size: 1.125rem;
    margin-bottom: 24px;
    line-height: 1.6;
  }
  
  ul {
    list-style: none;
    padding: 0;
    
    li {
      margin-bottom: 12px;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
}

.compatibility-demo {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 12px;
  
  h4 {
    margin-top: 0;
    margin-bottom: 20px;
    color: $text-primary;
  }
}

.demo-code {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  
  pre {
    margin: 0;
    
    code {
      font-size: 0.875rem;
      line-height: 1.5;
    }
  }
}

.live-demo {
  border-top: 1px solid #e9ecef;
  padding-top: 20px;
}

.demo-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.demo-stat {
  font-size: 1rem;
  color: $text-primary;
}

.stat-value {
  font-weight: 600;
  color: $primary-color;
}

// 点赞演示样式
.like-demo-section {
  padding: 80px 0;
}

.like-demo-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.like-demo-text {
  color: white;
  
  p {
    font-size: 1.125rem;
    margin-bottom: 24px;
    line-height: 1.6;
  }
  
  ul {
    list-style: none;
    padding: 0;
    
    li {
      margin-bottom: 12px;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
}

.like-demo-interactive {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  
  h4 {
    margin-top: 0;
    margin-bottom: 24px;
    color: $text-primary;
  }
}

.like-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 16px;
}

.like-btn, .like-btn-alt {
  padding: 12px 24px;
  border: 2px solid #e9ecef;
  border-radius: 25px;
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
}

.like-note {
  font-size: 0.875rem;
  color: $text-secondary;
  margin: 0;
}

// 页脚样式
.footer {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  color: white;
  padding: 60px 0 30px;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-bottom: 40px;
}

.footer-brand {
  h3 {
    margin-bottom: 16px;
    color: white;
  }
  
  p {
    opacity: 0.8;
    margin: 0;
  }
}

.footer-links {
  display: flex;
  gap: 60px;
}

.link-group {
  h4 {
    margin-bottom: 20px;
    color: white;
  }
  
  a {
    display: block;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    margin-bottom: 12px;
    transition: color 0.3s ease;
    
    &:hover {
      color: white;
    }
  }
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 30px;
  text-align: center;
  
  p {
    opacity: 0.6;
    margin: 0;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .nav-container {
    padding: 0 16px;
  }
  
  .nav-links {
    gap: 8px;
    
    .el-button {
      padding: 8px 12px;
      font-size: 0.875rem;
    }
  }
  
  .hero-container {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-buttons {
    justify-content: center;
  }
  
  .stats-showcase {
    justify-content: center;
    gap: 30px;
  }
  
  .dashboard-preview {
    width: 320px;
    height: 240px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .step-item {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .compatibility-content,
  .like-demo-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
  
  .footer-links {
    justify-content: center;
    gap: 40px;
  }
}
</style>