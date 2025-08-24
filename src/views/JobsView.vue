<template>
  <div class="bg-light min-vh-100 py-3">
    <!-- Breadcrumbs -->
    <div class="container-fluid px-4">
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <i class="bi bi-house-door me-1"></i>
            Home
          </li>
          <li class="breadcrumb-item active" aria-current="page">Jobs</li>
        </ol>
      </nav>
    </div>

    <!-- Main Content Layout -->
    <div class="container-fluid px-4">
      <div class="row g-4">
        <!-- Left Column - Jobs List -->
        <div class="col-12 col-xl-8">
        <div class="card shadow-sm">
          <!-- Search and Filter Header -->
          <div class="card-header bg-white border-bottom p-3 p-md-4">
            <!-- Tabs -->
            <ul class="nav nav-tabs border-0 mb-3" id="jobsTab" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active border-0 text-primary fw-semibold" id="jobs-tab" data-bs-toggle="tab" data-bs-target="#jobs" type="button" role="tab">
                  <span class="d-none d-sm-inline">Jobs for you</span>
                  <span class="d-sm-none">Jobs</span>
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link border-0 text-muted" id="recent-tab" data-bs-toggle="tab" data-bs-target="#recent" type="button" role="tab">
                  <span class="d-none d-sm-inline">Recent Searches</span>
                  <span class="d-sm-none">Recent</span>
                </button>
              </li>
            </ul>
            
            <!-- Search Controls -->
            <div class="row g-3 mb-3">
              <div class="col-12 col-lg-8">
                <div class="input-group">
                  <input
                    v-model="searchQuery"
                    @input="handleSearch"
                    type="text"
                    placeholder="Search Jobs"
                    class="form-control"
                  />
                  <button class="btn btn-outline-secondary" type="button">
                    <i class="bi bi-search"></i>
                  </button>
                </div>
              </div>
              <div class="col-12 col-lg-4">
                <div class="d-flex gap-2">
                  <button class="btn btn-outline-secondary btn-sm flex-fill">
                    <i class="bi bi-funnel me-1"></i>
                    Filter
                  </button>
                  <button class="btn btn-outline-secondary btn-sm flex-fill">
                    <i class="bi bi-mortarboard me-1"></i>
                    Internship
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Notification Banner -->
            <div class="alert alert-primary mb-0">
              <div class="row g-2 align-items-center">
                <div class="col-12 col-lg-6">
                  <div class="d-flex align-items-center">
                    <i class="bi bi-bell me-2"></i>
                    <span class="fw-medium">Get Notified for Similar Jobs</span>
                  </div>
                </div>
                <div class="col-12 col-lg-6">
                  <div class="d-flex gap-2 align-items-center">
                    <input 
                      type="email" 
                      placeholder="Your email address" 
                      class="form-control form-control-sm flex-grow-1"
                    />
                    <button class="btn btn-primary btn-sm text-nowrap">Set Alert</button>
                    <button class="btn-close btn-close-white" type="button" aria-label="Close"></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab Content -->
          <div class="tab-content" id="jobsTabContent">
            <div class="tab-pane fade show active" id="jobs" role="tabpanel">
              <!-- Loading State -->
              <div v-if="jobsStore.isLoading" class="text-center py-5">
                <div class="spinner-border text-primary mb-3" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="text-muted">Loading jobs...</p>
              </div>

              <!-- Error State -->
              <div v-else-if="jobsStore.getError" class="p-4">
                <div class="alert alert-danger">
                  <h5 class="alert-heading">Error</h5>
                  <p>{{ jobsStore.getError }}</p>
                  <button @click="loadJobs" class="btn btn-primary">Try Again</button>
                </div>
              </div>

                             <!-- Jobs List -->
               <div v-else class="p-3 p-md-4">
                 <!-- No Results -->
                 <div v-if="jobsStore.getJobs.length === 0 && !jobsStore.isLoading" class="text-center py-4 py-md-5">
                   <div class="mb-3 mb-md-4">
                     <i class="bi bi-search display-4 display-md-1 text-muted"></i>
                   </div>
                   <h3 class="mb-2 mb-md-3 fs-4 fs-md-3">No jobs found</h3>
                   <p class="text-muted mb-3 mb-md-4">Try adjusting your search criteria or filters</p>
                   <button @click="clearAllFilters" class="btn btn-primary">Clear All Filters</button>
                 </div>

                 <!-- Job Cards -->
                 <div v-else class="d-flex flex-column gap-2 gap-md-3">
                   <div 
                     v-for="job in jobsStore.getJobs" 
                     :key="job.id" 
                     class="card border-0 shadow-sm job-card"
                     @mouseenter="setHoveredJob(job)"
                   >
                     <div class="card-body p-3 p-md-4">
                       <div class="d-flex justify-content-between align-items-start mb-2 mb-md-3">
                         <div class="text-primary">
                           <i class="bi bi-fire"></i>
                         </div>
                         <button class="btn btn-link text-muted p-0">
                           <i class="bi bi-bookmark"></i>
                         </button>
                       </div>
                       
                       <div class="mb-2 mb-md-3">
                         <h5 class="card-title mb-1 mb-md-2 fs-6 fs-md-5">{{ job.title }}</h5>
                         <div class="text-success fw-semibold mb-1 mb-md-2 fs-6 fs-md-6">$ RM {{ formatPrice(job.price_offer) }}</div>
                         
                         <div class="d-flex align-items-center text-muted mb-1 mb-md-2">
                           <i class="bi bi-geo-alt me-1 me-md-2"></i>
                           <span class="small">{{ job.suburb }}</span>
                         </div>
                         
                         <div class="mb-2 mb-md-3">
                           <span class="badge bg-primary">Full-Time</span>
                         </div>
                       </div>
                       
                       <div class="d-flex align-items-center">
                         <div class="bg-warning rounded-3 d-flex align-items-center justify-content-center me-2 me-md-3" style="width: 35px; height: 35px; min-width: 35px;">
                           <span class="text-white fw-bold small">{{ getCompanyInitials(job.title) }}</span>
                         </div>
                         <div class="flex-grow-1 min-width-0">
                           <div class="fw-medium small text-truncate">{{ getCompanyName(job.title) }}</div>
                           <div class="text-muted small">{{ formatTimeAgo(job.created_at) }}</div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>

                                 <!-- Pagination -->
                 <div v-if="jobsStore.getPagination.lastPage > 1" class="d-flex justify-content-center mt-3 mt-md-4 pt-3 pt-md-4 border-top">
                   <nav aria-label="Jobs pagination">
                     <ul class="pagination pagination-sm pagination-md mb-0">
                       <li class="page-item" :class="{ disabled: jobsStore.getPagination.currentPage === 1 }">
                         <button 
                           @click="jobsStore.fetchPreviousPage()"
                           :disabled="jobsStore.getPagination.currentPage === 1"
                           class="page-link"
                         >
                           <span class="d-none d-sm-inline">Previous</span>
                           <span class="d-sm-none">Prev</span>
                         </button>
                       </li>
                       
                       <li 
                         v-for="page in getPageNumbers()" 
                         :key="page"
                         class="page-item d-none d-md-block"
                         :class="{ active: page === jobsStore.getPagination.currentPage }"
                       >
                         <button 
                           @click="jobsStore.fetchPage(page)"
                           class="page-link"
                         >
                           {{ page }}
                         </button>
                       </li>
                       
                       <li class="page-item d-md-none">
                         <span class="page-link">
                           {{ jobsStore.getPagination.currentPage }} / {{ jobsStore.getPagination.lastPage }}
                         </span>
                       </li>
                       
                       <li class="page-item" :class="{ disabled: jobsStore.getPagination.currentPage === jobsStore.getPagination.lastPage }">
                         <button 
                           @click="jobsStore.fetchNextPage()"
                           :disabled="jobsStore.getPagination.currentPage === jobsStore.getPagination.lastPage"
                           class="page-link"
                         >
                           <span class="d-none d-sm-inline">Next</span>
                           <span class="d-sm-none">Next</span>
                         </button>
                       </li>
                     </ul>
                   </nav>
                 </div>
               </div>
             </div>
             
             <div class="tab-pane fade" id="recent" role="tabpanel">
               <div class="p-3 p-md-4 text-center text-muted">
                 <i class="bi bi-clock-history display-4 display-md-4"></i>
                 <p class="mt-2 mt-md-3">No recent searches yet</p>
               </div>
             </div>
           </div>
         </div>
       </div>

               <!-- Right Column - AI Summary -->
        <div class="col-12 col-xl-4">
          <div class="card border-2 border-dashed border-secondary">
            <div class="card-body">
              <div class="d-flex align-items-center mb-4">
                <div class="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 32px; height: 32px;">
                  <i class="bi bi-robot text-white"></i>
                </div>
                <div class="d-flex align-items-center">
                  <span class="fw-semibold me-2">AI-generated summary</span>
                  <span class="badge bg-secondary">BETA</span>
                </div>
              </div>
              
              <div class="alert alert-light mb-4">
                <p class="mb-0 small">Hover over a job to find out what it involves and determine if it's the right fit for you!</p>
              </div>
              
              <div v-if="hoveredJob" class="ai-job-summary">
                <div class="mb-4">
                  <div class="d-flex align-items-center mb-3">
                    <i class="bi bi-file-text text-primary me-2"></i>
                    <span class="fw-semibold">Skills</span>
                  </div>
                  <div class="d-flex flex-wrap gap-2">
                    <span class="badge bg-light text-dark border">Angular (Web Framework)</span>
                    <span class="badge bg-light text-dark border">Interpersonal Communications</span>
                    <span class="badge bg-light text-dark border">Marketing Strategies</span>
                    <span class="badge bg-light text-dark border">+3 more</span>
                  </div>
                </div>
                
                <div class="mb-4">
                  <div class="d-flex align-items-center mb-3">
                    <i class="bi bi-building text-primary me-2"></i>
                    <span class="fw-semibold">Benefits</span>
                  </div>
                  <div class="d-flex flex-wrap gap-2">
                    <span class="badge bg-light text-dark border">Regular Company Activities</span>
                    <span class="badge bg-light text-dark border">Free Drinks and Snacks</span>
                    <span class="badge bg-light text-dark border">Amazing Rewards</span>
                    <span class="badge bg-light text-dark border">+3 more</span>
                  </div>
                </div>
              </div>
              
              <div v-else class="text-center text-muted">
                <p class="mb-2">Hover over a job for a quick overview.</p>
                <i class="bi bi-arrow-left"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue'
