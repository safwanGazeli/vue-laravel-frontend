# Jobs CRUD Operations Documentation

This document explains how to use the complete CRUD (Create, Read, Update, Delete) operations for the Jobs API in the Vue.js frontend application.

## Authentication

**Important**: All jobs API operations require authentication. Users must be logged in to perform any CRUD operations. If a user is not authenticated, they will be redirected to the login page.

## API Endpoint

Base URL: `https://api.baseplate.appetiserdev.tech/api/v1/jobs`

## Available Operations

### 1. GET - Fetch All Jobs
```javascript
// Fetch jobs with pagination and filters
await jobsStore.fetchJobs(page = 1)

// Fetch next page
await jobsStore.fetchNextPage()

// Fetch previous page
await jobsStore.fetchPreviousPage()

// Fetch specific page
await jobsStore.fetchPage(page)
```

### 2. GET - Fetch Single Job
```javascript
// Fetch a specific job by ID
await jobsStore.fetchJob(id)
```

### 3. POST - Create New Job
```javascript
// Create a new job
const jobData = {
  category_id: 1,
  subcategory_id: 2,
  title: "Software Engineer",
  description: "We are looking for a skilled software engineer...",
  price_offer: "5000",
  suburb: "Kuala Lumpur"
}

const newJob = await jobsStore.createJob(jobData)
```

### 4. PUT - Update Job
```javascript
// Update an existing job
const updateData = {
  title: "Senior Software Engineer",
  price_offer: "7000"
}

const updatedJob = await jobsStore.updateJob(jobId, updateData)
```

### 5. DELETE - Delete Job
```javascript
// Delete a job by ID
await jobsStore.deleteJob(jobId)
```

## Data Structure

### Job Object
```javascript
// Job object structure
const job = {
  id: 157,
  category_id: 1,
  subcategory_id: 2,
  title: "Software Engineer",
  description: "We are looking for a skilled software engineer...",
  price_offer: "5000",
  suburb: "Kuala Lumpur",
  author_id: 5802,
  created_at: "2025-05-16T06:13:33.000000Z",
  updated_at: "2025-05-16T06:13:33.000000Z"
}
```

### Create Job Data
```javascript
// Required fields for creating a job
const createJobData = {
  category_id: 1,
  subcategory_id: 2,
  title: "Software Engineer",
  description: "We are looking for a skilled software engineer...",
  price_offer: "5000",
  suburb: "Kuala Lumpur"
}
```

### Update Job Data
```javascript
// Optional fields for updating a job (include only fields you want to update)
const updateJobData = {
  title: "Senior Software Engineer",
  price_offer: "7000"
  // Other fields are optional
}
```

## Store State Management

The jobs store provides the following state properties:

```javascript
// Jobs data
jobs: []
currentJob: null

// Loading states
loading: false
creating: false
updating: false
deleting: false

// Error handling
error: null

// Filters and pagination
filters: {
  search: '',
  category: '',
  subcategory: '',
  include: 'photos'
}

pagination: {
  currentPage: 1,
  lastPage: 1,
  perPage: 10,
  total: 0
}
```

## Store Getters

```javascript
// Data getters
getJobs: (state) => state.jobs
getCurrentJob: (state) => state.currentJob

// Loading state getters
isLoading: (state) => state.loading
isCreating: (state) => state.creating
isUpdating: (state) => state.updating
isDeleting: (state) => state.deleting

// Other getters
getError: (state) => state.error
getPagination: (state) => state.pagination
getFilters: (state) => state.filters
```

## Usage Examples

### Creating a New Job
```vue
<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.title" placeholder="Job Title" required />
    <textarea v-model="form.description" placeholder="Description" required />
    <input v-model="form.price_offer" type="number" placeholder="Price" required />
    <input v-model="form.suburb" placeholder="Suburb" required />
    <select v-model="form.category_id" required>
      <option value="">Select Category</option>
      <option value="1">Construction</option>
      <option value="31">Software</option>
    </select>
    <select v-model="form.subcategory_id" required>
      <option value="">Select Subcategory</option>
      <option value="2">General</option>
      <option value="36">Software Development</option>
    </select>
    <button type="submit" :disabled="jobsStore.isCreating">
      {{ jobsStore.isCreating ? 'Creating...' : 'Create Job' }}
    </button>
  </form>
</template>

<script setup>
import { reactive } from 'vue'
import { useJobsStore } from '@/stores/jobs'

const jobsStore = useJobsStore()

const form = reactive({
  title: '',
  description: '',
  price_offer: '',
  suburb: '',
  category_id: '',
  subcategory_id: ''
})

const handleSubmit = async () => {
  try {
    const jobData = {
      title: form.title,
      description: form.description,
      price_offer: form.price_offer,
      suburb: form.suburb,
      category_id: parseInt(form.category_id),
      subcategory_id: parseInt(form.subcategory_id)
    }
    
    await jobsStore.createJob(jobData)
    // Redirect or show success message
  } catch (error) {
    // Handle error
  }
}
</script>
```

