import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('flyteam_token') || '')

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // 初始化认证状态
  const initializeAuth = async () => {
    if (token.value) {
      try {
        const response = await api.auth.getProfile()
        user.value = response.data.user
      } catch (error) {
        console.error('获取用户信息失败:', error)
        logout()
      }
    }
  }

  // 登录
  const login = async (credentials) => {
    try {
      const response = await api.auth.login(credentials)
      const { user: userData, token: authToken } = response.data
      
      user.value = userData
      token.value = authToken
      localStorage.setItem('flyteam_token', authToken)
      
      return response
    } catch (error) {
      throw error
    }
  }

  // 注册
  const register = async (userData) => {
    try {
      const response = await api.auth.register(userData)
      const { user: newUser, token: authToken } = response.data
      
      user.value = newUser
      token.value = authToken
      localStorage.setItem('flyteam_token', authToken)
      
      return response
    } catch (error) {
      throw error
    }
  }

  // 登出
  const logout = () => {
    user.value = null
    token.value = ''
    localStorage.removeItem('flyteam_token')
  }

  // 更新用户信息
  const updateProfile = async (profileData) => {
    try {
      const response = await api.auth.updateProfile(profileData)
      user.value = response.data.user
      return response
    } catch (error) {
      throw error
    }
  }

  // 修改密码
  const changePassword = async (passwordData) => {
    try {
      const response = await api.auth.changePassword(passwordData)
      return response
    } catch (error) {
      throw error
    }
  }

  return {
    user: readonly(user),
    token: readonly(token),
    isAuthenticated,
    initializeAuth,
    login,
    register,
    logout,
    updateProfile,
    changePassword
  }
})