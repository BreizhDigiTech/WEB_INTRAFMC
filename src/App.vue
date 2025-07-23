<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// App principal sans header/footer - tout géré par les layouts individuels
</script>

<style>
/* Styles globaux uniquement */
body {
  margin: 0;
  padding: 0;
}

#app {
  min-height: 100vh;
}
</style>
