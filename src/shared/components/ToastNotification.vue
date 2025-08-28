/**
 * Composant de notification toast accessible et performant
 */
<template>
  <Teleport to="body">
    <div 
      class="toast-container"
      aria-live="polite"
      aria-label="Notifications"
    >
      <TransitionGroup
        name="toast"
        tag="div"
        class="toast-list"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'toast',
            `toast--${toast.type}`,
            {
              'toast--dismissible': toast.dismissible,
              'toast--persistent': toast.persistent
            }
          ]"
          role="alert"
          :aria-describedby="`toast-${toast.id}`"
        >
          <!-- Icône -->
          <div class="toast__icon" aria-hidden="true">
            <component :is="getIcon(toast.type)" />
          </div>
          
          <!-- Contenu -->
          <div class="toast__content">
            <div 
              v-if="toast.title"
              class="toast__title"
            >
              {{ toast.title }}
            </div>
            <div 
              :id="`toast-${toast.id}`"
              class="toast__message"
            >
              {{ toast.message }}
            </div>
          </div>
          
          <!-- Actions optionnelles -->
          <div 
            v-if="toast.actions && toast.actions.length > 0"
            class="toast__actions"
          >
            <button
              v-for="action in toast.actions"
              :key="action.label"
              @click="action.handler"
              class="toast__action"
              type="button"
            >
              {{ action.label }}
            </button>
          </div>
          
          <!-- Bouton de fermeture -->
          <button
            v-if="toast.dismissible"
            @click="removeToast(toast.id)"
            class="toast__close"
            type="button"
            aria-label="Fermer la notification"
          >
            <CloseIcon />
          </button>
          
          <!-- Barre de progression pour l'auto-dismiss -->
          <div
            v-if="!toast.persistent && toast.duration"
            class="toast__progress"
            :style="{ animationDuration: `${toast.duration}ms` }"
          ></div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { h, onUnmounted, ref } from 'vue'

// Types
interface ToastAction {
  label: string
  handler: () => void
}

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
  persistent?: boolean
  dismissible?: boolean
  actions?: ToastAction[]
}

// Icons (vous pouvez remplacer par vos icônes préférées)
const SuccessIcon = () => h('svg', { 
  width: '20', 
  height: '20', 
  viewBox: '0 0 20 20', 
  fill: 'currentColor' 
}, [
  h('path', { 
    d: 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' 
  })
])

const ErrorIcon = () => h('svg', { 
  width: '20', 
  height: '20', 
  viewBox: '0 0 20 20', 
  fill: 'currentColor' 
}, [
  h('path', { 
    fillRule: 'evenodd',
    d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z',
    clipRule: 'evenodd'
  })
])

const WarningIcon = () => h('svg', { 
  width: '20', 
  height: '20', 
  viewBox: '0 0 20 20', 
  fill: 'currentColor' 
}, [
  h('path', { 
    fillRule: 'evenodd',
    d: 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z',
    clipRule: 'evenodd'
  })
])

const InfoIcon = () => h('svg', { 
  width: '20', 
  height: '20', 
  viewBox: '0 0 20 20', 
  fill: 'currentColor' 
}, [
  h('path', { 
    fillRule: 'evenodd',
    d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z',
    clipRule: 'evenodd'
  })
])

const CloseIcon = () => h('svg', { 
  width: '16', 
  height: '16', 
  viewBox: '0 0 20 20', 
  fill: 'currentColor' 
}, [
  h('path', { 
    d: 'M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z' 
  })
])

// State
const toasts = ref<Toast[]>([])
const timers = new Map<string, number>()

// Methods
const getIcon = (type: Toast['type']) => {
  const icons = {
    success: SuccessIcon,
    error: ErrorIcon,
    warning: WarningIcon,
    info: InfoIcon
  }
  return icons[type]
}

