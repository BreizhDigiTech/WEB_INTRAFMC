<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Gestion des produits</h1>
          <p class="text-gray-600">Gérez votre catalogue de produits CBD</p>
        </div>
        <button
          @click="showCreateModal = true"
          class="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-500 transition-colors"
        >
          Ajouter un produit
        </button>
      </div>
    </div>

    <!-- Filtres et recherche -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
          <input
            v-model="search"
            type="text"
            placeholder="Rechercher un produit..."
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
          <select v-model="selectedCategory" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Toutes les catégories</option>
            <option value="huiles">Huiles</option>
            <option value="fleurs">Fleurs</option>
            <option value="resine">Résine</option>
            <option value="gummies">Gummies</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Disponibilité</label>
          <select v-model="selectedAvailability" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tous</option>
            <option value="in_stock">En stock</option>
            <option value="low_stock">Stock faible</option>
            <option value="out_of_stock">Rupture</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="resetFilters"
            class="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>

    <!-- Liste des produits -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Produits ({{ filteredProducts.length }})</h2>
      </div>
      
      <div v-if="filteredProducts.length === 0" class="p-12 text-center">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <p class="text-gray-500 mb-4">Aucun produit trouvé</p>
        <button
          @click="showCreateModal = true"
          class="text-blue-600 hover:text-blue-500"
        >
          Ajouter votre premier produit
        </button>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in filteredProducts" :key="product.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span class="text-xs font-medium text-gray-600">{{ product.name.charAt(0) }}</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                    <div class="text-sm text-gray-500">{{ product.sku }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                  {{ product.category }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatCurrency(product.price) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ product.stock }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStockStatusClass(product.stock)">
                  {{ getStockStatusText(product.stock) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click="editProduct(product)"
                    class="text-blue-600 hover:text-blue-500"
                  >
                    Modifier
                  </button>
                  <button
                    @click="deleteProduct(product.id)"
                    class="text-red-600 hover:text-red-500"
                  >
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de création/édition -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          {{ editingProduct ? 'Modifier le produit' : 'Nouveau produit' }}
        </h3>
        <form @submit.prevent="saveProduct">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input
                v-model="form.sku"
                type="text"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                v-model="form.category"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner une catégorie</option>
                <option value="huiles">Huiles</option>
                <option value="fleurs">Fleurs</option>
                <option value="resine">Résine</option>
                <option value="gummies">Gummies</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
              <input
                v-model.number="form.price"
                type="number"
                step="0.01"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                v-model.number="form.stock"
                type="number"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
            >
              {{ editingProduct ? 'Modifier' : 'Créer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatCurrency } from '@/shared/utils'

interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
}

// États
const showCreateModal = ref(false)
const editingProduct = ref<Product | null>(null)
const search = ref('')
const selectedCategory = ref('')
const selectedAvailability = ref('')

// Données temporaires
const products = ref<Product[]>([
  {
    id: '1',
    name: 'Huile CBD 10%',
    sku: 'HUI-CBD-010',
    category: 'huiles',
    price: 49.99,
    stock: 25
  },
  {
    id: '2',
    name: 'Fleur Jack Herer',
    sku: 'FLE-JH-001',
    category: 'fleurs',
    price: 8.50,
    stock: 5
  },
  {
    id: '3',
    name: 'Gummies 25mg',
    sku: 'GUM-025',
    category: 'gummies',
    price: 24.99,
    stock: 0
  }
])

// Formulaire
const form = ref({
  name: '',
  sku: '',
  category: '',
  price: 0,
  stock: 0
})

// Produits filtrés
const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.value.toLowerCase()) ||
                         product.sku.toLowerCase().includes(search.value.toLowerCase())
    const matchesCategory = !selectedCategory.value || product.category === selectedCategory.value
    const matchesAvailability = !selectedAvailability.value || 
                               (selectedAvailability.value === 'in_stock' && product.stock > 10) ||
                               (selectedAvailability.value === 'low_stock' && product.stock > 0 && product.stock <= 10) ||
                               (selectedAvailability.value === 'out_of_stock' && product.stock === 0)
    
    return matchesSearch && matchesCategory && matchesAvailability
  })
})

// Méthodes
const getStockStatusClass = (stock: number) => {
  if (stock === 0) return 'px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full'
  if (stock <= 10) return 'px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full'
  return 'px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full'
}

const getStockStatusText = (stock: number) => {
  if (stock === 0) return 'Rupture'
  if (stock <= 10) return 'Stock faible'
  return 'En stock'
}

const editProduct = (product: Product) => {
  editingProduct.value = product
  form.value = { ...product }
  showCreateModal.value = true
}

const saveProduct = () => {
  if (editingProduct.value) {
    const index = products.value.findIndex(p => p.id === editingProduct.value!.id)
    if (index !== -1) {
      products.value[index] = { ...form.value, id: editingProduct.value.id }
    }
  } else {
    const newProduct: Product = {
      ...form.value,
      id: Date.now().toString()
    }
    products.value.push(newProduct)
  }
  closeModal()
}

const deleteProduct = (id: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
    products.value = products.value.filter(p => p.id !== id)
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingProduct.value = null
  form.value = {
    name: '',
    sku: '',
    category: '',
    price: 0,
    stock: 0
  }
}

const resetFilters = () => {
  search.value = ''
  selectedCategory.value = ''
  selectedAvailability.value = ''
}
</script>
