<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-white mb-6">Catégories</h1>
    <div class="mb-4 flex gap-2">
      <button class="btn btn-primary" @click="openCreateModal">Nouvelle catégorie</button>
    </div>
    <div v-if="categoryStore.loading" class="text-gray-400">Chargement...</div>
    <div v-else>
      <table class="table w-full bg-gray-800 border border-gray-700 rounded-lg">
        <thead>
          <tr class="text-gray-400">
            <th>Nom</th>
            <th>Description</th>
            <th>Date de création</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categoryStore.categories" :key="cat.id" class="text-gray-200">
            <td>{{ cat.name }}</td>
            <td>{{ cat.description }}</td>
            <td>{{ cat.created_at ? new Date(cat.created_at).toLocaleDateString('fr-FR') : '' }}</td>
            <td class="flex gap-2">
              <button class="btn btn-xs btn-info" @click="openEditModal(cat)">Modifier</button>
              <button class="btn btn-xs btn-error" @click="deleteCategory(cat.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <CategoryModal
      v-if="showModal"
      :category="editingCategory"
      @close="closeModal"
      @saved="onCategorySaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCategoryStore } from '../stores/categoryStore'
import CategoryModal from '../components/CategoryModal.vue'
import type { Category } from '../types'

const categoryStore = useCategoryStore()
const showModal = ref(false)
const editingCategory = ref<Category | null>(null)

onMounted(() => {
  categoryStore.fetchCategories()
})

function openCreateModal() {
  editingCategory.value = null
  showModal.value = true
}
function openEditModal(cat: Category) {
  editingCategory.value = cat
  showModal.value = true
}
function closeModal() {
  showModal.value = false
}
async function onCategorySaved() {
  showModal.value = false
  await categoryStore.fetchCategories()
}
async function deleteCategory(id: string) {
  if (confirm('Supprimer cette catégorie ?')) {
    await categoryStore.deleteCategory(id)
  }
}
</script>
