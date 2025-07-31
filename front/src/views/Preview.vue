<template>
  <div class="preview-page">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <router-link to="/">
            <h2>🛸 飞天蒜子统计</h2>
          </router-link>
        </div>
        <div class="nav-links">
          <el-button text @click="$router.push('/')">返回首页</el-button>
          <el-button text @click="$router.push('/docs')">使用文档</el-button>
          <el-button type="primary" @click="$router.push('/login')">登录</el-button>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <main class="preview-main">
      <div class="container">
        <!-- 标题区域 -->
        <div class="preview-header">
          <h1>数据统计预览</h1>
          <p>体验飞天蒜子统计的强大数据分析功能，以下是基于真实数据的演示界面</p>
        </div>

        <!-- 概览统计 -->
        <section class="overview-section">
          <div class="stat-grid">
            <div class="stat-item" v-for="stat in demoStats" :key="stat.key">
              <div class="stat-icon" :style="{ background: stat.gradient }">
                {{ stat.icon }}
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stat.value }}</div>
                <div class="stat-label">{{ stat.label }}</div>
                <div class="stat-trend" :class="stat.trend">
                  <el-icon><TrendCharts /></el-icon>
                  {{ stat.change }}
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 图表展示 -->
        <section class="charts-section">
          <div class="charts-container">
            <!-- 访问趋势图 -->
            <div class="chart-card large">
              <div class="chart-header">
                <h3>📈 访问趋势分析</h3>
                <div class="chart-controls">
                  <el-radio-group v-model="timeRange" size="small">
                    <el-radio-button label="7d">7天</el-radio-button>
                    <el-radio-button label="30d">30天</el-radio-button>
                    <el-radio-button label="90d">90天</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
              <div class="chart-body">
                <div ref="trendsChartRef" class="chart-canvas"></div>
              </div>
            </div>

            <!-- 地域分布 -->
            <div class="chart-card">
              <div class="chart-header">
                <h3>🌍 访客地域分布</h3>
              </div>
              <div class="chart-body">
                <div ref="geoChartRef" class="chart-canvas"></div>
              </div>
            </div>

            <!-- 浏览器统计 -->
            <div class="chart-card">
              <div class="chart-header">
                <h3>🌐 浏览器分析</h3>
              </div>
              <div class="chart-body">
                <div ref="browserChartRef" class="chart-canvas"></div>
              </div>
            </div>

            <!-- 设备统计 -->
            <div class="chart-card">
              <div class="chart-header">
                <h3>📱 设备类型分析</h3>
              </div>
              <div class="chart-body">
                <div ref="deviceChartRef" class="chart-canvas"></div>
              </div>
            </div>

            <!-- 热门页面 -->
            <div class="chart-card">
              <div class="chart-header">
                <h3>🔥 热门页面排行</h3>
              </div>
              <div class="chart-body">
                <div ref="pagesChartRef" class="chart-canvas"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- 实时数据表格 -->
        <section class="realtime-section">
          <div class="realtime-card">
            <div class="realtime-header">
              <h3>⚡ 实时访问数据</h3>
              <div class="realtime-indicator">
                <span class="indicator-dot"></span>
                实时更新
              </div>
            </div>
            <div class="realtime-body">
              <el-table :data="realtimeData" style="width: 100%" stripe>
                <el-table-column prop="time" label="时间" width="120" />
                <el-table-column prop="page" label="页面" min-width="200" />
                <el-table-column prop="location" label="来源地区" width="120" />
                <el-table-column prop="browser" label="浏览器" width="100" />
                <el-table-column prop="device" label="设备" width="100" />
                <el-table-column prop="ip" label="IP地址" width="140" />
              </el-table>
            </div>
          </div>
        </section>

        <!-- 功能亮点 -->
        <section class="features-section">
          <h2>功能亮点</h2>
          <div class="features-grid">
            <div class="feature-item" v-for="feature in features" :key="feature.title">
              <div class="feature-icon">{{ feature.icon }}</div>
              <div class="feature-content">
                <h4>{{ feature.title }}</h4>
                <p>{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- CTA区域 -->
        <section class="cta-section">
          <div class="cta-card">
            <h2>准备好开始了吗？</h2>
            <p>注册免费账户，立即获得这些强大的数据分析功能</p>
            <div class="cta-buttons">
              <el-button type="primary" size="large" @click="$router.push('/register')">
                免费注册
              </el-button>
              <el-button size="large" @click="$router.push('/docs')">
                查看文档
              </el-button>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'

// 响应式数据
const timeRange = ref('7d')

// 图表引用
const trendsChartRef = ref()
const geoChartRef = ref()
const browserChartRef = ref()
const deviceChartRef = ref()
const pagesChartRef = ref()

// 演示统计数据
const demoStats = ref([
  {
    key: 'pv',
    icon: '👁️',
    label: '总页面浏览量',
    value: '2,580,436',
    change: '+12.5%',
    trend: 'up',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    key: 'uv',
    icon: '👥',
    label: '独立访客数',
    value: '458,923',
    change: '+8.3%',
    trend: 'up',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    key: 'today',
    icon: '📊',
    label: '今日访问量',
    value: '8,642',
    change: '+15.2%',
    trend: 'up',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    key: 'bounce',
    icon: '⚡',
    label: '平均跳出率',
    value: '35.2%',
    change: '-2.1%',
    trend: 'down',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  }
])

// 实时访问数据
const realtimeData = ref([
  {
    time: '14:23:45',
    page: '/',
    location: '北京',
    browser: 'Chrome',
    device: '桌面',
    ip: '192.168.1.***'
  },
  {
    time: '14:23:32',
    page: '/blog/vue3-tutorial',
    location: '上海',
    browser: 'Safari',
    device: '移动',
    ip: '10.0.0.***'
  },
  {
    time: '14:23:18',
    page: '/products',
    location: '广州',
    browser: 'Firefox',
    device: '桌面',
    ip: '172.16.0.***'
  },
  {
    time: '14:22:56',
    page: '/about',
    location: '深圳',
    browser: 'Edge',
    device: '平板',
    ip: '192.168.2.***'
  },
  {
    time: '14:22:41',
    page: '/contact',
    location: '杭州',
    browser: 'Chrome',
    device: '移动',
    ip: '10.1.1.***'
  }
])

// 功能特性
const features = [
  {
    icon: '🚀',
    title: '实时数据监控',
    description: '实时追踪网站访问情况，第一时间了解流量变化'
  },
  {
    icon: '📊',
    title: '详细数据分析',
    description: '多维度数据分析，深入了解用户行为和访问模式'
  },
  {
    icon: '🌍',
    title: '地理位置统计',
    description: '精确的地理位置统计，了解访客分布情况'
  },
  {
    icon: '🔒',
    title: '隐私安全保护',
    description: '严格的数据加密和隐私保护，确保数据安全'
  }
]

// 初始化图表
const initCharts = () => {
  // 访问趋势图
  if (trendsChartRef.value) {
    const trendsChart = echarts.init(trendsChartRef.value)
    trendsChart.setOption({
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'transparent',
        textStyle: { color: '#fff' }
      },
      legend: {
        data: ['页面浏览量', '独立访客']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisLine: { lineStyle: { color: '#e0e0e0' } }
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#e0e0e0' } },
        splitLine: { lineStyle: { color: '#f0f0f0' } }
      },
      series: [
        {
          name: '页面浏览量',
          type: 'line',
          data: [1200, 1320, 1010, 1340, 1290, 1330, 1420],
          smooth: true,
          itemStyle: { color: '#667eea' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(102, 126, 234, 0.3)' },
                { offset: 1, color: 'rgba(102, 126, 234, 0.1)' }
              ]
            }
          }
        },
        {
          name: '独立访客',
          type: 'line',
          data: [220, 232, 201, 234, 290, 330, 310],
          smooth: true,
          itemStyle: { color: '#764ba2' }
        }
      ]
    })
  }

  // 地域分布图
  if (geoChartRef.value) {
    const geoChart = echarts.init(geoChartRef.value)
    geoChart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      series: [
        {
          name: '访客来源',
          type: 'pie',
          radius: ['50%', '80%'],
          data: [
            { value: 1048, name: '北京' },
            { value: 735, name: '上海' },
            { value: 580, name: '广东' },
            { value: 484, name: '浙江' },
            { value: 300, name: '其他地区' }
          ],
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: '{b}: {d}%'
          }
        }
      ]
    })
  }

  // 浏览器统计图
  if (browserChartRef.value) {
    const browserChart = echarts.init(browserChartRef.value)
    browserChart.setOption({
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          type: 'pie',
          radius: '80%',
          data: [
            { value: 40, name: 'Chrome' },
            { value: 25, name: 'Safari' },
            { value: 15, name: 'Firefox' },
            { value: 10, name: 'Edge' },
            { value: 10, name: '其他' }
          ],
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2
          }
        }
      ]
    })
  }

  // 设备统计图
  if (deviceChartRef.value) {
    const deviceChart = echarts.init(deviceChartRef.value)
    deviceChart.setOption({
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          type: 'pie',
          radius: '80%',
          data: [
            { value: 60, name: '桌面设备' },
            { value: 35, name: '移动设备' },
            { value: 5, name: '平板设备' }
          ],
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2
          }
        }
      ]
    })
  }

  // 热门页面图
  if (pagesChartRef.value) {
    const pagesChart = echarts.init(pagesChartRef.value)
    pagesChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#e0e0e0' } }
      },
      yAxis: {
        type: 'category',
        data: ['/', '/blog', '/products', '/about', '/contact'],
        axisLine: { lineStyle: { color: '#e0e0e0' } }
      },
      series: [
        {
          type: 'bar',
          data: [1200, 800, 600, 400, 200],
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0, color: '#667eea' },
                { offset: 1, color: '#764ba2' }
              ]
            },
            borderRadius: [0, 4, 4, 0]
          }
        }
      ]
    })
  }
}

