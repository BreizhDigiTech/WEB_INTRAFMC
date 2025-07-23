<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" :class="sizeClass">
      <header class="modal-header">
        <h3 class="modal-title">{{ title }}</h3>
        <button @click="$emit('close')" class="modal-close" aria-label="Fermer">
          ×
        </button>
      </header>
      
      <main class="modal-body">
        <slot></slot>
      </main>
      
      <footer v-if="$slots.footer" class="modal-footer">
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  size?: 'small' | 'medium' | 'large'
  closeOnOverlay?: boolean
}

interface Emits {
  close: []
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  closeOnOverlay: true
})

const emit = defineEmits<Emits>()

const sizeClass = computed(() => `modal-${props.size}`)

const handleOverlayClick = (event: Event) => {
  if (props.closeOnOverlay && event.target === event.currentTarget) {
    emit('close')
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: var(--border-radius, 8px);
  box-shadow: var(--shadow-lg, 0 4px 8px rgba(0, 0, 0, 0.15));
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-small { width: 100%; max-width: 400px; }
.modal-medium { width: 100%; max-width: 600px; }
.modal-large { width: 100%; max-width: 800px; }

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border, #dee2e6);
}

.modal-title {
  margin: 0;
  color: var(--color-text, #2c3e50);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-text-light, #6c757d);
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.modal-close:hover {
  background-color: var(--color-background, #f8f9fa);
}

.modal-body {
  padding: 1.5rem;
  flex: 1;
  overflow-y: auto;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--color-border, #dee2e6);
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
</style>
