<template>
  <div class="docs-page">
    <!-- 导航栏 -->
    <nav class="docs-navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-brand">
          <h2>🛸 飞天蒜子统计</h2>
        </router-link>
        <div class="nav-links">
          <el-button text @click="$router.push('/')">返回首页</el-button>
          <el-button text @click="$router.push('/preview')">数据预览</el-button>
          <el-button type="primary" @click="$router.push('/login')">登录</el-button>
        </div>
      </div>
    </nav>

    <div class="docs-container">
      <!-- 侧边栏目录 -->
      <aside class="docs-sidebar">
        <div class="sidebar-content">
          <h3>📚 文档目录</h3>
          <ul class="docs-menu">
            <li v-for="section in docSections" :key="section.id">
              <a 
                :href="`#${section.id}`" 
                :class="{ active: activeSection === section.id }"
                @click="scrollToSection(section.id)"
              >
                {{ section.title }}
              </a>
              <ul v-if="section.subsections" class="submenu">
                <li v-for="sub in section.subsections" :key="sub.id">
                  <a 
                    :href="`#${sub.id}`"
                    @click="scrollToSection(sub.id)"
                  >
                    {{ sub.title }}
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </aside>

      <!-- 主要内容 -->
      <main class="docs-main">
        <div class="docs-content">
          <!-- 快速开始 -->
          <section id="quick-start" class="docs-section">
            <h1>🚀 快速开始</h1>
            <p>飞天蒜子统计是一个免费、快速、易用的网站访问统计服务，完全兼容不蒜子的使用方式。</p>
            
            <div class="code-block">
              <div class="code-header">
                <span>HTML</span>
                <el-button size="small" @click="copyCode(quickStartCode)">复制</el-button>
              </div>
              <pre><code>{{ quickStartCode }}</code></pre>
            </div>
            
            <div class="note-box success">
              <strong>提示：</strong>将上述代码复制到您的网页中，即可开始使用飞天蒜子统计服务！
            </div>
          </section>

          <!-- 兼容性说明 -->
          <section id="compatibility" class="docs-section">
            <h2>🔄 兼容性说明</h2>
            <p>飞天蒜子统计完全兼容不蒜子的使用方式，您可以无缝迁移：</p>
            
            <h3>不蒜子迁移</h3>
            <p>只需要将不蒜子的脚本地址替换为飞天蒜子的地址：</p>
            
            <div class="comparison">
              <div class="before">
                <h4>不蒜子（原来）</h4>
                <div class="code-block">
                  <pre><code>&lt;script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"&gt;&lt;/script&gt;</code></pre>
                </div>
              </div>
              <div class="arrow">➡️</div>
              <div class="after">
                <h4>飞天蒜子（现在）</h4>
                <div class="code-block">
                  <pre><code>&lt;script async src="//api.flyteam.cloud/busuanzi/2.3/busuanzi.pure.mini.js"&gt;&lt;/script&gt;</code></pre>
                </div>
              </div>
            </div>
          </section>

          <!-- 统计标签 -->
          <section id="tags" class="docs-section">
            <h2>🏷️ 统计标签</h2>
            <p>支持多种统计标签，满足不同的展示需求：</p>
            
            <div class="tag-examples">
              <div class="tag-example" v-for="tag in tagExamples" :key="tag.id">
                <h4>{{ tag.title }}</h4>
                <p>{{ tag.description }}</p>
                <div class="code-block">
                  <div class="code-header">
                    <span>HTML</span>
                    <el-button size="small" @click="copyCode(tag.code)">复制</el-button>
                  </div>
                  <pre><code>{{ tag.code }}</code></pre>
                </div>
                <div class="preview">
                  <strong>预览效果：</strong>
                  <span v-html="tag.preview"></span>
                </div>
              </div>
            </div>
          </section>

          <!-- 高级功能 -->
          <section id="advanced" class="docs-section">
            <h2>⚡ 高级功能</h2>
            
            <h3 id="like-feature">点赞功能</h3>
            <p>飞天蒜子统计提供简单易用的点赞功能，让访客为优质内容点赞：</p>
            
            <div class="code-block">
              <div class="code-header">
                <span>HTML</span>
                <el-button size="small" @click="copyCode(likeFeatureCode)">复制</el-button>
              </div>
              <pre><code>{{ likeFeatureCode }}</code></pre>
            </div>
            
            <h3 id="custom-styles">自定义样式</h3>
            <p>您可以通过CSS自定义统计数据的显示样式：</p>
            
            <div class="code-block">
              <div class="code-header">
                <span>CSS</span>
                <el-button size="small" @click="copyCode(customStyleCode)">复制</el-button>
              </div>
              <pre><code>{{ customStyleCode }}</code></pre>
            </div>
          </section>

          <!-- API文档 -->
          <section id="api" class="docs-section">
            <h2>🔗 API 文档</h2>
            <p>飞天蒜子统计提供RESTful API，支持程序化访问统计数据：</p>
            
            <div class="api-endpoint" v-for="endpoint in apiEndpoints" :key="endpoint.method + endpoint.path">
              <div class="endpoint-header">
                <span class="method" :class="endpoint.method.toLowerCase()">{{ endpoint.method }}</span>
                <span class="path">{{ endpoint.path }}</span>
              </div>
              <p>{{ endpoint.description }}</p>
              
              <div v-if="endpoint.example" class="code-block">
                <div class="code-header">
                  <span>示例请求</span>
                  <el-button size="small" @click="copyCode(endpoint.example)">复制</el-button>
                </div>
                <pre><code>{{ endpoint.example }}</code></pre>
              </div>
            </div>
          </section>

          <!-- 常见问题 -->
          <section id="faq" class="docs-section">
            <h2>❓ 常见问题</h2>
            
            <div class="faq-list">
              <div class="faq-item" v-for="faq in faqList" :key="faq.id">
                <h4>{{ faq.question }}</h4>
                <div class="faq-answer" v-html="faq.answer"></div>
              </div>
            </div>
          </section>

          <!-- 支持与反馈 -->
          <section id="support" class="docs-section">
            <h2>💬 支持与反馈</h2>
            <p>如果您在使用过程中遇到问题或有任何建议，欢迎通过以下方式联系我们：</p>
            
            <div class="contact-grid">
              <div class="contact-item">
                <h4>📧 邮件支持</h4>
                <p>发送邮件至：<a href="mailto:support@flyteam.cloud">support@flyteam.cloud</a></p>
              </div>
              <div class="contact-item">
                <h4>💬 在线交流</h4>
                <p>加入我们的QQ群：123456789</p>
              </div>
              <div class="contact-item">
                <h4>🐛 问题反馈</h4>
                <p>在GitHub上提交Issue：<a href="https://github.com/flyteam/issues" target="_blank">Issues</a></p>
              </div>
              <div class="contact-item">
                <h4>📝 功能建议</h4>
                <p>欢迎提出您的宝贵建议，帮助我们持续改进</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const activeSection = ref('quick-start')

