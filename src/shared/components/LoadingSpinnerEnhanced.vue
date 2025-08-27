/**
 * Composant de chargement optimisé et accessible
 */
<template>
  <div 
    v-if="isLoading"
    :class="[
      'loading-spinner',
      `loading-spinner--${size}`,
      `loading-spinner--${variant}`,
      {
        'loading-spinner--overlay': overlay,
        'loading-spinner--fullscreen': fullscreen
      }
    ]"
    role="status"
    :aria-label="loadingText"
    :aria-live="ariaLive"
  >
    <!-- Spinner principal -->
    <div class="loading-spinner__content">
      <div class="loading-spinner__icon" :aria-hidden="true">
        <div class="loading-spinner__circle"></div>
      </div>
      
      <!-- Texte de chargement -->
      <div 
        v-if="showText"
        class="loading-spinner__text"
      >
        {{ loadingText }}
      </div>
      
      <!-- Barre de progression optionnelle -->
      <div 
        v-if="showProgress && progress !== undefined"
        class="loading-spinner__progress"
        role="progressbar"
        :aria-valuenow="progress"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div 
          class="loading-spinner__progress-bar"
          :style="{ width: `${progress}%` }"
        ></div>
        <span class="loading-spinner__progress-text">
          {{ progress }}%
        </span>
      </div>
    </div>
    
    <!-- Bouton d'annulation optionnel -->
    <button
      v-if="cancellable && onCancel"
      @click="onCancel"
      class="loading-spinner__cancel"
      type="button"
      aria-label="Annuler l'opération"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'

interface Props {
  isLoading?: boolean
  size?: 'small' | 'medium' | 'large'
  variant?: 'primary' | 'secondary' | 'accent'
  overlay?: boolean
  fullscreen?: boolean
  text?: string
  showText?: boolean
  showProgress?: boolean
  progress?: number
  cancellable?: boolean
  timeout?: number
  ariaLive?: 'polite' | 'assertive'
}

interface Emits {
  (e: 'cancel'): void
  (e: 'timeout'): void
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: true,
  size: 'medium',
  variant: 'primary',
  overlay: false,
  fullscreen: false,
  text: 'Chargement en cours...',
  showText: true,
  showProgress: false,
  cancellable: false,
  ariaLive: 'polite'
})

const emit = defineEmits<Emits>()

let timeoutId: number | null = null

const loadingText = computed(() => {
  if (props.progress !== undefined && props.showProgress) {
    return `${props.text} (${props.progress}%)`
  }
  return props.text
})

const onCancel = () => {
  emit('cancel')
}

onMounted(() => {
  // Gérer le timeout
  if (props.timeout && props.timeout > 0) {
    timeoutId = window.setTimeout(() => {
      emit('timeout')
    }, props.timeout)
  }
  
  // Empêcher le scroll si fullscreen
  if (props.fullscreen) {
    document.body.style.overflow = 'hidden'
  }
})

onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  
  // Restaurer le scroll
  if (props.fullscreen) {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.loading-spinner {
  @apply flex items-center justify-center;
  
  &--overlay {
    @apply fixed inset-0 bg-black bg-opacity-50 z-50;
  }
  
  &--fullscreen {
    @apply fixed inset-0 bg-base-100 z-50;
  }
}

.loading-spinner__content {
  @apply flex flex-col items-center gap-4 text-center;
}

.loading-spinner__icon {
  @apply relative;
}

.loading-spinner__circle {
  @apply animate-spin rounded-full border-solid border-current opacity-25;
  border-width: 3px;
  border-top-color: transparent;
}

/* Tailles */
.loading-spinner--small .loading-spinner__circle {
  @apply w-6 h-6;
}

.loading-spinner--medium .loading-spinner__circle {
  @apply w-10 h-10;
}

.loading-spinner--large .loading-spinner__circle {
  @apply w-16 h-16;
  border-width: 4px;
}

/* Variants */
.loading-spinner--primary {
  @apply text-primary;
}

.loading-spinner--secondary {
  @apply text-secondary;
}

.loading-spinner--accent {
  @apply text-accent;
}

.loading-spinner__text {
  @apply text-sm font-medium;
}

.loading-spinner--small .loading-spinner__text {
  @apply text-xs;
}

.loading-spinner--large .loading-spinner__text {
  @apply text-base;
}

.loading-spinner__progress {
  @apply w-48 max-w-full;
}

.loading-spinner__progress-bar {
  @apply h-2 bg-current rounded-full transition-all duration-300;
  width: var(--progress, 0%);
}

.loading-spinner__progress-text {
  @apply text-xs mt-1 block;
}

.loading-spinner__cancel {
  @apply absolute top-4 right-4 p-2 rounded-full bg-base-200 hover:bg-base-300 transition-colors;
  @apply focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2;
}

/* Animations */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-spinner__circle {
  animation: spin 1s linear infinite;
}

/* Accessibilité : réduire les animations si préférences utilisateur */
@media (prefers-reduced-motion: reduce) {
  .loading-spinner__circle {
    animation: none;
    border-style: dashed;
  }
}

/* Mode sombre */
@media (prefers-color-scheme: dark) {
  .loading-spinner--overlay {
    @apply bg-gray-900 bg-opacity-75;
  }
}</style>
