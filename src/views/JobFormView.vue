<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              {{ isEditing ? 'Edit Job' : 'Create New Job' }}
            </h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleSubmit">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="title" class="form-label">Job Title *</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    v-model="form.title"
                    :class="{ 'is-invalid': errors.title }"
                    required
                  />
                  <div class="invalid-feedback" v-if="errors.title">
                    {{ errors.title }}
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label for="suburb" class="form-label">Suburb *</label>
                  <input
                    type="text"
                    class="form-control"
                    id="suburb"
                    v-model="form.suburb"
                    :class="{ 'is-invalid': errors.suburb }"
                    required
                  />
                  <div class="invalid-feedback" v-if="errors.suburb">
                    {{ errors.suburb }}
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="category_id" class="form-label">Category *</label>
                  <select
                    class="form-select"
                    id="category_id"
                    v-model="form.category_id"
                    :class="{ 'is-invalid': errors.category_id }"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="1">Construction</option>
                    <option value="13">Technology</option>
                    <option value="19">Security</option>
                    <option value="31">Software</option>
                  </select>
                  <div class="invalid-feedback" v-if="errors.category_id">
                    {{ errors.category_id }}
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label for="subcategory_id" class="form-label">Subcategory *</label>
                  <select
                    class="form-select"
                    id="subcategory_id"
                    v-model="form.subcategory_id"
                    :class="{ 'is-invalid': errors.subcategory_id }"
                    required
                  >
                    <option value="">Select Subcategory</option>
                    <option value="2">General</option>
                    <option value="3">Specialized</option>
                    <option value="15">IT Services</option>
                    <option value="22">Security Services</option>
                    <option value="36">Software Development</option>
                  </select>
                  <div class="invalid-feedback" v-if="errors.subcategory_id">
                    {{ errors.subcategory_id }}
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label for="price_offer" class="form-label">Price Offer *</label>
                <div class="input-group">
                  <span class="input-group-text">$</span>
                  <input
                    type="number"
                    class="form-control"
                    id="price_offer"
                    v-model="form.price_offer"
                    :class="{ 'is-invalid': errors.price_offer }"
                    min="0"
                    step="0.01"
                    required
                  />
                  <div class="invalid-feedback" v-if="errors.price_offer">
                    {{ errors.price_offer }}
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label for="description" class="form-label">Description *</label>
                <textarea
                  class="form-control"
                  id="description"
                  v-model="form.description"
                  :class="{ 'is-invalid': errors.description }"
                  rows="4"
                  required
                ></textarea>
                <div class="invalid-feedback" v-if="errors.description">
                  {{ errors.description }}
                </div>
              </div>

              <div class="d-flex gap-2">
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="isSubmitting"
                >
                  <span
                    v-if="isSubmitting"
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  {{ isEditing ? 'Update Job' : 'Create Job' }}
                </button>

                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="$router.push('/jobs')"
                  :disabled="isSubmitting"
                >
                  Cancel
                </button>

                <button
                  v-if="isEditing"
                  type="button"
                  class="btn btn-danger ms-auto"
                  @click="handleDelete"
                  :disabled="isSubmitting"
                >
                  <span
                    v-if="jobsStore.isDeleting"
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Delete Job
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJobsStore } from '@/stores/jobs'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const jobsStore = useJobsStore()
const authStore = useAuthStore()

const isEditing = computed(() => !!route.params.id)
const isSubmitting = computed(() => jobsStore.isCreating || jobsStore.isUpdating)

const form = reactive({
  title: '',
  description: '',
  price_offer: '',
  suburb: '',
  category_id: '',
  subcategory_id: ''
})

const errors = reactive({
  title: '',
  description: '',
  price_offer: '',
  suburb: '',
  category_id: '',
  subcategory_id: ''
})

const clearErrors = () => {
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
}

const validateForm = () => {
  clearErrors()
  let isValid = true

  if (!form.title.trim()) {
    errors.title = 'Title is required'
    isValid = false
  }

  if (!form.description.trim()) {
    errors.description = 'Description is required'
    isValid = false
  }

  if (!form.price_offer || parseFloat(form.price_offer) <= 0) {
    errors.price_offer = 'Valid price offer is required'
    isValid = false
  }

  if (!form.suburb.trim()) {
    errors.suburb = 'Suburb is required'
    isValid = false
  }

  if (!form.category_id) {
    errors.category_id = 'Category is required'
    isValid = false
  }

  if (!form.subcategory_id) {
    errors.subcategory_id = 'Subcategory is required'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    const jobData = {
      title: form.title.trim(),
      description: form.description.trim(),
      price_offer: form.price_offer,
      suburb: form.suburb.trim(),
      category_id: parseInt(form.category_id),
      subcategory_id: parseInt(form.subcategory_id)
    }

    if (isEditing.value) {
      const jobId = parseInt(route.params.id)
      await jobsStore.updateJob(jobId, jobData)
    } else {
      await jobsStore.createJob(jobData)
    }

    router.push('/jobs')
  } catch (error) {
    console.error('Form submission error:', error)
  }
}

const handleDelete = async () => {
  if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
    return
  }

  try {
    const jobId = parseInt(route.params.id)
    await jobsStore.deleteJob(jobId)
    router.push('/jobs')
  } catch (error) {
    console.error('Delete error:', error)
  }
}

const loadJobData = async () => {
  if (!isEditing.value) return

  try {
    const jobId = parseInt(route.params.id)
    const job = await jobsStore.fetchJob(jobId)
    
    if (job) {
      form.title = job.title
      form.description = job.description
      form.price_offer = job.price_offer
      form.suburb = job.suburb
      form.category_id = job.category_id.toString()
      form.subcategory_id = job.subcategory_id.toString()
    }
  } catch (error) {
    console.error('Error loading job:', error)
    router.push('/jobs')
  }
}

onMounted(() => {
  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  loadJobData()
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

.form-label {
  font-weight: 500;
  color: #495057;
}

.btn {
  font-weight: 500;
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.btn-primary:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-danger:hover {
  background-color: #bb2d3b;
  border-color: #b02a37;
}
</style>
