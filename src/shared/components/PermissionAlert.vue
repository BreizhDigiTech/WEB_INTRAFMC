<template>
  <div v-if="hasMessage" class="mb-6">
    <div 
      :class="[
        'alert',
        alertType === 'error' ? 'alert-error' : 
        alertType === 'warning' ? 'alert-warning' : 
        alertType === 'info' ? 'alert-info' : 'alert-success'
      ]"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="stroke-current shrink-0 h-6 w-6" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <path 
          v-if="alertType === 'error'"
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
        <path 
          v-else-if="alertType === 'warning'"
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" 
        />
        <path 
          v-else-if="alertType === 'info'"
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
        <path 
          v-else
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
      <div>
        <h3 v-if="alertTitle" class="font-bold">{{ alertTitle }}</h3>
        <div class="text-xs">{{ message }}</div>
      </div>
      <button @click="clearMessage" class="btn btn-sm btn-ghost">
        ×
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Détection du type de message basé sur les query params
const messageType = computed(() => {
  return route.query.error ? 'error' :
         route.query.warning ? 'warning' :
         route.query.info ? 'info' :
         route.query.success ? 'success' : null
})

const hasMessage = computed(() => !!messageType.value)

const alertType = computed(() => messageType.value)

const message = computed(() => {
  return route.query.message as string || 
         route.query.error as string ||
         route.query.warning as string ||
         route.query.info as string ||
         route.query.success as string ||
         ''
})

const alertTitle = computed(() => {
  switch (messageType.value) {
    case 'error':
      return 'Accès refusé'
    case 'warning':
      return 'Attention'
    case 'info':
      return 'Information'
    case 'success':
      return 'Succès'
    default:
      return null
  }
})

const clearMessage = () => {
  // Nettoyer les query parameters
  const newQuery = { ...route.query }
  delete newQuery.error
  delete newQuery.warning
  delete newQuery.info
  delete newQuery.success
  delete newQuery.message
  
  router.replace({ query: newQuery })
}
</script>