// 文档目录
const docSections = [
  { id: 'quick-start', title: '快速开始' },
  { id: 'compatibility', title: '兼容性说明' },
  { 
    id: 'tags', 
    title: '统计标签',
    subsections: [
      { id: 'basic-tags', title: '基础标签' },
      { id: 'advanced-tags', title: '高级标签' }
    ]
  },
  { 
    id: 'advanced', 
    title: '高级功能',
    subsections: [
      { id: 'like-feature', title: '点赞功能' },
      { id: 'custom-styles', title: '自定义样式' }
    ]
  },
  { id: 'api', title: 'API 文档' },
  { id: 'faq', title: '常见问题' },
  { id: 'support', title: '支持与反馈' }
]

// 代码示例
const quickStartCode = `<!-- 引入统计脚本 -->
<script async src="//api.flyteam.cloud/busuanzi/2.3/busuanzi.pure.mini.js"></script>

<!-- 显示统计数据 -->
<span id="busuanzi_container_site_pv">
  本站总访问量<span id="busuanzi_value_site_pv"></span>次
</span>
<span id="busuanzi_container_site_uv">
  本站总访客数<span id="busuanzi_value_site_uv"></span>人
</span>`

const likeFeatureCode = `<!-- 引入点赞脚本 -->
<script async src="//api.flyteam.cloud/api/like/script.js"></script>

<!-- 点赞按钮 -->
<button class="flyteam-like-btn">♡ 0</button>

<!-- 显示点赞数量 -->
<span id="flyteam_like_count">0</span>`

