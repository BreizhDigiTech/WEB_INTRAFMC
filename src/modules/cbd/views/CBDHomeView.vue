<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Module CBD</h1>
      <p class="text-gray-600">Gestion complète de vos produits et commandes CBD</p>
    </div>

    <!-- Navigation sous-modules -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <router-link
        to="/cbd/products"
        class="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
      >
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">Gestion des produits</h3>
            <p class="text-sm text-gray-500">CRUD produits, stock, catégories</p>
          </div>
        </div>
      </router-link>

      <router-link
        to="/cbd/orders"
        class="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
      >
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Gestion des commandes</h3>
            <p class="text-sm text-gray-500">Suivi et traitement</p>
          </div>
        </div>
      </router-link>

      <router-link
        to="/cbd/arrivals"
        class="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
      >
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">Gestion des arrivages</h3>
            <p class="text-sm text-gray-500">Réception et inventaire</p>
          </div>
        </div>
      </router-link>
    </div>

    <!-- Aperçu rapide -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">Aperçu rapide</h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Derniers produits -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Derniers produits ajoutés</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-center py-8 text-gray-500">
              <div class="text-center">
                <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p>Aucun produit récent</p>
                <router-link to="/cbd/products" class="text-blue-600 hover:text-blue-500 text-sm">
                  Ajouter un produit
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Suivi des 3 dernières commandes -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Suivi des dernières commandes</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-center py-8 text-gray-500">
              <div class="text-center">
                <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p>Aucune commande récente</p>
                <router-link to="/cbd/orders" class="text-blue-600 hover:text-blue-500 text-sm">
                  Voir les commandes
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action rapide - Catalogue -->
    <div class="mt-8">
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-semibold mb-2">Passer une commande</h3>
            <p class="text-blue-100">Accédez au catalogue e-commerce pour commander des produits</p>
          </div>
          <button
            @click="goToCatalog"
            class="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Ouvrir le catalogue
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const goToCatalog = () => {
  // TODO: Redirection vers le site e-commerce
  window.open('https://catalogue.exemple.com', '_blank')
}
</script>
