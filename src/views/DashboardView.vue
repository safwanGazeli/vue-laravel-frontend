<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Dashboard</h1>
      <p>Welcome back, {{ user?.name }}!</p>
    </div>

    <div class="dashboard-stats">
      <div class="stat-card">
        <h3>Total Jobs</h3>
        <p class="stat-number">{{ jobs.length }}</p>
        <router-link to="/jobs" class="stat-link">Browse all jobs</router-link>
      </div>
      
      <div class="stat-card">
        <h3>Total Users</h3>
        <p class="stat-number">{{ users.length }}</p>
        <router-link to="/users" class="stat-link">View all users</router-link>
      </div>
      
      <div class="stat-card">
        <h3>Your Account</h3>
        <p class="stat-text">{{ user?.email }}</p>
        <p class="stat-text">Member since {{ formatDate(user?.created_at) }}</p>
      </div>
    </div>

    <div class="dashboard-actions">
      <div class="action-card">
        <h3>Quick Actions</h3>
        <div class="action-buttons">
          <router-link to="/jobs" class="btn btn-primary">
            <i class="bi bi-briefcase me-1"></i>
            Browse Jobs
          </router-link>
          <router-link to="/jobs/create" class="btn btn-success">
            <i class="bi bi-plus-circle me-1"></i>
            Create Job
          </router-link>
          <router-link to="/users" class="btn btn-info">
            <i class="bi bi-people me-1"></i>
            Manage Users
          </router-link>
          <router-link to="/users/create" class="btn btn-secondary">
            <i class="bi bi-person-plus me-1"></i>
            Add New User
          </router-link>
        </div>
      </div>
    </div>

    <div v-if="users.length > 0" class="recent-users">
      <h3>Recent Users</h3>
      <div class="users-table">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in recentUsers" :key="user.id">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ formatDate(user.created_at) }}</td>
              <td>
                <router-link :to="`/users/${user.id}/edit`" class="btn btn-secondary btn-sm">
                  Edit
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import { useJobsStore } from '@/stores/jobs'

const authStore = useAuthStore()
const usersStore = useUsersStore()
const jobsStore = useJobsStore()

const user = computed(() => authStore.user)
const users = computed(() => usersStore.users)
const jobs = computed(() => jobsStore.jobs)

const recentUsers = computed(() => {
  return users.value.slice(0, 5)
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

onMounted(() => {
  // Check if user is authenticated before fetching data
  if (authStore.isAuthenticated) {
    usersStore.fetchUsers()
    jobsStore.fetchJobs()
  }
})
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.dashboard-header p {
  color: var(--color-secondary);
  font-size: 1.1rem;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  text-align: center;
}

.stat-card h3 {
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.stat-text {
  color: var(--color-secondary);
  margin-bottom: 0.25rem;
}

.stat-link {
  color: var(--color-primary);
  text-decoration: none;
  font-size: 0.875rem;
}

.stat-link:hover {
  text-decoration: underline;
}

.dashboard-actions {
  margin-bottom: 2rem;
}

.action-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.action-card h3 {
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.recent-users {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.recent-users h3 {
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .dashboard-stats {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-buttons .btn {
    width: 100%;
  }
}
</style> 