<template>
  <div id="app">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
      <div class="container-fluid px-3 px-lg-4">
        <router-link to="/" class="navbar-brand fw-bold">
          Vue Laravel CRUD
        </router-link>
        
        <button 
          class="navbar-toggler border-0" 
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
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link">
                <i class="bi bi-house me-2"></i>
                Home
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/jobs" class="nav-link">
                <i class="bi bi-briefcase me-2"></i>
                Jobs
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/users" class="nav-link">
                <i class="bi bi-people me-2"></i>
                Users
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/dashboard" class="nav-link">
                <i class="bi bi-speedometer2 me-2"></i>
                Dashboard
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed
</script>

<style scoped>
/* Clean navbar styles */
.navbar-brand {
  font-size: 1.25rem;
  font-weight: 700;
}

.nav-link {
  font-weight: 500;
  padding: 0.5rem 1rem !important;
  transition: all 0.2s ease;
  border-radius: 0.375rem;
  margin: 0 0.25rem;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: white !important;
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
}

/* Main content */
.main-content {
  min-height: calc(100vh - 56px);
}

/* Mobile menu */
@media (max-width: 991.98px) {
  .navbar-collapse {
    margin-top: 1rem;
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 0.5rem;
  }
  
  .nav-link {
    margin: 0.25rem 0;
    text-align: center;
  }
}

/* Small screens */
@media (max-width: 575.98px) {
  .navbar-brand {
    font-size: 1.1rem;
  }
  
  .nav-link {
    padding: 0.75rem 1rem !important;
    font-size: 0.9rem;
  }
}
</style> 