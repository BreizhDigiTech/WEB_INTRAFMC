
<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- Chargement -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="loading loading-spinner loading-lg text-blue-500 mb-4"></div>
        <p class="text-gray-400">Chargement du produit...</p>
      </div>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-red-400 mb-2">Erreur</h3>
        <p class="text-gray-400 mb-4">{{ error }}</p>
        <button @click="$router.push('/products')" class="btn btn-primary">
          Retour aux produits
        </button>
      </div>
    </div>

    <!-- Contenu principal -->
    <div v-else-if="product">
      <!-- En-tête -->
      <div class="bg-gradient-to-r from-green-900 via-emerald-900 to-teal-900">
        <div class="container mx-auto px-4 py-8">
          <div class="flex items-center justify-between">
            <!-- Navigation retour et titre -->
            <div class="flex items-center space-x-4">
              <button @click="$router.push('/products')" class="btn btn-ghost btn-circle text-white hover:bg-white/10">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 v-if="!editingField.name" 
                    @dblclick="startEditing('name')"
                    class="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent cursor-pointer hover:bg-white/5 p-2 rounded">
                  {{ product.name }}
                </h1>
                <div v-else class="mb-2">
                  <input v-model="editingValue.name" 
                    @keydown.enter="saveField('name')"
                    @keydown.escape="cancelEdit('name')"
                    @blur="saveField('name')"
                    ref="nameInput"
                    class="text-4xl font-bold bg-transparent text-white border-b-2 border-white/50 focus:border-green-400 outline-none" />
                </div>
                
                <!-- Catégories en haut -->
                <div v-if="productCategories && productCategories.length > 0" 
                  class="flex flex-wrap gap-2 mb-3">
                  <span v-for="category in productCategories" 
                    :key="category.id"
                    class="inline-flex items-center px-2 py-1 bg-blue-500/30 text-blue-300 rounded-md text-xs font-medium border border-blue-400/40">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {{ category.name }}
                  </span>
                </div>
                
                <p class="text-gray-300 text-lg">
                  Détails du produit CBD - Double-cliquez pour modifier
                </p>
              </div>
            </div>

            <!-- Actions rapides -->
            <div class="flex items-center space-x-3">
              <button @click="duplicateProduct" class="btn btn-ghost gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Dupliquer
              </button>
              <button @click="deleteProduct" class="btn btn-error gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenu -->
      <div class="container mx-auto px-4 py-8">
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <!-- Colonne gauche - Images -->
            <div class="lg:col-span-2">
              <div class="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <div class="flex items-center justify-between mb-6">
                  <h2 class="text-2xl font-bold text-white">Images du produit</h2>
                  <button 
                    @click="triggerImageUpload"
                    :disabled="uploadingImages"
                    class="btn btn-sm btn-primary">
                    <svg v-if="!uploadingImages" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <div v-else class="loading loading-spinner loading-xs mr-2"></div>
                    {{ uploadingImages ? 'Upload...' : 'Ajouter des images' }}
                  </button>
                </div>

                <div v-if="product.image_urls && product.image_urls.length > 0" class="space-y-4">
                  <!-- Image principale -->
                  <div 
                    class="aspect-w-16 aspect-h-9 bg-gray-700 rounded-xl overflow-hidden cursor-pointer hover:bg-gray-600 transition-colors relative group"
                    @dblclick="triggerImageUpload"
                    title="Double-cliquez pour ajouter des images">
                    <img :src="selectedImage || getImageUrl(product.image_urls[0])" :alt="product.name"
                      :data-original-path="product.image_urls[0]"
                      class="w-full h-80 object-cover" 
                      @error="onImageError($event)" />
                    
                    <!-- Bouton de suppression pour l'image principale -->
                    <button
                      @click="deleteImage(selectedImage ? product.image_urls.find(img => getImageUrl(img) === selectedImage) || product.image_urls[0] : product.image_urls[0])"
                      :disabled="deletingImage"
                      class="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50"
                      title="Supprimer cette image">
                      <svg v-if="!deletingImage" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <svg v-else class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                    
                    <!-- Overlay avec instruction -->
                    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <div class="text-center text-white">
                        <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <p class="text-sm">Double-cliquez pour ajouter des images</p>
                      </div>
                    </div>
                  </div>

                  <!-- Miniatures -->
                  <div v-if="product.image_urls.length > 1" class="grid grid-cols-4 gap-2">
                    <div v-for="(image, index) in product.image_urls" :key="index" 
                      class="relative group aspect-square bg-gray-700 rounded-lg overflow-hidden border-2 transition-colors"
                      :class="{ 'border-green-500': selectedImage === getImageUrl(image) || (!selectedImage && index === 0), 'border-gray-600': selectedImage !== getImageUrl(image) && (selectedImage || index !== 0) }">
                      
                      <button @click="selectedImage = getImageUrl(image)"
                        class="w-full h-full block">
                        <img :src="getImageUrl(image)" :alt="`${product.name} ${index + 1}`" 
                          :data-original-path="image"
                          class="w-full h-full object-cover" 
                          @error="onImageError($event)" />
                      </button>
                      
                      <!-- Bouton de suppression -->
                      <button
                        @click="deleteImage(image)"
                        :disabled="deletingImage"
                        class="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50"
                        title="Supprimer cette image">
                        <svg v-if="!deletingImage" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <svg v-else class="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div v-else 
                  class="text-center py-12 cursor-pointer hover:bg-gray-700/50 rounded-xl transition-colors"
                  @dblclick="triggerImageUpload"
                  title="Double-cliquez pour ajouter des images">
                  <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p class="text-gray-400 mb-2">Aucune image disponible</p>
                  <p class="text-sm text-gray-500">Double-cliquez pour ajouter des images</p>
                </div>

                <!-- Input file caché -->
                <input 
                  ref="imageInput"
                  type="file" 
                  multiple 
                  accept="image/*"
                  @change="handleImageUpload"
                  class="hidden" />
              </div>

              <!-- Description éditable -->
              <div class="bg-gray-800 rounded-2xl p-6 border border-gray-700 mt-6">
                <h2 class="text-2xl font-bold text-white mb-4">Description</h2>
                <div v-if="!editingField.description" 
                  @dblclick="startEditing('description')"
                  class="text-gray-300 leading-relaxed cursor-pointer hover:bg-gray-700/50 p-3 rounded min-h-[100px]">
                  <p v-if="product.description">{{ product.description }}</p>
                  <p v-else class="text-gray-500 italic">Aucune description disponible - Double-cliquez pour ajouter</p>
                </div>
                <div v-else class="space-y-3">
                  <textarea v-model="editingValue.description" 
                    @keydown.enter.ctrl="saveField('description')"
                    @keydown.escape="cancelEdit('description')"
                    @blur="saveField('description')"
                    ref="descriptionInput"
                    class="w-full min-h-[100px] p-3 bg-gray-700 border border-gray-600 rounded text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="Saisissez une description..."></textarea>
                  <div class="flex items-center space-x-2 text-sm text-gray-400">
                    <span>Ctrl+Entrée pour sauvegarder, Échap pour annuler</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Colonne droite - Informations -->
            <div class="space-y-6">

              <!-- Informations principales -->
              <div class="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <h2 class="text-2xl font-bold text-white mb-6">Informations</h2>

                <div class="space-y-4">
                  <!-- Prix éditable -->
                  <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <span class="text-gray-300">Prix</span>
                    <div v-if="!editingField.price" 
                      @dblclick="startEditing('price')"
                      class="text-2xl font-bold text-green-400 cursor-pointer hover:bg-gray-600/50 p-1 rounded">
                      {{ formatPrice(product.price) }}€
                    </div>
                    <div v-else>
                      <input v-model="editingValue.price" 
                        type="number" 
                        step="0.01"
                        @keydown.enter="saveField('price')"
                        @keydown.escape="cancelEdit('price')"
                        @blur="saveField('price')"
                        ref="priceInput"
                        class="text-right text-2xl font-bold bg-gray-600 text-green-400 border border-gray-500 rounded px-2 py-1 w-24" />
                    </div>
                  </div>

                  <!-- Stock (lecture seule) -->
                  <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <span class="text-gray-300">Stock</span>
                    <div class="font-bold flex items-center space-x-2"
                      :class="getStockColorClass(product.stock)">
                      <span>{{ product.stock }} unités</span>
                      <div v-if="product.stock < 30" class="badge badge-warning badge-sm">
                        Stock faible
                      </div>
                    </div>
                  </div>

                  <!-- Catégories du produit -->
                  <div class="p-4 bg-gray-700 rounded-lg">
                    <div class="flex items-center justify-between mb-3">
                      <span class="text-gray-300 font-medium">Catégorie(s)</span>
                    </div>
                    
                    <div>
                      <!-- Affichage de toutes les catégories -->
                      <div v-if="productCategories.length > 0" 
                        class="flex flex-wrap gap-2 mb-3">
                        <div v-for="category in productCategories" 
                          :key="category.id"
                          class="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30 group relative">
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          {{ category.name }}
                          
                          <!-- Bouton pour retirer la liaison -->
                          <button 
                            @click="removeCategoryFromProduct(category.id)"
                            class="ml-1 text-red-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Retirer cette catégorie du produit">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <!-- Interface d'ajout - Design amélioré -->
                      <div class="space-y-3">
                        <!-- Section d'ajout avec toggle -->
                        <div v-if="!showCategorySelector" class="flex items-center justify-between">
                          <span v-if="productCategories.length === 0" class="flex items-center text-gray-500 italic">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
                            </svg>
                            Aucune catégorie assignée
                          </span>
                          <button 
                            @click="openCategorySelector"
                            v-if="availableCategoriesForAdd.length > 0"
                            class="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-500 text-gray-300 hover:text-white rounded-lg transition-all duration-200 border-2 border-dashed border-gray-500 hover:border-blue-400">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span class="text-sm font-medium">Ajouter une catégorie</span>
                          </button>
                        </div>
                        
                        <!-- Sélecteur de catégories avec recherche en temps réel -->
                        <div v-if="showCategorySelector" class="bg-gray-600/50 rounded-lg p-4 border border-gray-500">
                          <div class="flex items-center justify-between mb-3">
                            <h4 class="text-sm font-medium text-gray-300">Rechercher et ajouter une catégorie</h4>
                            <button 
                              @click="closeCategorySelector"
                              class="text-gray-400 hover:text-gray-300 transition-colors">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          
                          <!-- Barre de recherche -->
                          <div class="relative mb-4">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </div>
                            <input
                              v-model="categorySearchQuery"
                              ref="categorySearchInput"
                              type="text"
                              placeholder="Tapez pour rechercher une catégorie..."
                              class="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-500 rounded-lg text-gray-300 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                            />
                            <div v-if="categorySearchQuery" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <button 
                                @click="clearCategorySearch"
                                class="text-gray-400 hover:text-gray-300 transition-colors">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          
                          <!-- Résultats de recherche en temps réel -->
                          <div v-if="categorySearchQuery && filteredCategories.length > 0" class="space-y-2">
                            <div class="flex flex-wrap gap-2">
                              <button
                                v-for="category in filteredCategories"
                                :key="category.id"
                                @click="addSpecificCategoryToProduct(category.id)"
                                class="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30 hover:bg-green-500/30 hover:border-green-400 transition-all duration-200 cursor-pointer">
                                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                {{ category.name }}
                              </button>
                            </div>
                          </div>
                          
                          <!-- États de la recherche -->
                          <div v-else-if="categorySearchQuery && filteredCategories.length === 0" class="text-center py-4">
                            <div class="text-gray-500 italic mb-2">
                              <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                              Aucune catégorie trouvée pour "{{ categorySearchQuery }}"
                            </div>
                          </div>
                          
                          <!-- État initial (pas de recherche) -->
                          <div v-else-if="!categorySearchQuery" class="text-center py-6">
                            <div class="text-gray-400 italic">
                              <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                              Commencez à taper pour rechercher des catégories
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- ID Produit -->
                  <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <span class="text-gray-300">ID Produit</span>
                    <span class="text-gray-400 font-mono">#{{ product.id }}</span>
                  </div>

                  <!-- Dates -->
                  <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <span class="text-gray-300">Créé le</span>
                    <span class="text-gray-400">{{ formatDate(product.created_at || '') }}</span>
                  </div>

                  <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <span class="text-gray-300">Modifié le</span>
                    <span class="text-gray-400">{{ formatDate(product.updated_at || '') }}</span>
                  </div>
                </div>
              </div>

              <!-- Certificat d'analyse -->
              <div class="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <div class="flex items-center justify-between mb-4">
                  <h2 class="text-2xl font-bold text-white">Certificat d'analyse</h2>
                  <button 
                    v-if="!product.analysis_file_url"
                    @click="triggerAnalysisUpload"
                    :disabled="uploadingAnalysis"
                    class="btn btn-sm btn-purple">
                    <svg v-if="!uploadingAnalysis" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <div v-else class="loading loading-spinner loading-xs mr-2"></div>
                    {{ uploadingAnalysis ? 'Upload...' : 'Ajouter un certificat' }}
                  </button>
                </div>

                <!-- Si un fichier existe -->
                <div v-if="product.analysis_file_url" class="space-y-3">
                  <a :href="product.analysis_file_url" target="_blank"
                    class="flex items-center space-x-3 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg hover:bg-purple-500/20 transition-colors">
                    <div class="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="text-white font-medium">Voir le certificat</p>
                      <p class="text-sm text-gray-400">Ouvrir dans un nouvel onglet</p>
                    </div>
                    <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  
                  <!-- Actions sur le fichier existant -->
                  <div class="flex items-center space-x-2">
                    <button 
                      @click="triggerAnalysisUpload"
                      :disabled="uploadingAnalysis"
                      class="btn btn-sm btn-ghost text-purple-400 hover:bg-purple-500/20">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Remplacer
                    </button>
                    <button 
                      @click="removeAnalysisFile"
                      class="btn btn-sm btn-ghost text-red-400 hover:bg-red-500/20">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Supprimer
                    </button>
                  </div>
                </div>

                <!-- Si aucun fichier -->
                <div v-else 
                  class="text-center py-8 cursor-pointer hover:bg-gray-700/50 rounded-xl transition-colors"
                  @click="triggerAnalysisUpload"
                  title="Cliquez pour ajouter un certificat d'analyse">
                  <div class="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p class="text-gray-400 mb-2">Aucun certificat d'analyse</p>
                  <p class="text-sm text-gray-500">Cliquez pour ajouter un fichier PDF</p>
                </div>

                <!-- Input file caché pour le certificat -->
                <input 
                  ref="analysisInput"
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  @change="handleAnalysisUpload"
                  class="hidden" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useErrorStore } from '@/shared/errors/errorStore'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCategoryStore } from '../../categories/stores/categoryStore'