import { useJobsStore } from '@/stores/jobs'

const jobsStore = useJobsStore()

// Reactive variables for filters
const searchQuery = ref('')
const categoryFilter = ref('')
const subcategoryFilter = ref('')
const hoveredJob = ref(null)

// Debounced search function
let searchTimeout: number | null = null

const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    jobsStore.updateFilters({ search: searchQuery.value })
    jobsStore.fetchJobs(1)
  }, 500)
}

const clearSearch = () => {
  searchQuery.value = ''
  jobsStore.updateFilters({ search: '' })
  jobsStore.fetchJobs(1)
}

const handleFilterChange = () => {
  jobsStore.updateFilters({
    category: categoryFilter.value,
    subcategory: subcategoryFilter.value
  })
  jobsStore.fetchJobs(1)
}

const clearAllFilters = () => {
  searchQuery.value = ''
  categoryFilter.value = ''
  subcategoryFilter.value = ''
  jobsStore.clearFilters()
  jobsStore.fetchJobs(1)
}

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

const setHoveredJob = (job: any) => {
  hoveredJob.value = job
}

const getCompanyInitials = (title: string) => {
  const words = title.split(' ')
  if (words.length >= 2) {
    return words[0].charAt(0) + words[1].charAt(0)
  }
  return title.substring(0, 2).toUpperCase()
}

