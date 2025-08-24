<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand">
        <i class="bi bi-briefcase me-2"></i>
        Vue Laravel CRUD
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link" active-class="active">
              <i class="bi bi-house me-1"></i>
              Home
            </router-link>
          </li>
          
          <li v-if="isAuthenticated" class="nav-item">
            <router-link to="/jobs" class="nav-link" active-class="active">
              <i class="bi bi-briefcase me-1"></i>
              Jobs
            </router-link>
          </li>
          
          <li v-if="isAuthenticated" class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="jobsDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-plus-circle me-1"></i>
              Create
            </a>
            <ul class="dropdown-menu" aria-labelledby="jobsDropdown">
              <li>
                <router-link to="/jobs/create" class="dropdown-item">
                  <i class="bi bi-briefcase me-2"></i>
                  New Job
                </router-link>
              </li>
              <li>
                <router-link to="/users/create" class="dropdown-item">
                  <i class="bi bi-person-plus me-2"></i>
                  New User
                </router-link>
              </li>
            </ul>
          </li>
          
          <li v-if="isAuthenticated" class="nav-item">
            <router-link to="/users" class="nav-link" active-class="active">
              <i class="bi bi-people me-1"></i>
              Users
            </router-link>
          </li>
          
          <li v-if="isAuthenticated" class="nav-item">
            <router-link to="/dashboard" class="nav-link" active-class="active">
              <i class="bi bi-speedometer2 me-1"></i>
              Dashboard
            </router-link>
          </li>
        </ul>

        <ul class="navbar-nav">
          <li v-if="!isAuthenticated" class="nav-item">
            <router-link to="/login" class="nav-link">
              <i class="bi bi-box-arrow-in-right me-1"></i>
              Login
            </router-link>
          </li>
          
          <li v-if="!isAuthenticated" class="nav-item">
            <router-link to="/register" class="nav-link">
              <i class="bi bi-person-plus me-1"></i>
              Register
            </router-link>
          </li>
          
          <li v-if="isAuthenticated" class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="userDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-person-circle me-1"></i>
              {{ user?.name || 'User' }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li>
                <router-link to="/dashboard" class="dropdown-item">
                  <i class="bi bi-speedometer2 me-2"></i>
                  Dashboard
                </router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <button @click="handleLogout" class="dropdown-item">
                  <i class="bi bi-box-arrow-right me-2"></i>
                  Logout
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.navbar-brand {
  font-weight: 600;
  font-size: 1.25rem;
}

.nav-link {
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
}

.nav-link.active {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 0.375rem;
}

.dropdown-item {
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: var(--bs-primary);
  color: white;
}

.bi {
  font-size: 1rem;
}

@media (max-width: 991px) {
  .navbar-nav {
    margin-top: 0.5rem;
  }
  
  .nav-item {
    margin-bottom: 0.25rem;
  }
}
</style>
