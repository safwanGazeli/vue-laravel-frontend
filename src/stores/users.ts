import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'

interface User {
  id: number
  name: string
  email: string
  created_at: string
  updated_at: string
}

interface CreateUserData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

interface UpdateUserData {
  name: string
  email: string
  password?: string
  password_confirmation?: string
}

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const toast = useToast()

  const fetchUsers = async () => {
    loading.value = true
    try {
      const response = await axios.get('/api/users')
      users.value = response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch users'
      toast.error(message)
    } finally {
      loading.value = false
    }
  }

  const createUser = async (userData: CreateUserData) => {
    try {
      const response = await axios.post('/api/users', userData)
      users.value.push(response.data)
      toast.success('User created successfully!')
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create user'
      toast.error(message)
      throw error
    }
  }

  const updateUser = async (id: number, userData: UpdateUserData) => {
    try {
      const response = await axios.put(`/api/users/${id}`, userData)
      const index = users.value.findIndex(user => user.id === id)
      if (index !== -1) {
        users.value[index] = response.data
      }
      toast.success('User updated successfully!')
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update user'
      toast.error(message)
      throw error
    }
  }

  const deleteUser = async (id: number) => {
    try {
      await axios.delete(`/api/users/${id}`)
      users.value = users.value.filter(user => user.id !== id)
      toast.success('User deleted successfully!')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete user'
      toast.error(message)
      throw error
    }
  }

  const getUser = async (id: number) => {
    try {
      const response = await axios.get(`/api/users/${id}`)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch user'
      toast.error(message)
      throw error
    }
  }

  return {
    users,
    loading,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUser
  }
}) 