import { defineStore } from 'pinia'
import axios from 'axios'
import { useToast } from 'vue-toastification'

export interface Job {
  id: number
  category_id: number
  subcategory_id: number
  title: string
  description: string
  price_offer: string
  suburb: string
  author_id: number
  created_at: string
  updated_at: string
}

export interface JobsResponse {
  data: Job[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    per_page: number
    to: number
    total: number
  }
  http_status: number
  success: boolean
}

export const useJobsStore = defineStore('jobs', {
  state: () => ({
    jobs: [] as Job[],
    loading: false,
    error: null as string | null,
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
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    getPagination: (state) => state.pagination,
    getFilters: (state) => state.filters
  },

  actions: {
    async fetchJobs(page: number = 1) {
      this.loading = true
      this.error = null
      
      try {
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
        
        const response = await axios.get<JobsResponse>(
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
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message || 'Failed to fetch jobs'
        const toast = useToast()
        toast.error(this.error)
      } finally {
        this.loading = false
      }
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

    async fetchPage(page: number) {
      if (page >= 1 && page <= this.pagination.lastPage) {
        await this.fetchJobs(page)
      }
    },

    updateFilters(newFilters: Partial<typeof this.filters>) {
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
      this.error = null
      this.pagination = {
        currentPage: 1,
        lastPage: 1,
        perPage: 10,
        total: 0
      }
    }
  }
}) 