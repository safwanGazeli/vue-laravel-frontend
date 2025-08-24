<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <!-- Loading State -->
        <div v-if="jobsStore.isLoading" class="text-center py-5">
          <div class="spinner-border text-primary mb-3" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="text-muted">Loading job details...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="jobsStore.getError" class="alert alert-danger">
          <h5 class="alert-heading">Error</h5>
          <p>{{ jobsStore.getError }}</p>
          <button @click="loadJob" class="btn btn-primary">Try Again</button>
        </div>

        <!-- Job Details -->
        <div v-else-if="jobsStore.getCurrentJob" class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h3 class="card-title mb-0">Job Details</h3>
            <div class="d-flex gap-2">
              <button 
                @click="$router.push(`/jobs/${jobsStore.getCurrentJob.id}/edit`)"
                class="btn btn-primary btn-sm"
              >
                <i class="bi bi-pencil me-1"></i>
                Edit
              </button>
              <button 
                @click="handleDelete"
                class="btn btn-danger btn-sm"
                :disabled="jobsStore.isDeleting"
              >
                <span
                  v-if="jobsStore.isDeleting"
                  class="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true"
                ></span>
                <i v-else class="bi bi-trash me-1"></i>
                Delete
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-8">
                <h4 class="mb-3">{{ jobsStore.getCurrentJob.title }}</h4>
                <p class="text-muted mb-4">{{ jobsStore.getCurrentJob.description }}</p>
                
                <div class="row mb-4">
                  <div class="col-sm-6">
                    <div class="d-flex align-items-center mb-2">
                      <i class="bi bi-geo-alt text-primary me-2"></i>
                      <span>{{ jobsStore.getCurrentJob.suburb }}</span>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="d-flex align-items-center mb-2">
                      <i class="bi bi-currency-dollar text-success me-2"></i>
                      <span class="fw-bold">${{ formatPrice(jobsStore.getCurrentJob.price_offer) }}</span>
                    </div>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-sm-6">
                    <div class="d-flex align-items-center mb-2">
                      <i class="bi bi-tag text-info me-2"></i>
                      <span>Category ID: {{ jobsStore.getCurrentJob.category_id }}</span>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="d-flex align-items-center mb-2">
                      <i class="bi bi-tags text-warning me-2"></i>
                      <span>Subcategory ID: {{ jobsStore.getCurrentJob.subcategory_id }}</span>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-sm-6">
                    <div class="d-flex align-items-center mb-2">
                      <i class="bi bi-person text-secondary me-2"></i>
                      <span>Author ID: {{ jobsStore.getCurrentJob.author_id }}</span>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="d-flex align-items-center mb-2">
                      <i class="bi bi-calendar text-primary me-2"></i>
                      <span>Created: {{ formatDate(jobsStore.getCurrentJob.created_at) }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="col-md-4">
                <div class="card bg-light">
                  <div class="card-body">
                    <h6 class="card-title">Job Information</h6>
                    <ul class="list-unstyled mb-0">
                      <li class="mb-2">
                        <small class="text-muted">Job ID:</small><br>
                        <strong>#{{ jobsStore.getCurrentJob.id }}</strong>
                      </li>
                      <li class="mb-2">
                        <small class="text-muted">Last Updated:</small><br>
                        <strong>{{ formatDate(jobsStore.getCurrentJob.updated_at) }}</strong>
                      </li>
                      <li class="mb-2">
                        <small class="text-muted">Status:</small><br>
                        <span class="badge bg-success">Active</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <button 
              @click="$router.push('/jobs')"
              class="btn btn-secondary"
            >
              <i class="bi bi-arrow-left me-1"></i>
              Back to Jobs
            </button>
          </div>
        </div>

        <!-- No Job Found -->
        <div v-else class="text-center py-5">
          <i class="bi bi-exclamation-triangle display-4 text-muted mb-3"></i>
          <h4>Job Not Found</h4>
          <p class="text-muted">The job you're looking for doesn't exist or has been removed.</p>
          <button @click="$router.push('/jobs')" class="btn btn-primary">
            Back to Jobs
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJobsStore } from '@/stores/jobs'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const jobsStore = useJobsStore()
const authStore = useAuthStore()

const loadJob = async () => {
  try {
    const jobId = parseInt(route.params.id)
    await jobsStore.fetchJob(jobId)
  } catch (error) {
    console.error('Error loading job:', error)
  }
}

const handleDelete = async () => {
  if (!jobsStore.getCurrentJob) return
  
  if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
    return
  }

  try {
    await jobsStore.deleteJob(jobsStore.getCurrentJob.id)
    router.push('/jobs')
  } catch (error) {
    console.error('Error deleting job:', error)
  }
}

const formatPrice = (price) => {
  const numPrice = parseFloat(price)
  return numPrice.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  loadJob()
})
</script>

<style scoped>
.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.bi {
  width: 16px;
  text-align: center;
}

.badge {
  font-size: 0.75rem;
}
</style>
