<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// No additional logic needed
</script>

<style scoped>
/* Responsive app container */
#app {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* Ensure router-view takes full available space */
#app > * {
  flex: 1;
  width: 100%;
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