const getCompanyName = (title: string) => {
  // Extract company name from job title (simplified)
  const words = title.split(' ')
  if (words.length > 2) {
    return words.slice(-2).join(' ')
  }
  return title
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
  return `${Math.floor(diffInDays / 365)} years ago`
}

onMounted(() => {
  loadJobs()
})
</script>

<style scoped>
/* Custom hover effects for job cards */
.job-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.job-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  border-color: var(--bs-primary) !important;
}

/* Custom styles for the AI summary section */
.ai-job-summary {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive improvements */
@media (max-width: 1199px) {
  .col-xl-4 {
    margin-top: 1rem;
  }
}

@media (min-width: 1400px) {
  .container-fluid {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

@media (min-width: 1600px) {
  .container-fluid {
    padding-left: 3rem;
    padding-right: 3rem;
  }
}

@media (max-width: 576px) {
  .container-fluid {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
  
  .card-body {
    padding: 1rem !important;
  }
  
  .job-card .card-title {
    font-size: 1rem !important;
    line-height: 1.3;
  }
  
  .badge {
    font-size: 0.75rem;
  }
  
  .btn-sm {
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .job-card {
    transition: none;
  }
  
  .job-card:hover {
    transform: none;
  }
  
  .ai-job-summary {
    animation: none;
  }
}
</style> 