import { defineStore } from 'pinia'
import { ref } from 'vue'
import { categoryService } from '../services/categoryService'
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '../types'

export const useCategoryStore = defineStore('category', () => {
    const categories = ref<Category[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)
    const currentCategory = ref<Category | null>(null)

    async function fetchCategories() {
        loading.value = true
        error.value = null
        try {
            categories.value = await categoryService.getCategories()
        } catch (err: any) {
            error.value = err.message || 'Erreur lors du chargement des catégories'
        } finally {
            loading.value = false
        }
    }

    async function fetchCategory(id: string) {
        loading.value = true
        error.value = null
        try {
            currentCategory.value = await categoryService.getCategory(id)
        } catch (err: any) {
            error.value = err.message || 'Erreur lors du chargement de la catégorie'
        } finally {
            loading.value = false
        }
    }

    async function createCategory(input: CreateCategoryInput) {
        loading.value = true
        error.value = null
        try {
            const cat = await categoryService.createCategory(input)
            categories.value.push(cat)
            return cat
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la création de la catégorie'
            throw err
        } finally {
            loading.value = false
        }
    }

    async function updateCategory(id: string, input: UpdateCategoryInput) {
        loading.value = true
        error.value = null
        try {
            const cat = await categoryService.updateCategory(id, input)
            const idx = categories.value.findIndex(c => c.id === id)
            if (idx !== -1) categories.value[idx] = cat
            return cat
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la modification de la catégorie'
            throw err
        } finally {
            loading.value = false
        }
    }

    async function deleteCategory(id: string) {
        loading.value = true
        error.value = null
        try {
            await categoryService.deleteCategory(id)
            categories.value = categories.value.filter(c => c.id !== id)
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la suppression de la catégorie'
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        categories,
        loading,
        error,
        currentCategory,
        fetchCategories,
        fetchCategory,
        createCategory,
        updateCategory,
        deleteCategory
    }
})
