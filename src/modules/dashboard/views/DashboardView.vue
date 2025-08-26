<template>
  <div class="flex items-center justify-center min-h-[calc(100vh-200px)]">
    <div class="text-center max-w-4xl mx-auto p-8">
      <!-- Alerte de permissions -->
      <PermissionAlert />

      <!-- Logo/Icône principal -->
      <div class="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl flex items-center justify-center shadow-2xl">
        <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
          <div class="w-8 h-8 bg-black rounded-lg"></div>
        </div>
      </div>

      <!-- Message principal -->
      <h1 class="text-4xl font-light text-white mb-6">
        Bienvenue {{ authStore.isAdmin ? 'Administrateur' : '' }} {{ authStore.userName }}
      </h1>
      
      <!-- Dashboard Admin -->
      <div v-if="authStore.isAdmin" class="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 mb-8">
        <div class="flex items-center justify-center mb-6">
          <div class="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center">
            <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
        </div>

        <h2 class="text-2xl font-medium text-white mb-4">
          Panneau d'Administration
        </h2>
        
        <p class="text-gray-300 text-lg leading-relaxed mb-6">
          Accédez aux outils de gestion et d'administration de la plateforme FMC.
        </p>

        <!-- Modules Admin -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <router-link to="/orders" class="flex flex-col items-center space-y-3 p-4 bg-gradient-to-br from-green-500/10 to-teal-600/10 border border-green-500/20 rounded-xl hover:from-green-500/20 hover:to-teal-600/20 transition-all duration-200 group">
            <div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
              <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="text-center">
              <div class="text-white font-medium">Commandes</div>
              <div class="text-xs text-gray-400">Gestion des commandes</div>
            </div>
          </router-link>

          <router-link to="/arrivals" class="flex flex-col items-center space-y-3 p-4 bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-500/20 rounded-xl hover:from-purple-500/20 hover:to-pink-600/20 transition-all duration-200 group">
            <div class="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
              <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 9h6m-6 2h6m-6 2h6m-6 2h6" />
              </svg>
            </div>
            <div class="text-center">
              <div class="text-white font-medium">Arrivages</div>
              <div class="text-xs text-gray-400">Gestion des livraisons</div>
            </div>
          </router-link>

          <router-link to="/products" class="flex flex-col items-center space-y-3 p-4 bg-gradient-to-br from-orange-500/10 to-red-600/10 border border-orange-500/20 rounded-xl hover:from-orange-500/20 hover:to-red-600/20 transition-all duration-200 group">
            <div class="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
              <svg class="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 9h6" />
              </svg>
            </div>
            <div class="text-center">
              <div class="text-white font-medium">Produits</div>
              <div class="text-xs text-gray-400">Gestion du catalogue</div>
            </div>
          </router-link>

          <router-link to="/categories" class="flex flex-col items-center space-y-3 p-4 bg-gradient-to-br from-blue-500/10 to-purple-600/10 border border-blue-500/20 rounded-xl hover:from-blue-500/20 hover:to-purple-600/20 transition-all duration-200 group">
            <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
              <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div class="text-center">
              <div class="text-white font-medium">Catégories</div>
              <div class="text-xs text-gray-400">Organisation produits</div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Dashboard Utilisateur -->
      <div v-else class="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 mb-8">
        <div class="flex items-center justify-center mb-6">
          <div class="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
            <svg class="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>

        <h2 class="text-2xl font-medium text-white mb-4">
          Bienvenue dans la Boutique FMC
        </h2>
        
        <p class="text-gray-300 text-lg leading-relaxed mb-6">
          Découvrez notre catalogue de produits CBD de qualité et passez vos commandes en toute simplicité.
        </p>

        <!-- Actions Utilisateur -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <router-link to="/ecommerce" class="flex flex-col items-center space-y-4 p-6 bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border border-emerald-500/20 rounded-xl hover:from-emerald-500/20 hover:to-teal-600/20 transition-all duration-200 group">
            <div class="w-16 h-16 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
              <svg class="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div class="text-center">
              <div class="text-white font-semibold text-lg">Catalogue Produits</div>
              <div class="text-sm text-gray-400">Parcourir tous nos produits</div>
            </div>
          </router-link>

          <router-link to="/ecommerce/cart" class="flex flex-col items-center space-y-4 p-6 bg-gradient-to-br from-blue-500/10 to-purple-600/10 border border-blue-500/20 rounded-xl hover:from-blue-500/20 hover:to-purple-600/20 transition-all duration-200 group">
            <div class="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
              <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </div>
            <div class="text-center">
              <div class="text-white font-semibold text-lg">Mon Panier</div>
              <div class="text-sm text-gray-400">Voir mes articles sélectionnés</div>
            </div>
          </router-link>

          <router-link to="/orders" class="flex flex-col items-center space-y-4 p-6 bg-gradient-to-br from-green-500/10 to-teal-600/10 border border-green-500/20 rounded-xl hover:from-green-500/20 hover:to-teal-600/20 transition-all duration-200 group">
            <div class="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
              <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="text-center">
              <div class="text-green-400 font-semibold text-lg">Mes Commandes</div>
              <div class="text-sm text-gray-400">Consulter l'historique</div>
            </div>
          </router-link>
        </div>
      </div>
          </div>
        </div>

        <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div class="flex items-center justify-center space-x-2 text-gray-400">
            <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span class="text-sm">Système opérationnel</span>
      <!-- Section info -->
      <div class="mt-8 p-4 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-xl border border-blue-500/20">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span class="text-xs font-medium text-green-400">Système opérationnel</span>
        </div>
        <div class="text-xs text-gray-400">
          Dernière mise à jour: 25/08/2025
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PermissionAlert from '@/shared/components/PermissionAlert.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore()
</script>

<style scoped>
/* Animation fade-in pour le contenu */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.flex.items-center.justify-center {
  animation: fadeInUp 0.8s ease-out;
}

/* Animations pour les éléments */
.grid > * {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

.grid > *:nth-child(1) { animation-delay: 0.1s; }
.grid > *:nth-child(2) { animation-delay: 0.2s; }
.grid > *:nth-child(3) { animation-delay: 0.3s; }
.grid > *:nth-child(4) { animation-delay: 0.4s; }

/* Effet hover pour les cartes */
button:hover {
  transform: translateY(-2px);
}
</style>