import { useProductStore } from '../stores/productStore'
import type { Product } from '../types'

// Router et stores
const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const categoryStore = useCategoryStore()
const errorStore = useErrorStore()

// État local
const loading = ref(true)
const error = ref('')
const product = ref<Product | null>(null)
const selectedImage = ref('')
const availableCategories = ref<Array<{id: string, name: string}>>([])

// Variables pour la gestion des catégories multiples
const selectedCategoryToAdd = ref('')
const showCategorySelector = ref(false)
const categorySearchQuery = ref('')

// Ref pour l'input de recherche
const categorySearchInput = ref<HTMLInputElement>()

// Computed pour récupérer les catégories du produit
const productCategories = computed(() => {
  if (!product.value) return []
  
  // Si les catégories sont directement disponibles dans le produit
  if (product.value.categories && Array.isArray(product.value.categories) && product.value.categories.length > 0) {
    return product.value.categories
  }
  
  // Sinon, essayer de récupérer la catégorie depuis le category_id et le store
  if (product.value.category_id && availableCategories.value.length > 0) {
    const category = availableCategories.value.find(cat => cat.id === product.value?.category_id?.toString())
    return category ? [category] : []
  }
  
  return []
})

// Computed pour les catégories disponibles à ajouter (celles qui ne sont pas déjà assignées)
const availableCategoriesForAdd = computed(() => {
  if (!availableCategories.value) return []
  
  const assignedCategoryIds = productCategories.value.map(cat => cat.id)
  return availableCategories.value.filter(cat => !assignedCategoryIds.includes(cat.id))
})

