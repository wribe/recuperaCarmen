<template>
  <div class="d-flex flex-column min-vh-100 mx-auto" style="width: 85%;">

      <NavBar />
      <main class="flex-grow-1 mt-2">
        <div class="container-lg">
          <router-view />
        </div>
      </main>
      <FooTer />

  </div>
</template>

<script setup>

import NavBar from './components/NavBar.vue';
import FooTer from './components/FooTer.vue';

</script>

<style scoped>
@media (max-width: 768px) {
  body{
    background: lightgray;
  }
}
</style>
