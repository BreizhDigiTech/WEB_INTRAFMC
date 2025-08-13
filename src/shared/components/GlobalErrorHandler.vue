<template>
  <Teleport to="body">
    <div class="toast toast-top toast-end z-50">
      <TransitionGroup
        name="toast"
        tag="div"
        class="space-y-2"
      >
        <div
          v-for="error in errorStore.errors"
          :key="error.id"
          class="alert shadow-lg min-w-80 max-w-96"
          :class="getAlertClass(error.type)"
        >
          <div class="flex items-start space-x-3 w-full">
            <!-- Icône -->
            <div class="flex-shrink-0">
              <svg 
                v-if="error.type === 'success'"
                class="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg 
                v-else-if="error.type === 'warning'"
                class="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <svg 
                v-else-if="error.type === 'info'"
                class="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg 
                v-else
                class="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <!-- Contenu -->
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium break-words">
                {{ error.message }}
              </div>
              <div v-if="error.code && isDev" class="text-xs opacity-75 mt-1">
                Code: {{ error.code }}
              </div>
            </div>

            <!-- Bouton fermer -->
            <button
              @click="errorStore.removeError(error.id)"
              class="flex-shrink-0 btn btn-ghost btn-xs btn-circle opacity-70 hover:opacity-100"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { ErrorState } from '@/shared/errors/errorStore'
import { useErrorStore } from '@/shared/errors/errorStore'
import { computed } from 'vue'

const errorStore = useErrorStore()

const isDev = computed(() => import.meta.env.DEV)

const getAlertClass = (type: ErrorState['type']) => {
  switch (type) {
    case 'success':
      return 'alert-success'
    case 'warning':
      return 'alert-warning'
    case 'info':
      return 'alert-info'
    case 'error':
    default:
      return 'alert-error'
  }
}
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
