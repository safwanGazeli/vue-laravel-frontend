<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <NavigationBar />
    <main class="flex-grow-1">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import NavigationBar from '@/components/NavigationBar.vue'
</script>

<style scoped>
/* Responsive app container */
#app {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* Main content area */
main {
  flex: 1;
  width: 100%;
  padding: 1rem;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  #app {
    padding: 0;
  }
}

@media (min-width: 577px) and (max-width: 767px) {
  #app {
    padding: 0;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  #app {
    padding: 0;
  }
}

@media (min-width: 992px) {
  #app {
    padding: 0;
  }
}
</style>

