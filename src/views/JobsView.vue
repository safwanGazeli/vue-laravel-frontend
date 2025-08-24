<template>
  <div class="jobs-container">
    <div class="header">
      <h1>Jobs List</h1>
      <p class="subtitle">Browse available jobs from the API</p>
    </div>

    <!-- Loading State -->
    <div v-if="jobsStore.isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading jobs...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="jobsStore.getError" class="error-container">
      <div class="alert alert-error">
        <h3>Error</h3>
        <p>{{ jobsStore.getError }}</p>
        <button @click="loadJobs" class="btn btn-primary">Try Again</button>
      </div>
    </div>

    <!-- Jobs List -->
    <div v-else class="jobs-content">
      <!-- Stats -->
      <div class="stats">
        <div class="stat-card">
          <h3>Total Jobs</h3>
          <p class="stat-number">{{ jobsStore.getPagination.total }}</p>
        </div>
        <div class="stat-card">
          <h3>Current Page</h3>
          <p class="stat-number">{{ jobsStore.getPagination.currentPage }} / {{ jobsStore.getPagination.lastPage }}</p>
        </div>
        <div class="stat-card">
          <h3>Per Page</h3>
          <p class="stat-number">{{ jobsStore.getPagination.perPage }}</p>
        </div>
      </div>

      <!-- Jobs Grid -->
      <div class="jobs-grid">
        <div 
          v-for="job in jobsStore.getJobs" 
          :key="job.id" 
          class="job-card"
        >
          <div class="job-header">
            <h3 class="job-title">{{ job.title }}</h3>
            <span class="job-price">${{ formatPrice(job.price_offer) }}</span>
          </div>
          
          <div class="job-details">
            <p class="job-description">{{ truncateDescription(job.description) }}</p>
            
            <div class="job-meta">
              <div class="meta-item">
                <span class="meta-label">Location:</span>
                <span class="meta-value">{{ job.suburb }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Category:</span>
                <span class="meta-value">{{ job.category_id }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Posted:</span>
                <span class="meta-value">{{ formatDate(job.created_at) }}</span>
              </div>
            </div>
          </div>

          <div class="job-actions">
            <button class="btn btn-outline">View Details</button>
            <button class="btn btn-primary">Apply Now</button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="jobsStore.getPagination.lastPage > 1" class="pagination">
        <button 
          @click="jobsStore.fetchPreviousPage()"
          :disabled="jobsStore.getPagination.currentPage === 1"
          class="btn btn-outline"
        >
          Previous
        </button>
        
        <div class="page-numbers">
          <button 
            v-for="page in getPageNumbers()" 
            :key="page"
            @click="jobsStore.fetchPage(page)"
            :class="[
              'btn', 
              page === jobsStore.getPagination.currentPage ? 'btn-primary' : 'btn-outline'
            ]"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          @click="jobsStore.fetchNextPage()"
          :disabled="jobsStore.getPagination.currentPage === jobsStore.getPagination.lastPage"
          class="btn btn-outline"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useJobsStore } from '@/stores/jobs'

const jobsStore = useJobsStore()

const loadJobs = () => {
  jobsStore.fetchJobs()
}

const formatPrice = (price: string) => {
  const numPrice = parseFloat(price)
  return numPrice.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const truncateDescription = (description: string) => {
  if (description.length <= 150) return description
  return description.substring(0, 150) + '...'
}

const getPageNumbers = () => {
  const current = jobsStore.getPagination.currentPage
  const last = jobsStore.getPagination.lastPage
  const pages = []
  
  // Show up to 5 pages around current page
  const start = Math.max(1, current - 2)
  const end = Math.min(last, current + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
}

onMounted(() => {
  loadJobs()
})
</script>

<style scoped>
.jobs-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  font-size: 2.5rem;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
}

.loading-container {
  text-align: center;
  padding: 4rem 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-border);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem 0;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--color-background-soft);
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  border: 1px solid var(--color-border);
}

.stat-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-primary);
  margin: 0;
}

.jobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.job-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.job-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary);
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.job-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  line-height: 1.3;
  flex: 1;
}

.job-price {
  background: var(--color-primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
}

.job-description {
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.job-meta {
  margin-bottom: 1.5rem;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border);
}

.meta-item:last-child {
  border-bottom: none;
}

.meta-label {
  font-weight: 500;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.meta-value {
  color: var(--color-text);
  font-weight: 600;
  font-size: 0.9rem;
}

.job-actions {
  display: flex;
  gap: 0.75rem;
}

.job-actions .btn {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-numbers .btn {
  min-width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .jobs-container {
    padding: 1rem;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .jobs-grid {
    grid-template-columns: 1fr;
  }
  
  .job-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .job-price {
    align-self: flex-start;
  }
  
  .pagination {
    flex-direction: column;
    gap: 1rem;
  }
  
  .page-numbers {
    order: -1;
  }
}
</style> 