### Updating a Job
```vue
<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.title" placeholder="Job Title" />
    <textarea v-model="form.description" placeholder="Description" />
    <input v-model="form.price_offer" type="number" placeholder="Price" />
    <button type="submit" :disabled="jobsStore.isUpdating">
      {{ jobsStore.isUpdating ? 'Updating...' : 'Update Job' }}
    </button>
  </form>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useJobsStore } from '@/stores/jobs'

const route = useRoute()
const jobsStore = useJobsStore()

const form = reactive({
  title: '',
  description: '',
  price_offer: ''
})

const loadJob = async () => {
  const jobId = parseInt(route.params.id)
  const job = await jobsStore.fetchJob(jobId)
  
  if (job) {
    form.title = job.title
    form.description = job.description
    form.price_offer = job.price_offer
  }
}

const handleSubmit = async () => {
  try {
    const jobId = parseInt(route.params.id)
    const updateData = {
      title: form.title,
      description: form.description,
      price_offer: form.price_offer
    }
    
    await jobsStore.updateJob(jobId, updateData)
    // Redirect or show success message
  } catch (error) {
    // Handle error
  }
}

onMounted(() => {
  loadJob()
})
</script>
```

### Deleting a Job
```vue
<template>
  <button @click="handleDelete" :disabled="jobsStore.isDeleting">
    <span v-if="jobsStore.isDeleting">Deleting...</span>
    <span v-else>Delete Job</span>
  </button>
</template>

<script setup>
import { useJobsStore } from '@/stores/jobs'

const jobsStore = useJobsStore()

const handleDelete = async () => {
  if (!confirm('Are you sure you want to delete this job?')) {
    return
  }
  
  try {
    await jobsStore.deleteJob(jobId)
    // Redirect or show success message
  } catch (error) {
    // Handle error
  }
}
</script>
```

## Error Handling

All CRUD operations include comprehensive error handling:

```javascript
try {
  await jobsStore.createJob(jobData)
} catch (error) {
  // Error is automatically displayed via toast notification
  // You can also access the error message via jobsStore.getError
  console.error('Error creating job:', error)
}
```

## Toast Notifications

The store automatically shows toast notifications for:
- Success messages when operations complete
- Error messages when operations fail

## Available Routes

The application includes the following routes for job management:

- `/jobs` - List all jobs
- `/jobs/create` - Create new job form
- `/jobs/:id` - View job details
- `/jobs/:id/edit` - Edit job form

## Filtering and Search

You can filter jobs using the following methods:

```javascript
// Update filters
jobsStore.updateFilters({
  search: 'software engineer',
  category: '31',
  subcategory: '36'
})

// Clear all filters
jobsStore.clearFilters()

// Fetch jobs with current filters
jobsStore.fetchJobs(1)
```

## Best Practices

1. **Always handle loading states**: Use the loading state getters to show appropriate UI feedback
2. **Validate data**: Ensure all required fields are provided before making API calls
3. **Handle errors gracefully**: Use try-catch blocks and provide user-friendly error messages
4. **Confirm destructive actions**: Always ask for confirmation before deleting resources
5. **Update local state**: The store automatically updates the local state after successful operations
6. **Validate input data**: Ensure data matches the expected structure before making API calls

## API Response Format

All API responses follow this format:

```javascript
// Single job response
const apiResponse = {
  data: { /* job object */ },
  http_status: 200,
  success: true,
  message: "Success"
}
```

For paginated responses:

```javascript
// Jobs list response
const paginatedResponse = {
  data: [
    { /* job object 1 */ },
    { /* job object 2 */ }
  ],
  links: {
    first: "https://api.baseplate.appetiserdev.tech/api/v1/jobs?page=1",
    last: "https://api.baseplate.appetiserdev.tech/api/v1/jobs?page=11",
    prev: null,
    next: "https://api.baseplate.appetiserdev.tech/api/v1/jobs?page=2"
  },
  meta: {
    current_page: 1,
    from: 1,
    last_page: 11,
    per_page: 10,
    to: 10,
    total: 101
  },
  http_status: 200,
  success: true
}
```
