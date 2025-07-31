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
          <h2>创建新账户</h2>
          <p>注册免费账户，获得完整的数据分析功能</p>
        </div>

        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          class="auth-form"
          @submit.prevent="handleRegister"
        >
          <el-form-item prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="用户名"
              size="large"
              prefix-icon="User"
              clearable
            />
          </el-form-item>

          <el-form-item prop="email">
            <el-input
              v-model="registerForm.email"
              placeholder="邮箱地址"
              size="large"
              prefix-icon="Message"
              clearable
            />
          </el-form-item>

          <el-form-item prop="domain">
            <el-input
              v-model="registerForm.domain"
              placeholder="网站域名 (例如: example.com)"
              size="large"
              prefix-icon="Globe"
              clearable
            />
            <div class="form-tip">
              请输入您的网站域名，用于统计数据隔离
            </div>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="密码"
              size="large"
              prefix-icon="Lock"
              show-password
              clearable
            />
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="确认密码"
              size="large"
              prefix-icon="Lock"
              show-password
              clearable
              @keyup.enter="handleRegister"
            />
          </el-form-item>

          <el-form-item prop="agreement">
            <el-checkbox v-model="registerForm.agreement">
              我同意
              <el-link type="primary" :underline="false">《服务条款》</el-link>
              和
              <el-link type="primary" :underline="false">《隐私政策》</el-link>
            </el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="isLoading"
              @click="handleRegister"
              class="auth-submit-btn"
            >
              {{ isLoading ? '注册中...' : '立即注册' }}
            </el-button>
          </el-form-item>
        </el-form>

        <div class="auth-footer">
          <p>
            已有账户？
            <router-link to="/login" class="auth-link">立即登录</router-link>
          </p>
        </div>
      </div>

      <!-- 优势展示 -->
      <div class="benefits-sidebar">
        <h3>注册后您将获得</h3>
        <div class="benefit-list">
          <div class="benefit-item" v-for="benefit in benefits" :key="benefit.title">
            <div class="benefit-icon">{{ benefit.icon }}</div>
            <div class="benefit-content">
              <h4>{{ benefit.title }}</h4>
              <p>{{ benefit.description }}</p>
            </div>
          </div>
        </div>

        <!-- 用户评价 -->
        <div class="testimonial">
          <blockquote>
            "飞天蒜子统计让我对网站访问情况有了更深入的了解，数据展示很直观，使用非常方便！"
          </blockquote>
          <cite>- 某科技博客站长</cite>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 响应式数据
const registerFormRef = ref()
const isLoading = ref(false)

const registerForm = reactive({
  username: '',
  email: '',
  domain: '',
  password: '',
  confirmPassword: '',
  agreement: false
})

// 自定义验证函数
const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请确认密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const validateDomain = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入网站域名'))
  } else if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value)) {
    callback(new Error('请输入有效的域名格式 (例如: example.com)'))
  } else {
    callback()
  }
}

const validateAgreement = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请同意服务条款和隐私政策'))
  } else {
    callback()
  }
}

// 表单验证规则
const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' },
    { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/, message: '用户名可以包含中文、字母、数字和下划线', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  domain: [
    { required: true, validator: validateDomain, trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6个字符', trigger: 'blur' },
    { pattern: /^(?=.*[a-zA-Z])(?=.*\d)/, message: '密码必须包含字母和数字', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ],
  agreement: [
    { required: true, validator: validateAgreement, trigger: 'change' }
  ]
}

// 注册优势
const benefits = [
  {
    icon: '📈',
    title: '详细数据报告',
    description: '获得包含访客来源、设备信息、地理分布等详细数据分析报告'
  },
  {
    icon: '⚡',
    title: '实时数据监控',
    description: '实时查看网站访问情况，及时了解流量变化趋势'
  },
  {
    icon: '🔧',
    title: '自定义配置',
    description: '灵活配置统计参数，自定义数据展示样式和格式'
  },
  {
    icon: '🚀',
    title: '高级功能',
    description: '访问点赞系统、访客行为分析、数据导出等高级功能'
  },
  {
    icon: '📱',
    title: '移动端支持',
    description: '完美支持移动设备，随时随地查看网站统计数据'
  },
  {
    icon: '🛡️',
    title: '数据安全',
    description: '银行级数据加密，严格的隐私保护，确保数据安全可靠'
  }
]

// 方法
const handleRegister = async () => {
  if (!registerFormRef.value) return

  try {
    await registerFormRef.value.validate()
    isLoading.value = true

    await userStore.register({
      username: registerForm.username,
      email: registerForm.email,
      domain: registerForm.domain,
      password: registerForm.password
    })

    ElMessage.success('注册成功，欢迎使用飞天蒜子统计！')
    router.push('/dashboard')

  } catch (error) {
    ElMessage.error(error.response?.data?.message || '注册失败，请重试')
  } finally {
    isLoading.value = false
  }
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
  align-items: flex-start;
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

  .el-checkbox {
    line-height: 1.5;
    
    :deep(.el-checkbox__label) {
      line-height: 1.5;
    }
  }
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

.benefits-sidebar {
  color: white;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 30px;
    font-weight: 600;
  }

  .benefit-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-bottom: 40px;
  }

  .benefit-item {
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }

  .benefit-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .benefit-content {
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

.testimonial {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  border-left: 4px solid rgba(255, 255, 255, 0.3);

  blockquote {
    font-style: italic;
    margin: 0 0 16px 0;
    line-height: 1.6;
    font-size: 0.9rem;
  }

  cite {
    font-size: 0.8rem;
    opacity: 0.8;
    font-style: normal;
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

  .benefits-sidebar {
    order: -1;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 24px;

    h3 {
      font-size: 1.25rem;
      margin-bottom: 20px;
    }

    .benefit-list {
      gap: 20px;
      margin-bottom: 30px;
    }

    .benefit-item {
      gap: 12px;
    }

    .benefit-icon {
      font-size: 1.25rem;
    }

    .benefit-content {
      h4 {
        font-size: 0.9rem;
      }

      p {
        font-size: 0.8rem;
      }
    }
  }

  .testimonial {
    padding: 20px;

    blockquote {
      font-size: 0.85rem;
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

.benefits-sidebar {
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

.form-tip {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 4px;
  line-height: 1.4;
}
</style>