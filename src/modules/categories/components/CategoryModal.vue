<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('close')"></div>
    
    <!-- Modal -->
    <div class="relative bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-700">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-green-500/20 rounded-lg">
            <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-1.414.586H7a4 4 0 01-4-4V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-white">
            {{ category ? 'Modifier la catégorie' : 'Nouvelle catégorie' }}
          </h3>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="save" class="p-6 space-y-6">
        <!-- Nom -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-300">
            Nom de la catégorie *
          </label>
          <div class="relative">
            <input
              v-model="form.name"
              type="text"
              required
              maxlength="100"
              placeholder="Ex: Électronique, Vêtements..."
              :class="[
                'w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:ring-2 transition-all',
                categoryStore.error?.field === 'name' 
                  ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' 
                  : 'border-gray-600/50 focus:ring-green-500/50 focus:border-green-500/50'
              ]"
            />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg v-if="categoryStore.error?.field === 'name'" class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-1.414.586H7a4 4 0 01-4-4V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
          <div class="flex justify-between text-xs text-gray-500">
            <span v-if="categoryStore.error?.field === 'name'" class="text-red-400">{{ categoryStore.error.message }}</span>
            <span class="ml-auto">{{ form.name.length }}/100</span>
          </div>
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-300">
            Description
          </label>
          <textarea
            v-model="form.description"
            rows="4"
            maxlength="500"
            placeholder="Décrivez cette catégorie..."
            :class="[
              'w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:ring-2 transition-all resize-none',
              categoryStore.error?.field === 'description' 
                ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' 
                : 'border-gray-600/50 focus:ring-green-500/50 focus:border-green-500/50'
            ]"
          ></textarea>
          <div class="flex justify-between text-xs text-gray-500">
            <span v-if="categoryStore.error?.field === 'description'" class="text-red-400">{{ categoryStore.error.message }}</span>
            <span v-else>Optionnel - Aidez vos utilisateurs à comprendre cette catégorie</span>
            <span class="ml-auto">{{ (form.description || '').length }}/500</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            :disabled="categoryStore.loading"
            class="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white border border-gray-600 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
          <button
            type="submit"
            :disabled="categoryStore.loading || !form.name.trim()"
            class="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="categoryStore.loading" class="loading loading-spinner loading-sm"></span>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ category ? 'Modifier' : 'Créer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from 'vue';
import { useCategoryStore } from '../stores/categoryStore';
import type { Category, CreateCategoryInput } from '../types';

const props = defineProps<{ category: Category | null }>()
const emit = defineEmits(['close', 'saved'])
const categoryStore = useCategoryStore()

const form = ref<CreateCategoryInput>({
  name: '',
  description: ''
})

watch(
  () => props.category,
  (cat) => {
    if (cat) {
      form.value = { name: cat.name ?? '', description: cat.description ?? '' }
    } else {
      form.value = { name: '', description: '' }
    }
    // Nettoyer les erreurs lors de l'ouverture/changement de catégorie
    categoryStore.clearError()
  },
  { immediate: true }
)

async function save() {
  categoryStore.clearError()
  
  let result
  if (props.category) {
    result = await categoryStore.updateCategory(props.category.id, form.value)
  } else {
    result = await categoryStore.createCategory(form.value)
  }
  
  // Si succès, fermer le modal
  if (result) {
    emit('saved')
    emit('close')
  }
  // Sinon les erreurs seront affichées automatiquement par CategoryErrorAlert
}
</script>