const customStyleCode = `.busuanzi_value {
  color: #667eea;
  font-weight: bold;
  font-size: 1.2em;
}

#busuanzi_container_site_pv {
  padding: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  display: inline-block;
  margin: 5px;
}`

// 标签示例
const tagExamples = [
  {
    id: 'site-pv',
    title: '网站总访问量',
    description: '显示网站从开始统计到现在的总页面浏览量',
    code: `<span id="busuanzi_container_site_pv">
  本站总访问量<span id="busuanzi_value_site_pv"></span>次
</span>`,
    preview: '本站总访问量<strong>128,543</strong>次'
  },
  {
    id: 'site-uv',
    title: '网站总访客数',
    description: '显示网站从开始统计到现在的独立访客总数',
    code: `<span id="busuanzi_container_site_uv">
  本站总访客数<span id="busuanzi_value_site_uv"></span>人
</span>`,
    preview: '本站总访客数<strong>25,687</strong>人'
  },
  {
    id: 'page-pv',
    title: '当前页面访问量',
    description: '显示当前页面的访问次数',
    code: `<span id="busuanzi_container_page_pv">
  本页面访问量<span id="busuanzi_value_page_pv"></span>次
</span>`,
    preview: '本页面访问量<strong>1,256</strong>次'
  }
]

// API端点
const apiEndpoints = [
  {
    method: 'GET',
    path: '/api/stats/:domain',
    description: '获取指定域名的统计数据',
    example: `curl -X GET "https://api.flyteam.cloud/api/stats/example.com"

# 响应示例
{
  "success": true,
  "data": {
    "pv": 128543,
    "uv": 25687,
    "todayPv": 1256,
    "todayUv": 234
  }
}`
  },
  {
    method: 'POST',
    path: '/api/stats/record',
    description: '记录一次访问',
    example: `curl -X POST "https://api.flyteam.cloud/api/stats/record" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com/page",
    "title": "页面标题",
    "referrer": "https://google.com"
  }'`
  }
]

// 常见问题
const faqList = [
  {
    id: 'how-to-start',
    question: '如何开始使用飞天蒜子统计？',
    answer: '只需要在您的网页中添加一行JavaScript代码即可开始使用，无需注册账户。'
  },
  {
    id: 'difference-busuanzi',
    question: '与不蒜子有什么区别？',
    answer: '飞天蒜子统计在完全兼容不蒜子的基础上，提供了更详细的数据分析、更快的响应速度和更稳定的服务。'
  },
  {
    id: 'data-accuracy',
    question: '统计数据是否准确？',
    answer: '我们使用多重防刷机制确保数据准确性，包括IP限制、时间间隔控制等。'
  },
  {
    id: 'privacy-protection',
    question: '如何保护用户隐私？',
    answer: '我们不收集任何个人身份信息，所有IP地址都经过哈希处理，完全匿名化。'
  },
  {
    id: 'service-stability',
    question: '服务稳定性如何？',
    answer: '我们使用云服务部署，支持自动扩容，确保99.9%的服务可用性。'
  }
]

// 方法
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    activeSection.value = sectionId
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

// 监听滚动，更新当前活跃的章节
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      })
    },
    { threshold: 0.5 }
  )

  docSections.forEach((section) => {
    const element = document.getElementById(section.id)
    if (element) {
      observer.observe(element)
    }
  })
})
</script>

<style lang="scss" scoped>
.docs-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

// 导航栏样式
.docs-navbar {
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

// 文档容器样式
.docs-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 40px;
  align-items: flex-start;
}

