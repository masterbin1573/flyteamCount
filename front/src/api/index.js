import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('flyteam_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.success === false) {
      ElMessage.error(data.message || '请求失败')
      return Promise.reject(new Error(data.message || '请求失败'))
    }
    return data
  },
  (error) => {
    const { response } = error
    
    if (response) {
      const { status, data } = response
      
      switch (status) {
        case 401:
          // 未授权，清除本地 token
          localStorage.removeItem('flyteam_token')
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
          break
        case 403:
          ElMessage.error('没有权限访问')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 429:
          ElMessage.error(data?.message || '请求过于频繁，请稍后再试')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error(data?.message || '网络错误')
      }
    } else {
      ElMessage.error('网络连接失败')
    }
    
    return Promise.reject(error)
  }
)

// API 接口定义
const api = {
  // 认证相关
  auth: {
    login: (data) => request.post('/auth/login', data),
    register: (data) => request.post('/auth/register', data),
    getProfile: () => request.get('/auth/profile'),
    updateProfile: (data) => request.put('/auth/profile', data),
    changePassword: (data) => request.post('/auth/change-password', data)
  },
  
  // 统计相关
  stats: {
    record: (data) => request.post('/stats/record', data),
    getStats: (domain) => request.get(`/stats/${domain}`),
    getReport: (domain, params) => request.get(`/stats/${domain}/report`, { params }),
    getScript: () => request.get('/stats/script.js')
  },
  
  // 点赞相关
  like: {
    toggle: (data) => request.post('/like/toggle', data),
    getStatus: (params) => request.get('/like/status', { params }),
    getRanking: (domain, params) => request.get(`/like/ranking/${domain}`, { params }),
    getScript: () => request.get('/like/script.js')
  }
}

export default api