// Computed pour filtrer les catégories selon la recherche en temps réel
const filteredCategories = computed(() => {
  if (!categorySearchQuery.value.trim()) return []
  
  const query = categorySearchQuery.value.toLowerCase().trim()
  return availableCategoriesForAdd.value.filter(category => 
    category.name.toLowerCase().includes(query)
  )
})

// État pour l'upload d'images
const uploadingImages = ref(false)
const deletingImage = ref(false)
const imageInput = ref<HTMLInputElement>()

// État pour l'upload de fichier d'analyse
const uploadingAnalysis = ref(false)
const analysisInput = ref<HTMLInputElement>()

// État d'édition inline
const editingField = ref<Record<string, boolean>>({
  name: false,
  description: false,
  price: false,
  category: false
})

const editingValue = ref<Record<string, any>>({
  name: '',
  description: '',
  price: 0,
  category: ''
})

// Refs pour les inputs
const nameInput = ref<HTMLInputElement>()
const descriptionInput = ref<HTMLTextAreaElement>()
const priceInput = ref<HTMLInputElement>()

// Méthodes utilitaires pour le formatage
const formatPrice = (price: number): string => {
  return price.toFixed(2)
}

const formatDate = (dateString: string): string => {
  if (!dateString) return 'Non défini'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Méthodes utilitaires pour le stock
const getStockColorClass = (stock: number): string => {
  if (stock === 0) return 'text-red-400'
  if (stock < 10) return 'text-yellow-400'
  return 'text-green-400'
}

// Méthodes d'édition inline
const startEditing = async (field: string) => {
  if (!product.value) return
  
  // Mettre la valeur actuelle dans editingValue
  if (field === 'category') {
    // Pour les catégories, utiliser l'ID de la première catégorie ou chaîne vide
    editingValue.value[field] = productCategories.value.length > 0 
      ? productCategories.value[0].id 
      : ''
  } else {
    editingValue.value[field] = product.value[field as keyof Product]
  }
  
  // Activer le mode édition
  editingField.value[field] = true
  
  // Focus sur l'input après le prochain tick
  await nextTick()
  const inputRef = getInputRef(field)
  if (inputRef) {
    inputRef.focus()
    if (inputRef instanceof HTMLInputElement || inputRef instanceof HTMLTextAreaElement) {
      inputRef.select()
    }
  }
}

const getInputRef = (field: string) => {
  switch (field) {
    case 'name': return nameInput.value
    case 'description': return descriptionInput.value
    case 'price': return priceInput.value
    default: return null
  }
}

const saveField = async (field: string) => {
  if (!product.value || !editingField.value[field]) return
  
  try {
    const newValue = editingValue.value[field]
    
    // Validation simple
    if (field === 'name' && (!newValue || newValue.trim() === '')) {
      errorStore.addError('Le nom du produit ne peut pas être vide')
      return
    }
    
    if ((field === 'price') && (isNaN(newValue) || newValue < 0)) {
      errorStore.addError(`La valeur de prix doit être un nombre positif`)
      return
    }
    
    // Préparer les données de mise à jour
    const updateData: any = {}
    
    if (field === 'price') {
      updateData[field] = parseFloat(newValue)
    } else if (field === 'category') {
      // Gestion des catégories selon la nouvelle API
      if (newValue === '' || newValue === null || newValue === undefined) {
        updateData.category_id = null
      } else {
        // Convertir en string car l'API attend des ID en string maintenant
        updateData.category_id = newValue.toString()
      }
    } else {
      updateData[field] = newValue
    }
    
    // Appeler l'API de mise à jour
    await productStore.updateProduct(product.value.id, updateData)
    
    // Mettre à jour la valeur locale selon le champ
    if (field === 'category') {
      // Recharger le produit pour avoir les catégories mises à jour
      await loadProduct()
    } else {
      ;(product.value as any)[field] = updateData[field]
    }
    
    // Désactiver le mode édition
    editingField.value[field] = false
    
    // Afficher un message de succès
    const fieldNames: Record<string, string> = {
      name: 'Nom',
      description: 'Description', 
      price: 'Prix',
      category: 'Catégorie'
    }
    errorStore.addSuccess(`${fieldNames[field]} mis à jour avec succès`)
    
  } catch (err: any) {
    errorStore.addError(`Erreur lors de la mise à jour: ${err.message || 'Erreur inconnue'}`)
  }
}

const cancelEdit = (field: string) => {
  editingField.value[field] = false
  editingValue.value[field] = ''
}

// Actions rapides
const duplicateProduct = async () => {
  if (!product.value) return
  
  try {
    const duplicateData = {
      name: `${product.value.name} (copie)`,
      description: product.value.description,
      price: product.value.price,
      stock: 0, // Nouveau produit avec stock à 0
      category_id: product.value.categories && product.value.categories.length > 0 
        ? product.value.categories[0].id 
        : undefined,
      image_urls: product.value.image_urls
    }
    
    const newProduct = await productStore.createProduct(duplicateData)
    errorStore.addSuccess('Produit dupliqué avec succès')
    router.push(`/products/${newProduct.id}`)
  } catch (err: any) {
    errorStore.addError(`Erreur lors de la duplication: ${err.message}`)
  }
}

const deleteProduct = async () => {
  if (!product.value) return
  
  const confirmed = confirm(`Êtes-vous sûr de vouloir supprimer le produit "${product.value.name}" ?\n\nCette action est irréversible.`)
  if (!confirmed) return
  
  try {
    await productStore.deleteProduct(product.value.id)
    errorStore.addSuccess('Produit supprimé avec succès')
    router.push('/products')
  } catch (err: any) {
    errorStore.addError(`Erreur lors de la suppression: ${err.message}`)
  }
}

// Retirer une catégorie du produit (suppression de la liaison uniquement)
const removeCategoryFromProduct = async (categoryId: string) => {
  if (!product.value) return
  
  try {
    // Récupérer les IDs des catégories actuelles
    const currentCategoryIds = productCategories.value.map(cat => cat.id)
    
    // Retirer la catégorie spécifique de la liste
    const updatedCategoryIds = currentCategoryIds.filter(id => id !== categoryId)
    
    // Mettre à jour le produit avec les nouvelles catégories
    if (updatedCategoryIds.length > 0) {
      // S'il reste des catégories, les mettre à jour
      await productStore.updateProduct(product.value.id, { 
        category_ids: updatedCategoryIds 
      })
    } else {
      // S'il n'y a plus de catégories, mettre category_id à null
      await productStore.updateProduct(product.value.id, { 
        category_id: null,
        category_ids: []
      })
    }
    
    // Recharger le produit pour avoir les catégories mises à jour
    await loadProduct()
    
    errorStore.addSuccess('Catégorie retirée du produit')
  } catch (err: any) {
    errorStore.addError(`Erreur: ${err.message}`)
  }
}

// Ajouter une catégorie au produit
const _addCategoryToProduct = async () => {
  if (!product.value || !selectedCategoryToAdd.value) return
  
  try {
    // Récupérer les IDs des catégories actuelles
    const currentCategoryIds = productCategories.value.map(cat => cat.id)
    
    // Ajouter la nouvelle catégorie
    const updatedCategoryIds = [...currentCategoryIds, selectedCategoryToAdd.value]
    
    // Mettre à jour le produit avec les nouvelles catégories
    await productStore.updateProduct(product.value.id, { 
      category_ids: updatedCategoryIds,
      category_id: updatedCategoryIds[0] // Le premier comme catégorie principale
    })
    
    // Recharger le produit pour avoir les catégories mises à jour
    await loadProduct()
    
    // Réinitialiser la sélection
    selectedCategoryToAdd.value = ''
    
    errorStore.addSuccess('Catégorie ajoutée au produit')
  } catch (err: any) {
    errorStore.addError(`Erreur: ${err.message}`)
  }
}

// Ajouter une catégorie spécifique au produit (depuis les badges cliquables)
const addSpecificCategoryToProduct = async (categoryId: string) => {
  if (!product.value) return
  
  try {
    // Récupérer les IDs des catégories actuelles
    const currentCategoryIds = productCategories.value.map(cat => cat.id)
    
    // Ajouter la nouvelle catégorie
    const updatedCategoryIds = [...currentCategoryIds, categoryId]
    
    // Mettre à jour le produit avec les nouvelles catégories
    await productStore.updateProduct(product.value.id, { 
      category_ids: updatedCategoryIds,
      category_id: updatedCategoryIds[0] // Le premier comme catégorie principale
    })
    
    // Recharger le produit pour avoir les catégories mises à jour
    await loadProduct()
    
    // Fermer le sélecteur après ajout
    showCategorySelector.value = false
    
    errorStore.addSuccess('Catégorie ajoutée au produit')
  } catch (err: any) {
    errorStore.addError(`Erreur: ${err.message}`)
  }
}

// Fonctions pour la recherche de catégories
const clearCategorySearch = () => {
  categorySearchQuery.value = ''
  // Refocus sur l'input après clear
  if (categorySearchInput.value) {
    categorySearchInput.value.focus()
  }
}

const closeCategorySelector = () => {
  showCategorySelector.value = false
  categorySearchQuery.value = '' // Réinitialiser la recherche
}

const openCategorySelector = async () => {
  showCategorySelector.value = true
  // Focus sur l'input de recherche après l'ouverture du panel
  await nextTick(() => {
    if (categorySearchInput.value) {
      categorySearchInput.value.focus()
    }
  })
}

// Fonction pour corriger les URLs d'images
const getImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return ''
  
  // Si l'URL est complète et suit le format de l'API
  if (imageUrl.startsWith('http://localhost/API_INTRAFMC/public/')) {
    // Extraire le chemin après /public/
    const pathAfterPublic = imageUrl.replace('http://localhost/API_INTRAFMC/public/', '')
    
    // Si le chemin est juste {ID}/{filename}, ajouter le préfixe product_images/
    if (pathAfterPublic.match(/^\d+\//)) {
      const correctedUrl = `http://localhost/API_INTRAFMC/public/product_images/${pathAfterPublic}`
      return correctedUrl
    }
    
    // Sinon retourner l'URL originale
    return imageUrl
  }
  
  // Si l'URL est complète avec un autre format, la retourner telle quelle
  if (imageUrl.startsWith('http')) {
    return imageUrl
  }
  
  // Si l'URL commence par /, l'ajouter au domaine du serveur
  if (imageUrl.startsWith('/')) {
    return `${import.meta.env.VITE_IMAGE_BASE_URL}${imageUrl}`
  }
  
  // Pour les chemins relatifs, utiliser la base URL configurée
  const defaultUrl = `${import.meta.env.VITE_IMAGE_BASE_URL}/${imageUrl}`
  return defaultUrl
}

// Gestion des erreurs d'images
const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  
  // Si c'est déjà un placeholder, ne rien faire
  if (img.src.includes('placeholder')) {
    return
  }
  
  // Remplacer par le placeholder
  img.src = '/images/placeholder-product.svg'
}

