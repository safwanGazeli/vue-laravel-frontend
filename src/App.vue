<template>
  <div id="app">
    <nav class="navbar">
      <div class="container">
        <div class="nav-content">
          <router-link to="/" class="nav-brand">
            Vue Laravel CRUD
          </router-link>
          <div class="nav-menu">
            <router-link to="/" class="nav-link">Home</router-link>
            <router-link to="/jobs" class="nav-link">Jobs</router-link>
            <router-link v-if="!isAuthenticated" to="/login" class="nav-link">Login</router-link>
            <router-link v-if="!isAuthenticated" to="/register" class="nav-link">Register</router-link>
            <router-link v-if="isAuthenticated" to="/dashboard" class="nav-link">Dashboard</router-link>
            <router-link v-if="isAuthenticated" to="/users" class="nav-link">Users</router-link>
            <button v-if="isAuthenticated" @click="logout" class="btn btn-secondary">Logout</button>
          </div>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <div class="container">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  background-color: white;
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 0;
  margin-bottom: 2rem;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-primary);
  text-decoration: none;
}

.nav-menu {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-link {
  color: var(--color-text);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: #f1f5f9;
}

.nav-link.router-link-active {
  background-color: var(--color-primary);
  color: white;
}

.main-content {
  min-height: calc(100vh - 100px);
}
</style> 