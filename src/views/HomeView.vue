<template>
  <div class="home">
    <div class="hero">
      <h1>Welcome to Vue Laravel CRUD</h1>
      <p>A full-stack application with authentication and user management</p>
      
      <div class="hero-actions">
        <router-link to="/jobs" class="btn btn-primary">
          Browse Jobs
        </router-link>
        <router-link v-if="!isAuthenticated" to="/login" class="btn btn-secondary">
          Get Started
        </router-link>
        <router-link v-if="!isAuthenticated" to="/register" class="btn btn-outline">
          Create Account
        </router-link>
        <router-link v-if="isAuthenticated" to="/dashboard" class="btn btn-outline">
          Go to Dashboard
        </router-link>
      </div>
    </div>

    <div class="features">
      <div class="feature-card">
        <h3>Job Listings</h3>
        <p>Browse and search through available job opportunities</p>
      </div>
      <div class="feature-card">
        <h3>Authentication</h3>
        <p>Secure login and registration system with JWT tokens</p>
      </div>
      <div class="feature-card">
        <h3>User Management</h3>
        <p>Complete CRUD operations for user management</p>
      </div>
      <div class="feature-card">
        <h3>Modern UI</h3>
        <p>Beautiful and responsive interface built with Vue 3</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>

<style scoped>
.home {
  text-align: center;
}

.hero {
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 2.5rem;
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.25rem;
  color: var(--color-secondary);
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  text-align: center;
}

.feature-card h3 {
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.feature-card p {
  color: var(--color-secondary);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }
  
  .hero p {
    font-size: 1rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .features {
    grid-template-columns: 1fr;
  }
}
</style> 