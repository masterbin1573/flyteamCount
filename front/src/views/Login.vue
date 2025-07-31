<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- 返回首页按钮 -->
      <div class="back-to-home">
        <el-button text @click="$router.push('/')">
          <el-icon><ArrowLeft /></el-icon>
          返回首页
        </el-button>
      </div>

      <div class="auth-card">
        <div class="auth-header">
          <h1>🛸 飞天蒜子统计</h1>
          <h2>登录您的账户</h2>
          <p>登录后可以查看详细的数据分析面板</p>
        </div>

        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="auth-form"
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="用户名或邮箱"
              size="large"
              prefix-icon="User"
              clearable
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
              size="large"
              prefix-icon="Lock"
              show-password
              clearable
              @keyup.enter="handleLogin"
            />
          </el-form-item>

          <el-form-item>
            <div class="form-options">
              <el-checkbox v-model="rememberMe">记住我</el-checkbox>
              <el-link type="primary" :underline="false">忘记密码？</el-link>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="isLoading"
              @click="handleLogin"
              class="auth-submit-btn"
            >
              {{ isLoading ? '登录中...' : '登录' }}
            </el-button>
          </el-form-item>
        </el-form>

        <div class="auth-footer">
          <p>
            还没有账户？
            <router-link to="/register" class="auth-link">立即注册</router-link>
          </p>
        </div>

        <!-- 演示账户 -->
        <div class="demo-account">
          <el-divider>
            <span class="demo-text">演示账户</span>
          </el-divider>
          <el-button
            text
            type="primary"
            @click="fillDemoAccount"
            class="demo-btn"
          >
            使用演示账户登录
          </el-button>
        </div>
      </div>

      <!-- 特性展示 -->
      <div class="features-sidebar">
        <h3>为什么选择飞天蒜子统计？</h3>
        <div class="feature-list">
          <div class="feature-item" v-for="feature in features" :key="feature.title">
            <div class="feature-icon">{{ feature.icon }}</div>
            <div class="feature-content">
              <h4>{{ feature.title }}</h4>
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 响应式数据
const loginFormRef = ref()
const isLoading = ref(false)
const rememberMe = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名或邮箱', trigger: 'blur' },
    { min: 3, message: '用户名至少3个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6个字符', trigger: 'blur' }
  ]
}

// 特性列表
const features = [
  {
    icon: '📊',
    title: '详细数据分析',
    description: '获得比不蒜子更详细的访问数据分析，包括地域分布、浏览器统计等'
  },
  {
    icon: '🚀',
    title: '高性能监控',
    description: '实时监控网站性能，快速发现和解决问题'
  },
  {
    icon: '🔒',
    title: '数据安全',
    description: '严格的数据加密和隐私保护，确保您的数据安全'
  },
  {
    icon: '🎨',
    title: '自定义样式',
    description: '多种显示样式可选，完美融入您的网站设计'
  }
]

// 方法
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    await loginFormRef.value.validate()
    isLoading.value = true

    await userStore.login({
      username: loginForm.username,
      password: loginForm.password
    })

    ElMessage.success('登录成功')

    // 跳转到指定页面或仪表板
    const redirectPath = route.query.redirect || '/dashboard'
    router.push(redirectPath)

  } catch (error) {
    ElMessage.error(error.response?.data?.message || '登录失败，请重试')
  } finally {
    isLoading.value = false
  }
}

const fillDemoAccount = () => {
  loginForm.username = 'demo@flyteam.cloud'
  loginForm.password = 'demo123456'
  ElMessage.info('已填入演示账户信息')
}
</script>

<style lang="scss" scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
}

.back-to-home {
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 10;
}

.auth-container {
  display: grid;
  grid-template-columns: 400px 350px;
  gap: 60px;
  align-items: center;
  max-width: 900px;
  width: 100%;
}

.auth-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;

  h1 {
    font-size: 1.75rem;
    color: $primary-color;
    margin-bottom: 8px;
    font-weight: 600;
  }

  h2 {
    font-size: 1.5rem;
    color: $text-primary;
    margin-bottom: 8px;
    font-weight: 500;
  }

  p {
    color: $text-secondary;
    margin: 0;
    font-size: 0.9rem;
  }
}

.auth-form {
  .el-form-item {
    margin-bottom: 20px;
  }

  .el-input {
    border-radius: 12px;
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.auth-submit-btn {
  width: 100%;
  height: 44px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
}

.auth-footer {
  text-align: center;
  margin-top: 24px;

  p {
    color: $text-secondary;
    margin: 0;
  }

  .auth-link {
    color: $primary-color;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
}

.demo-account {
  margin-top: 30px;
  text-align: center;

  .demo-text {
    color: $text-secondary;
    font-size: 0.875rem;
  }

  .demo-btn {
    margin-top: 12px;
    font-size: 0.875rem;
  }
}

.features-sidebar {
  color: white;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 30px;
    font-weight: 600;
  }

  .feature-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .feature-item {
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }

  .feature-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .feature-content {
    h4 {
      font-size: 1rem;
      margin-bottom: 6px;
      font-weight: 500;
    }

    p {
      font-size: 0.875rem;
      opacity: 0.8;
      line-height: 1.5;
      margin: 0;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .auth-container {
    grid-template-columns: 1fr;
    gap: 40px;
    max-width: 400px;
  }

  .auth-card {
    padding: 30px 24px;
  }

  .features-sidebar {
    order: -1;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 24px;

    h3 {
      font-size: 1.25rem;
      margin-bottom: 20px;
    }

    .feature-list {
      gap: 20px;
    }

    .feature-item {
      gap: 12px;
    }

    .feature-icon {
      font-size: 1.25rem;
    }

    .feature-content {
      h4 {
        font-size: 0.9rem;
      }

      p {
        font-size: 0.8rem;
      }
    }
  }

  .back-to-home {
    top: 16px;
    left: 16px;
  }
}

// 动画效果
.auth-card {
  animation: slideInUp 0.6s ease-out;
}

.features-sidebar {
  animation: fadeIn 0.8s ease-out 0.2s both;
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