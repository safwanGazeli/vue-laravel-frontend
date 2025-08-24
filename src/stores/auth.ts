import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'

interface User {
  id: number
  name: string
  email: string
  created_at: string
  updated_at: string
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterCredentials {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const toast = useToast()

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // Set axios default headers
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials)
      const { user: userData, token: authToken } = response.data

      user.value = userData
      token.value = authToken
      localStorage.setItem('token', authToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`

      toast.success('Login successful!')
      return true
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return false
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    try {
      const response = await axios.post('/api/auth/register', credentials)
      const { user: userData, token: authToken } = response.data

      user.value = userData
      token.value = authToken
      localStorage.setItem('token', authToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`

      toast.success('Registration successful!')
      return true
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return false
    }
  }

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout')
    } catch (error) {
      // Ignore logout errors
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
      toast.success('Logged out successfully')
    }
  }

  const fetchUser = async () => {
    if (!token.value) return false

    try {
      const response = await axios.get('/api/auth/user')
      user.value = response.data
      return true
    } catch (error) {
      logout()
      return false
    }
  }

  // Initialize user data if token exists
  if (token.value) {
    fetchUser()
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser
  }
}) 