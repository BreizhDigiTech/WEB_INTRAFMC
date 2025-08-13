<template>
  <div id="app">
    <router-view />
    
    <!-- Gestion globale des erreurs/notifications -->
    <GlobalErrorHandler />
  </div>
</template>

<script setup lang="ts">
import GlobalErrorHandler from '@/shared/components/GlobalErrorHandler.vue'
import { useErrorStore } from '@/shared/errors/errorStore'
import { onMounted } from 'vue'

const errorStore = useErrorStore()

onMounted(() => {
  // Message de bienvenue en développement
  if (import.meta.env.DEV) {
    errorStore.addInfo('Mode développement activé', 2000)
  }
})
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