const addToast = (toast: Omit<Toast, 'id'>) => {
  const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const newToast: Toast = {
    id,
    dismissible: true,
    duration: 5000,
    persistent: false,
    ...toast
  }
  
  toasts.value.push(newToast)
  
  // Auto-dismiss si non persistant
  if (!newToast.persistent && newToast.duration) {
    const timerId = window.setTimeout(() => {
      removeToast(id)
    }, newToast.duration)
    timers.set(id, timerId)
  }
  
  return id
}

const removeToast = (id: string) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
    
    // Nettoyer le timer
    const timerId = timers.get(id)
    if (timerId) {
      clearTimeout(timerId)
      timers.delete(id)
    }
  }
}

const clearAllToasts = () => {
  // Nettoyer tous les timers
  timers.forEach(timerId => clearTimeout(timerId))
  timers.clear()
  
  toasts.value = []
}

// Méthodes de commodité
const showSuccess = (message: string, options?: Partial<Toast>) => {
  return addToast({ type: 'success', message, ...options })
}

const showError = (message: string, options?: Partial<Toast>) => {
  return addToast({ type: 'error', message, persistent: true, ...options })
}

const showWarning = (message: string, options?: Partial<Toast>) => {
  return addToast({ type: 'warning', message, ...options })
}

const showInfo = (message: string, options?: Partial<Toast>) => {
  return addToast({ type: 'info', message, ...options })
}

// Cleanup
onUnmounted(() => {
  clearAllToasts()
})

// Exposer les méthodes
defineExpose({
  addToast,
  removeToast,
  clearAllToasts,
  showSuccess,
  showError,
  showWarning,
  showInfo
})
</script>

<style scoped>
.toast-container {
  @apply fixed top-4 right-4 z-50 space-y-2;
  @apply max-w-sm w-full;
}

.toast-list {
  @apply space-y-2;
}

.toast {
  @apply relative flex items-start gap-3 p-4 rounded-lg shadow-lg;
  @apply bg-base-100 border border-base-300;
  @apply transition-all duration-300;
  min-width: 300px;
}

.toast--success {
  @apply border-success bg-success bg-opacity-10 text-success;
}

.toast--error {
  @apply border-error bg-error bg-opacity-10 text-error;
}

.toast--warning {
  @apply border-warning bg-warning bg-opacity-10 text-warning;
}

.toast--info {
  @apply border-info bg-info bg-opacity-10 text-info;
}

.toast__icon {
  @apply flex-shrink-0 mt-0.5;
}

.toast__content {
  @apply flex-1 min-w-0;
}

.toast__title {
  @apply font-semibold text-sm mb-1;
}

.toast__message {
  @apply text-sm opacity-90;
}

.toast__actions {
  @apply flex gap-2 mt-2;
}

.toast__action {
  @apply px-3 py-1 text-xs font-medium rounded;
  @apply bg-current bg-opacity-20 hover:bg-opacity-30;
  @apply transition-colors duration-200;
  @apply focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2;
}

.toast__close {
  @apply flex-shrink-0 p-1 rounded;
  @apply hover:bg-current hover:bg-opacity-20;
  @apply transition-colors duration-200;
  @apply focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2;
}

.toast__progress {
  @apply absolute bottom-0 left-0 h-1 bg-current bg-opacity-40;
  @apply rounded-bl-lg;
  animation: toast-progress linear forwards;
}

/* Animations */
.toast-enter-active,
.toast-leave-active {
  @apply transition-all duration-300;
}

.toast-enter-from {
  @apply transform translate-x-full opacity-0;
}

.toast-leave-to {
  @apply transform translate-x-full opacity-0;
}

.toast-move {
  @apply transition-transform duration-300;
}

@keyframes toast-progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* Responsive */
@media (max-width: 640px) {
  .toast-container {
    @apply top-2 right-2 left-2 max-w-none;
  }
  
  .toast {
    min-width: auto;
  }
}

/* Mode sombre */
@media (prefers-color-scheme: dark) {
  .toast {
    @apply bg-base-200 border-base-600;
  }
}</style>
