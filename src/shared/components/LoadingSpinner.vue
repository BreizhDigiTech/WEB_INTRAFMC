<template>
  <div class="loading-spinner" :class="{ 'loading-overlay': overlay }">
    <div class="spinner" :style="{ width: size, height: size }">
      <div class="spinner-circle"></div>
    </div>
    <p v-if="message" class="loading-message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: string
  message?: string
  overlay?: boolean
}

withDefaults(defineProps<Props>(), {
  size: '40px',
  message: '',
  overlay: false
})
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 9999;
}

.spinner {
  position: relative;
  animation: spin 1s linear infinite;
}

.spinner-circle {
  width: 100%;
  height: 100%;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--color-primary, #74b9ff);
  border-radius: 50%;
}

.loading-message {
  margin-top: 1rem;
  color: var(--color-text-light, #6c757d);
  font-size: 0.9rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
