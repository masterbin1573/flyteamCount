<template>
  <div class="dashboard-page">
    <!-- 顶部导航栏 -->
    <header class="dashboard-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="dashboard-title">🛸 飞天蒜子统计</h1>
          <span class="welcome-text">欢迎回来，{{ userStore.user?.username }}</span>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <el-button circle>
              <el-icon><User /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人资料</el-dropdown-item>
                <el-dropdown-item command="settings">设置</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="dashboard-main">
      <div class="dashboard-container">
        <!-- 概览统计卡片 -->
        <section class="overview-section">
          <div class="stat-cards">
            <div class="stat-card" v-for="stat in overviewStats" :key="stat.key">
              <div class="stat-icon" :style="{ backgroundColor: stat.color }">
                {{ stat.icon }}
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ formatNumber(stat.value) }}</div>
                <div class="stat-label">{{ stat.label }}</div>
                <div class="stat-change" :class="stat.changeType">
                  <el-icon v-if="stat.changeType === 'increase'"><TrendCharts /></el-icon>
                  <el-icon v-else><Bottom /></el-icon>
                  {{ stat.change }}
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 图表区域 -->
        <section class="charts-section">
          <div class="chart-grid">
            <!-- 访问趋势图 -->
            <div class="chart-card">
              <div class="chart-header">
                <h3>访问趋势</h3>
                <el-select v-model="trendsTimeRange" size="small" style="width: 120px">
                  <el-option label="7天" value="7d" />
                  <el-option label="30天" value="30d" />
                  <el-option label="90天" value="90d" />
                </el-select>
              </div>
              <div class="chart-content">
                <div ref="trendsChartRef" class="echarts-container"></div>
              </div>
            </div>

            <!-- 地域分布 -->
            <div class="chart-card">
              <div class="chart-header">
                <h3>地域分布</h3>
                <el-button size="small" text>查看详情</el-button>
              </div>
              <div class="chart-content">
                <div ref="geoChartRef" class="echarts-container"></div>
              </div>
            </div>

            <!-- 浏览器统计 -->
            <div class="chart-card">
              <div class="chart-header">
                <h3>浏览器分布</h3>
              </div>
              <div class="chart-content">
                <div ref="browserChartRef" class="echarts-container"></div>
              </div>
            </div>

            <!-- 设备类型 -->
            <div class="chart-card">
              <div class="chart-header">
                <h3>设备类型</h3>
              </div>
              <div class="chart-content">
                <div ref="deviceChartRef" class="echarts-container"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- 数据表格 -->
        <section class="table-section">
          <div class="table-card">
            <div class="table-header">
              <h3>最近访问记录</h3>
              <div class="table-actions">
                <el-input
                  v-model="searchKeyword"
                  placeholder="搜索..."
                  size="small"
                  style="width: 200px"
                  clearable
                >
                  <template #prefix>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-input>
                <el-button size="small" @click="exportData">导出数据</el-button>
              </div>
            </div>
            <div class="table-content">
              <el-table :data="filteredVisitData" v-loading="isLoading" stripe>
                <el-table-column prop="page" label="页面路径" min-width="200" />
                <el-table-column prop="visitors" label="访客数" width="100" align="center" />
                <el-table-column prop="views" label="浏览量" width="100" align="center" />
                <el-table-column prop="avgTime" label="平均停留" width="120" align="center" />
                <el-table-column prop="bounceRate" label="跳出率" width="100" align="center" />
                <el-table-column label="操作" width="120" align="center">
                  <template #default="{ row }">
                    <el-button size="small" text @click="viewDetail(row)">详情</el-button>
                    <el-button size="small" text type="primary" @click="analyze(row)">分析</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import * as echarts from 'echarts'

const router = useRouter()
const userStore = useUserStore()

// 响应式数据
const isLoading = ref(false)
const trendsTimeRange = ref('7d')
const searchKeyword = ref('')

// 图表引用
const trendsChartRef = ref()
const geoChartRef = ref()
const browserChartRef = ref()
const deviceChartRef = ref()

// 图表实例
let trendsChart = null
let geoChart = null
let browserChart = null
let deviceChart = null

// 概览统计数据
const overviewStats = ref([
  {
    key: 'totalViews',
    icon: '👁️',
    label: '总浏览量',
    value: 128543,
    change: '+12.5%',
    changeType: 'increase',
    color: '#667eea'
  },
  {
    key: 'totalVisitors',
    icon: '👥',
    label: '总访客数',
    value: 25687,
    change: '+8.3%',
    changeType: 'increase',
    color: '#764ba2'
  },
  {
    key: 'todayViews',
    icon: '📊',
    label: '今日浏览量',
    value: 1256,
    change: '+15.2%',
    changeType: 'increase',
    color: '#f093fb'
  },
  {
    key: 'avgTime',
    icon: '⏱️',
    label: '平均停留时间',
    value: 180,
    change: '-2.1%',
    changeType: 'decrease',
    color: '#4facfe'
  }
])

// 访问记录数据
const visitData = ref([
  {
    page: '/',
    visitors: 1256,
    views: 2134,
    avgTime: '2分34秒',
    bounceRate: '45.2%'
  },
  {
    page: '/blog',
    visitors: 834,
    views: 1456,
    avgTime: '3分12秒',
    bounceRate: '38.7%'
  },
  {
    page: '/about',
    visitors: 567,
    views: 789,
    avgTime: '1分45秒',
    bounceRate: '62.1%'
  },
  {
    page: '/contact',
    visitors: 345,
    views: 456,
    avgTime: '1分23秒',
    bounceRate: '58.9%'
  },
  {
    page: '/products',
    visitors: 123,
    views: 234,
    avgTime: '4分56秒',
    bounceRate: '25.3%'
  }
])