// Chargement des données
const loadProduct = async () => {
  try {
    loading.value = true
    error.value = ''

    const productId = route.params.id as string
    if (!productId) {
      throw new Error('ID du produit manquant')
    }

    product.value = await productStore.fetchProductById(productId)

    if (product.value?.image_urls && product.value.image_urls.length > 0) {
      selectedImage.value = getImageUrl(product.value.image_urls[0])
    }
  } catch (err: any) {
    error.value = err.message || 'Erreur lors du chargement du produit'
    errorStore.addError(error.value)
  } finally {
    loading.value = false
  }
}

// Méthodes pour l'upload d'images
const triggerImageUpload = () => {
  if (imageInput.value) {
    imageInput.value.click()
  }
}

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (!files || files.length === 0 || !product.value) {
    return
  }
  
  try {
    uploadingImages.value = true
    
    // Importer le service produit
    const { productService } = await import('../services/productService')
    
    // Upload des images
    const _newImageUrls = await productService.uploadProductImages(
      product.value.id, 
      Array.from(files)
    )
    
    // Recharger le produit pour avoir toutes les images
    await loadProduct()
    
    errorStore.addSuccess(`${files.length} image(s) ajoutée(s) avec succès`)
    
    // Réinitialiser l'input
    target.value = ''
    
  } catch (err: any) {
    errorStore.addError(`Erreur lors de l'upload des images: ${err.message || 'Erreur inconnue'}`)
  } finally {
    uploadingImages.value = false
  }
}