// 模拟实时数据更新
const updateRealtimeData = () => {
  const locations = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉']
  const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge']
  const devices = ['桌面', '移动', '平板']
  const pages = ['/', '/blog', '/products', '/about', '/contact']
  
  setInterval(() => {
    const now = new Date()
    const timeString = now.toTimeString().slice(0, 8)
    
    const newRecord = {
      time: timeString,
      page: pages[Math.floor(Math.random() * pages.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      device: devices[Math.floor(Math.random() * devices.length)],
      ip: `192.168.${Math.floor(Math.random() * 255)}.***`
    }
    
    realtimeData.value.unshift(newRecord)
    if (realtimeData.value.length > 10) {
      realtimeData.value.pop()
    }
  }, 3000)
}

onMounted(async () => {
  await nextTick()
  initCharts()
  updateRealtimeData()
  
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    echarts.getInstanceByDom(trendsChartRef.value)?.resize()
    echarts.getInstanceByDom(geoChartRef.value)?.resize()
    echarts.getInstanceByDom(browserChartRef.value)?.resize()
    echarts.getInstanceByDom(deviceChartRef.value)?.resize()
    echarts.getInstanceByDom(pagesChartRef.value)?.resize()
  })
})
</script>

<style lang="scss" scoped>
.preview-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