// 计算属性
const filteredVisitData = computed(() => {
  if (!searchKeyword.value) return visitData.value
  return visitData.value.filter(item =>
    item.page.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

// 方法
const formatNumber = (num) => {
  if (typeof num === 'string') return num
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const handleCommand = async (command) => {
  switch (command) {
    case 'profile':
      ElMessage.info('个人资料功能开发中...')
      break
    case 'settings':
      ElMessage.info('设置功能开发中...')
      break
    case 'logout':
      try {
        await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        userStore.logout()
        ElMessage.success('已退出登录')
        router.push('/')
      } catch {
        // 用户取消
      }
      break
  }
}

const exportData = () => {
  ElMessage.success('数据导出功能开发中...')
}

const viewDetail = (row) => {
  ElMessage.info(`查看页面 ${row.page} 的详细信息`)
}

const analyze = (row) => {
  ElMessage.info(`分析页面 ${row.page} 的数据`)
}

// 初始化访问趋势图
const initTrendsChart = () => {
  if (!trendsChartRef.value) return

  trendsChart = echarts.init(trendsChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['浏览量', '访客数']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '浏览量',
        type: 'line',
        data: [1200, 1320, 1010, 1340, 1290, 1330, 1320],
        smooth: true,
        itemStyle: {
          color: '#667eea'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(102, 126, 234, 0.3)' },
              { offset: 1, color: 'rgba(102, 126, 234, 0.1)' }
            ]
          }
        }
      },
      {
        name: '访客数',
        type: 'line',
        data: [220, 232, 201, 234, 290, 330, 310],
        smooth: true,
        itemStyle: {
          color: '#764ba2'
        }
      }
    ]
  }
  
  trendsChart.setOption(option)
}

// 初始化地域分布图
const initGeoChart = () => {
  if (!geoChartRef.value) return

  geoChart = echarts.init(geoChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: '北京' },
          { value: 735, name: '上海' },
          { value: 580, name: '广东' },
          { value: 484, name: '浙江' },
          { value: 300, name: '其他' }
        ]
      }
    ]
  }
  
  geoChart.setOption(option)
}

// 初始化浏览器分布图
const initBrowserChart = () => {
  if (!browserChartRef.value) return

  browserChart = echarts.init(browserChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        radius: '70%',
        data: [
          { value: 40, name: 'Chrome' },
          { value: 25, name: 'Safari' },
          { value: 15, name: 'Firefox' },
          { value: 10, name: 'Edge' },
          { value: 10, name: '其他' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  
  browserChart.setOption(option)
}

// 初始化设备类型图
const initDeviceChart = () => {
  if (!deviceChartRef.value) return

  deviceChart = echarts.init(deviceChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        radius: '70%',
        data: [
          { value: 60, name: '桌面设备' },
          { value: 35, name: '移动设备' },
          { value: 5, name: '平板设备' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  
  deviceChart.setOption(option)
}

// 监听时间范围变化
watch(trendsTimeRange, () => {
  // 这里可以重新加载数据并更新图表
  ElMessage.info(`切换到${trendsTimeRange.value}数据`)
})

// 页面挂载后初始化
onMounted(async () => {
  await nextTick()
  initTrendsChart()
  initGeoChart()
  initBrowserChart()
  initDeviceChart()
  
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    trendsChart?.resize()
    geoChart?.resize()
    browserChart?.resize()
    deviceChart?.resize()
  })
})

// 页面卸载时销毁图表
onUnmounted(() => {
  trendsChart?.dispose()
  geoChart?.dispose()
  browserChart?.dispose()
  deviceChart?.dispose()
  
  window.removeEventListener('resize', () => {})
})
</script>

<style lang="scss" scoped>
.dashboard-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.dashboard-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.dashboard-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: $primary-color;
  margin: 0;
}

.welcome-text {
  color: $text-secondary;
  font-size: 0.9rem;
}

.dashboard-main {
  padding: 32px 0;
}

.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

// 概览统计样式
.overview-section {
  margin-bottom: 32px;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.9rem;
  color: $text-secondary;
  margin-bottom: 8px;
}

.stat-change {
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &.increase {
    color: $success-color;
  }
  
  &.decrease {
    color: $danger-color;
  }
}

// 图表区域样式
.charts-section {
  margin-bottom: 32px;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.chart-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chart-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: $text-primary;
    margin: 0;
  }
}

.chart-content {
  padding: 16px;
}

.echarts-container {
  width: 100%;
  height: 300px;
}

// 表格区域样式
.table-section {
  margin-bottom: 32px;
}

.table-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: $text-primary;
    margin: 0;
  }
}

.table-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.table-content {
  padding: 0;
  
  :deep(.el-table) {
    background: transparent;
    
    .el-table__header {
      background: #f8f9fa;
    }
    
    .el-table__row {
      &:hover {
        background: rgba(102, 126, 234, 0.05);
      }
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .chart-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 0 16px;
  }
  
  .header-content {
    padding: 0 16px;
  }
  
  .header-left {
    gap: 16px;
  }
  
  .dashboard-title {
    font-size: 1.25rem;
  }
  
  .welcome-text {
    display: none;
  }
  
  .stat-cards {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .stat-card {
    padding: 20px;
  }
  
  .chart-card,
  .table-card {
    margin: 0 -8px;
    border-radius: 12px;
  }
  
  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .table-actions {
    width: 100%;
    justify-content: space-between;
  }
}

// 动画效果
.stat-card {
  animation: slideInUp 0.6s ease-out;
}

.chart-card {
  animation: fadeIn 0.8s ease-out 0.2s both;
}

.table-card {
  animation: fadeIn 0.8s ease-out 0.4s both;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>