// Fonction pour supprimer une image
const deleteImage = async (imageUrl: string) => {
  if (!product.value || !imageUrl) {
    return
  }

  // Demander confirmation
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
    return
  }

  try {
    deletingImage.value = true
    
    // Importer le service produit
    const { productService } = await import('../services/productService')
    
    // Supprimer l'image
    const updatedImageUrls = await productService.deleteProductImage(
      product.value.id, 
      imageUrl
    )
    
    // Mettre à jour le produit localement
    if (product.value) {
      product.value.image_urls = updatedImageUrls
    }
    
    // Réinitialiser l'image sélectionnée si elle a été supprimée
    if (selectedImage.value === getImageUrl(imageUrl)) {
      selectedImage.value = ''
    }
    
    errorStore.addSuccess('Image supprimée avec succès')
    
  } catch (err: any) {
    errorStore.addError(`Erreur lors de la suppression de l'image: ${err.message || 'Erreur inconnue'}`)
  } finally {
    deletingImage.value = false
  }
}

// Méthodes pour l'upload de fichier d'analyse
const triggerAnalysisUpload = () => {
  if (analysisInput.value) {
    analysisInput.value.click()
  }
}

const handleAnalysisUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (!files || files.length === 0 || !product.value) {
    return
  }
  
  const file = files[0] // Un seul fichier d'analyse
  
  try {
    uploadingAnalysis.value = true
    
    // Importer le service produit
    const { productService } = await import('../services/productService')
    
    // Upload du fichier d'analyse
    const analysisUrl = await productService.uploadAnalysisFile(
      product.value.id, 
      file
    )
    
    // Mettre à jour le produit localement
    if (product.value) {
      product.value.analysis_file_url = analysisUrl
    }
    
    errorStore.addSuccess('Fichier d\'analyse ajouté avec succès')
    
    // Réinitialiser l'input
    target.value = ''
    
  } catch (err: any) {
    errorStore.addError(`Erreur lors de l'upload du fichier d'analyse: ${err.message || 'Erreur inconnue'}`)
  } finally {
    uploadingAnalysis.value = false
  }
}

const removeAnalysisFile = async () => {
  if (!product.value || !product.value.analysis_file_url) return
  
  const confirmed = confirm('Êtes-vous sûr de vouloir supprimer le fichier d\'analyse ?')
  if (!confirmed) return
  
  try {
    // Mettre à jour le produit pour supprimer le fichier d'analyse
    await productStore.updateProduct(product.value.id, { analysis_file_url: null })
    
    // Mettre à jour localement
    product.value.analysis_file_url = undefined
    
    errorStore.addSuccess('Fichier d\'analyse supprimé avec succès')
  } catch (err: any) {
    errorStore.addError(`Erreur lors de la suppression: ${err.message}`)
  }
}

// Lifecycle
onMounted(async () => {
  // Charger les catégories et le produit en parallèle
  try {
    await Promise.all([
      categoryStore.fetchCategories(),
      loadProduct()
    ])
    // Les catégories sont maintenant dans le store
    availableCategories.value = categoryStore.categories || []
  } catch (err) {
    // Les erreurs sont déjà gérées dans les fonctions individuelles
    await loadProduct()
  }
})
</script>
