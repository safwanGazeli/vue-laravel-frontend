import { defineStore } from 'pinia'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import { useAuthStore } from './auth'

// Helper function to get authenticated axios instance
const getAuthenticatedAxios = () => {
  const authStore = useAuthStore()
  const token = authStore.token
  
  if (!token) {
    throw new Error('Authentication required. Please log in.')
  }
  
  // Create axios instance with auth headers
  const axiosInstance = axios.create({
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  
  return axiosInstance
}

export const useJobsStore = defineStore('jobs', {
  state: () => ({
    jobs: [],
    currentJob: null,
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    error: null,
    filters: {
      search: '',
      category: '',
      subcategory: '',
      include: 'photos'
    },
    pagination: {
      currentPage: 1,
      lastPage: 1,
      perPage: 10,
      total: 0
    }
  }),

  getters: {
    getJobs: (state) => state.jobs,
    getCurrentJob: (state) => state.currentJob,
    isLoading: (state) => state.loading,
    isCreating: (state) => state.creating,
    isUpdating: (state) => state.updating,
    isDeleting: (state) => state.deleting,
    getError: (state) => state.error,
    getPagination: (state) => state.pagination,
    getFilters: (state) => state.filters
  },

  actions: {
    async fetchJobs(page = 1) {
      this.loading = true
      this.error = null
      
      try {
        const axiosInstance = getAuthenticatedAxios()
        
        // Build query parameters
        const params = new URLSearchParams()
        params.append('page', page.toString())
        params.append('include', this.filters.include)
        
        if (this.filters.search) {
          params.append('filter[search]', this.filters.search)
        }
        if (this.filters.category) {
          params.append('filter[category_id]', this.filters.category)
        }
        if (this.filters.subcategory) {
          params.append('filter[subcategory_id]', this.filters.subcategory)
        }
        
        const response = await axiosInstance.get(
          `https://api.baseplate.appetiserdev.tech/api/v1/jobs?${params.toString()}`
        )
        
        if (response.data.success) {
          this.jobs = response.data.data
          this.pagination = {
            currentPage: response.data.meta.current_page,
            lastPage: response.data.meta.last_page,
            perPage: response.data.meta.per_page,
            total: response.data.meta.total
          }
        } else {
          throw new Error('Failed to fetch jobs')
        }
      } catch (error) {
        this.handleError(error, 'Failed to fetch jobs')
      } finally {
        this.loading = false
      }
    },

    async fetchJob(id) {
      this.loading = true
      this.error = null
      
      try {
        const axiosInstance = getAuthenticatedAxios()
        
        const response = await axiosInstance.get(
          `https://api.baseplate.appetiserdev.tech/api/v1/jobs/${id}`
        )
        
        if (response.data.success) {
          this.currentJob = response.data.data
          return response.data.data
        } else {
          throw new Error('Failed to fetch job')
        }
      } catch (error) {
        this.handleError(error, 'Failed to fetch job')
        throw error
      } finally {
        this.loading = false
      }
    },

    async createJob(jobData) {
      this.creating = true
      this.error = null
      
      try {
        const axiosInstance = getAuthenticatedAxios()
        
        const response = await axiosInstance.post(
          'https://api.baseplate.appetiserdev.tech/api/v1/jobs',
          jobData
        )
        
        if (response.data.success) {
          const newJob = response.data.data
          this.jobs.unshift(newJob) // Add to beginning of list
          this.pagination.total += 1
          
          const toast = useToast()
          toast.success('Job created successfully!')
          
          return newJob
        } else {
          throw new Error(response.data.message || 'Failed to create job')
        }
      } catch (error) {
        this.handleError(error, 'Failed to create job')
        throw error
      } finally {
        this.creating = false
      }
    },

    async updateJob(id, jobData) {
      this.updating = true
      this.error = null
      
      try {
        const axiosInstance = getAuthenticatedAxios()
        
        const response = await axiosInstance.put(
          `https://api.baseplate.appetiserdev.tech/api/v1/jobs/${id}`,
          jobData
        )
        
        if (response.data.success) {
          const updatedJob = response.data.data
          
          // Update in jobs array
          const index = this.jobs.findIndex(job => job.id === id)
          if (index !== -1) {
            this.jobs[index] = updatedJob
          }
          
          // Update current job if it's the one being updated
          if (this.currentJob && this.currentJob.id === id) {
            this.currentJob = updatedJob
          }
          
          const toast = useToast()
          toast.success('Job updated successfully!')
          
          return updatedJob
        } else {
          throw new Error(response.data.message || 'Failed to update job')
        }
      } catch (error) {
        this.handleError(error, 'Failed to update job')
        throw error
      } finally {
        this.updating = false
      }
    },

    async deleteJob(id) {
      this.deleting = true
      this.error = null
      
      try {
        const axiosInstance = getAuthenticatedAxios()
        
        const response = await axiosInstance.delete(
          `https://api.baseplate.appetiserdev.tech/api/v1/jobs/${id}`
        )
        
        if (response.data.success) {
          // Remove from jobs array
          this.jobs = this.jobs.filter(job => job.id !== id)
          
          // Clear current job if it's the one being deleted
          if (this.currentJob && this.currentJob.id === id) {
            this.currentJob = null
          }
          
          // Update pagination
          this.pagination.total = Math.max(0, this.pagination.total - 1)
          
          const toast = useToast()
          toast.success('Job deleted successfully!')
          
          return true
        } else {
          throw new Error(response.data.message || 'Failed to delete job')
        }
      } catch (error) {
        this.handleError(error, 'Failed to delete job')
        throw error
      } finally {
        this.deleting = false
      }
    },

    // Helper method to handle errors consistently
    handleError(error, defaultMessage) {
      let errorMessage = defaultMessage
      
      if (error.response?.status === 401) {
        errorMessage = 'Authentication required. Please log in.'
        // Redirect to login if not authenticated
        const authStore = useAuthStore()
        if (!authStore.isAuthenticated) {
          // Use window.location for navigation
          window.location.href = '/login'
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      this.error = errorMessage
      const toast = useToast()
      toast.error(errorMessage)
    },

    async fetchNextPage() {
      if (this.pagination.currentPage < this.pagination.lastPage) {
        await this.fetchJobs(this.pagination.currentPage + 1)
      }
    },

    async fetchPreviousPage() {
      if (this.pagination.currentPage > 1) {
        await this.fetchJobs(this.pagination.currentPage - 1)
      }
    },

    async fetchPage(page) {
      if (page >= 1 && page <= this.pagination.lastPage) {
        await this.fetchJobs(page)
      }
    },

    updateFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters }
    },

    clearFilters() {
      this.filters = {
        search: '',
        category: '',
        subcategory: '',
        include: 'photos'
      }
    },

    clearJobs() {
      this.jobs = []
      this.currentJob = null
      this.error = null
      this.pagination = {
        currentPage: 1,
        lastPage: 1,
        perPage: 10,
        total: 0
      }
    },

    setCurrentJob(job) {
      this.currentJob = job
    },

    clearError() {
      this.error = null
    }
  }
})