// 侧边栏样式
.docs-sidebar {
  position: sticky;
  top: 104px;
}

.sidebar-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 20px;
  }
}

.docs-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    margin-bottom: 8px;
    
    a {
      display: block;
      padding: 8px 12px;
      color: $text-secondary;
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.3s ease;
      font-size: 0.9rem;
      
      &:hover {
        background: rgba(102, 126, 234, 0.1);
        color: $primary-color;
      }
      
      &.active {
        background: $primary-color;
        color: white;
      }
    }
  }
  
  .submenu {
    margin-left: 16px;
    margin-top: 8px;
    
    li a {
      font-size: 0.85rem;
      color: $text-placeholder;
    }
  }
}

// 主要内容样式
.docs-main {
  min-height: calc(100vh - 200px);
}

.docs-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.docs-section {
  margin-bottom: 60px;
  
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: $text-primary;
    margin-bottom: 16px;
  }
  
  h2 {
    font-size: 2rem;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 16px;
    padding-top: 20px;
    border-top: 1px solid #e9ecef;
    
    &:first-child {
      border-top: none;
      padding-top: 0;
    }
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 12px;
    margin-top: 32px;
  }
  
  h4 {
    font-size: 1.25rem;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 8px;
  }
  
  p {
    line-height: 1.7;
    color: $text-regular;
    margin-bottom: 16px;
  }
}

// 代码块样式
.code-block {
  background: #282c34;
  border-radius: 12px;
  overflow: hidden;
  margin: 20px 0;
  
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

// 提示框样式
.note-box {
  padding: 16px 20px;
  border-radius: 8px;
  margin: 20px 0;
  border-left: 4px solid;
  
  &.success {
    background: rgba(103, 194, 58, 0.1);
    border-color: #67c23a;
    color: #67c23a;
  }
  
  strong {
    font-weight: 600;
  }
}

// 对比样式
.comparison {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  align-items: center;
  margin: 30px 0;
  
  .before, .after {
    h4 {
      color: $text-secondary;
      margin-bottom: 12px;
    }
  }
  
  .arrow {
    font-size: 1.5rem;
    text-align: center;
  }
}

// 标签示例样式
.tag-examples {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.tag-example {
  .preview {
    background: #f8f9fa;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #e9ecef;
    margin-top: 16px;
    
    strong {
      color: $text-primary;
      margin-right: 8px;
    }
  }
}

// API端点样式
.api-endpoint {
  margin-bottom: 40px;
  
  .endpoint-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    
    .method {
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      
      &.get {
        background: #67c23a;
        color: white;
      }
      
      &.post {
        background: #409eff;
        color: white;
      }
    }
    
    .path {
      font-family: 'Monaco', 'Consolas', monospace;
      font-weight: 500;
      color: $text-primary;
    }
  }
}

// FAQ样式
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.faq-item {
  h4 {
    color: $primary-color;
    margin-bottom: 8px;
  }
  
  .faq-answer {
    color: $text-regular;
    line-height: 1.6;
  }
}

// 联系方式样式
.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.contact-item {
  background: rgba(102, 126, 234, 0.05);
  padding: 24px;
  border-radius: 12px;
  
  h4 {
    color: $primary-color;
    margin-bottom: 8px;
  }
  
  p {
    margin: 0;
    
    a {
      color: $primary-color;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .docs-container {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .docs-sidebar {
    position: static;
    order: -1;
  }
  
  .sidebar-content {
    .docs-menu {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      
      li {
        margin-bottom: 0;
        
        a {
          white-space: nowrap;
        }
      }
      
      .submenu {
        display: none;
      }
    }
  }
}

@media (max-width: 768px) {
  .docs-container {
    padding: 20px 16px;
  }
  
  .nav-container {
    padding: 0 16px;
  }
  
  .docs-content {
    padding: 24px 20px;
  }
  
  .comparison {
    grid-template-columns: 1fr;
    gap: 16px;
    
    .arrow {
      transform: rotate(90deg);
    }
  }
  
  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>