// 导航栏样式
.navbar {
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
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
  a {
    text-decoration: none;
    color: inherit;
  }
  
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
.preview-main {
  padding: 80px 0 60px;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.preview-header {
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

// 概览统计样式
.overview-section {
  margin-bottom: 60px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.stat-item {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 32px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
  }
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 1rem;
  color: $text-secondary;
  margin-bottom: 8px;
}

.stat-trend {
  font-size: 0.875rem;
  color: $success-color;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &.down {
    color: $danger-color;
  }
}

// 图表区域样式
.charts-section {
  margin-bottom: 60px;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}

.chart-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  grid-column: span 6;
  
  &.large {
    grid-column: span 12;
  }
}

.chart-header {
  padding: 24px 32px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: $text-primary;
    margin: 0;
  }
}

.chart-body {
  padding: 20px;
}

.chart-canvas {
  width: 100%;
  height: 320px;
}

// 实时数据样式
.realtime-section {
  margin-bottom: 60px;
}

.realtime-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.realtime-header {
  padding: 24px 32px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: $text-primary;
    margin: 0;
  }
}

.realtime-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: $success-color;
  
  .indicator-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: $success-color;
    animation: pulse 2s infinite;
  }
}

// 功能特性样式
.features-section {
  margin-bottom: 60px;
  color: white;
  text-align: center;
  
  h2 {
    font-size: 2.5rem;
    font-weight: 600;
    margin-bottom: 40px;
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}

.feature-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 32px;
  text-align: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
  }
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.feature-content {
  h4 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 12px;
    color: white;
  }
  
  p {
    opacity: 0.9;
    line-height: 1.6;
    margin: 0;
  }
}

// CTA区域样式
.cta-section {
  text-align: center;
}

.cta-card {
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
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
}

// 响应式设计
@media (max-width: 1200px) {
  .charts-container {
    grid-template-columns: 1fr;
  }
  
  .chart-card {
    grid-column: span 1;
    
    &.large {
      grid-column: span 1;
    }
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }
  
  .nav-container {
    padding: 0 16px;
  }
  
  .preview-header {
    h1 {
      font-size: 2rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
  
  .stat-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-item {
    padding: 24px;
  }
  
  .chart-header,
  .realtime-header {
    padding: 20px 24px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .cta-card {
    padding: 40px 24px;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
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
</style>