<template>
  <div class="symphony-app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// Main application layout can go here
</script>

<style>
/* Base styles for the entire Symphony app */
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 25, 41, 1);
  color: #fff;
}

.symphony-app {
  min-height: 100vh;
}
</style>
