<template>
  <div class="d-flex flex-column min-vh-100 justify-content-center">
    <div class="w-75 w-lg-80 mx-auto  d-flex flex-column min-vh-100">
      <NavBar />
      <main class="flex-grow-1 w-75 mx-auto w-lg-80">
        <router-view />
      </main>
      <FooTer />
    </div>
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
