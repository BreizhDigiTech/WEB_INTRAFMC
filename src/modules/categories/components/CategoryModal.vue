<template>
  <dialog open class="modal modal-open">
    <div class="modal-box bg-gray-800 border border-gray-700">
      <h3 class="font-bold text-lg text-white mb-4">
        {{ category ? 'Modifier la catégorie' : 'Nouvelle catégorie' }}
      </h3>
      <form @submit.prevent="save">
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text text-gray-300">Nom</span>
          </label>
          <input v-model="form.name" type="text" class="input input-bordered bg-gray-700 border-gray-600 text-white" required />
        </div>
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text text-gray-300">Description</span>
          </label>
          <textarea v-model="form.description" class="textarea textarea-bordered bg-gray-700 border-gray-600 text-white" />
        </div>
        <div class="modal-action">
          <button type="submit" class="btn btn-primary">Enregistrer</button>
          <button type="button" class="btn btn-ghost" @click="$emit('close')">Annuler</button>
        </div>
      </form>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from 'vue'
import { useCategoryStore } from '../stores/categoryStore'
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '../types'

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
  },
  { immediate: true }
)

async function save() {
  if (props.category) {
    await categoryStore.updateCategory(props.category.id, form.value)
  } else {
    await categoryStore.createCategory(form.value)
  }
  emit('saved')
}
</script>
