<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Sidebar moderne -->
    <div class="drawer lg:drawer-open">
      <input id="drawer-toggle" type="checkbox" class="drawer-toggle" />

      <!-- Contenu principal -->
      <div class="drawer-content flex flex-col">
        <!-- Navbar ultra-moderne -->
        <div class="navbar bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 px-6 py-3 sticky top-0 z-50">
          <!-- Menu mobile -->
          <div class="flex-none lg:hidden">
            <label for="drawer-toggle"
              class="btn btn-ghost btn-circle text-white hover:bg-gray-700/50 transition-all duration-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
          </div>

          <!-- Logo et titre -->
          <div class="flex-1">
            <div class="flex items-center space-x-4">
              <div
                class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                <div class="w-5 h-5 bg-white rounded-md"></div>
              </div>
              <div>
                <div class="text-xl font-semibold text-white tracking-tight">FMC Intranet</div>
                <div class="text-xs text-gray-400 font-medium">Tableau de bord</div>
              </div>
            </div>
          </div>

          <!-- Actions navbar -->
          <div class="flex items-center gap-4">
            <!-- Indicateur de statut -->
            <div
              class="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span class="text-xs font-medium text-green-400">En ligne</span>
            </div>

            <!-- Notifications -->
            <div class="dropdown dropdown-end">
              <div tabindex="0" role="button"
                class="btn btn-ghost btn-circle text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200 relative">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M15 17h5l-5 5v-5zM10 3A7 7 0 003 10c0 5.25 3.94 7.5 7 8.27A7.002 7.002 0 0017 10a7 7 0 00-7-7z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
                <!-- Badge notification -->
                <div class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-900"></div>
              </div>
              <div tabindex="0"
                class="dropdown-content z-[1] menu p-0 shadow-2xl bg-gray-900 border border-gray-700 rounded-2xl w-64 mt-3">
                <div class="p-4 border-b border-gray-700">
                  <div class="text-sm font-semibold text-white">Notifications</div>
                  <div class="text-xs text-gray-400">Vous avez 2 nouvelles notifications</div>
                </div>
                <div class="p-2 max-h-64 overflow-y-auto">
                  <div class="text-xs text-gray-500 text-center py-4">Aucune notification récente</div>
                </div>
              </div>
            </div>

            <!-- Profil utilisateur -->
            <div class="dropdown dropdown-end">
              <div tabindex="0" role="button"
                class="btn btn-ghost p-2 hover:bg-gray-700/50 transition-all duration-200 rounded-xl">
                <div class="flex items-center gap-3">
                  <div
                    class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg ring-2 ring-blue-500/20">
                    <span class="text-white text-sm font-semibold">
                      {{ authStore.userName?.charAt(0).toUpperCase() || 'U' }}
                    </span>
                  </div>
                  <div class="hidden md:block text-left">
                    <div class="text-sm font-medium text-white">{{ authStore.userName || 'Utilisateur' }}</div>
                    <div class="text-xs text-gray-400">Administrateur</div>
                  </div>
                  <svg class="w-4 h-4 text-gray-400 hidden md:block" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div tabindex="0"
                class="dropdown-content z-[1] menu p-0 shadow-2xl bg-gray-900 border border-gray-700 rounded-2xl w-64 mt-3">
                <!-- Header profil -->
                <div class="p-4 border-b border-gray-700 bg-gradient-to-r from-blue-500/10 to-purple-600/10">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <span class="text-white text-lg font-semibold">
                        {{ authStore.userName?.charAt(0).toUpperCase() || 'U' }}
                      </span>
                    </div>
                    <div>
                      <div class="text-sm font-semibold text-white">{{ authStore.userName || 'Utilisateur' }}</div>
                      <div class="text-xs text-gray-400">{{ authStore.userEmail || 'email@fmc.com' }}</div>
                      <div class="text-xs text-blue-400 font-medium">Administrateur</div>
                    </div>
                  </div>
                </div>

                <!-- Menu items -->
                <ul class="p-2">
                  <li>
                    <a
                      class="flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-xl cursor-pointer transition-all duration-200">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Mon profil
                    </a>
                  </li>
                  <li>
                    <a
                      class="flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-xl cursor-pointer transition-all duration-200">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Paramètres
                    </a>
                  </li>
                  <li>
                    <hr class="my-2 border-gray-700">
                  </li>
                  <li>
                    <a @click="authStore.logout"
                      class="flex items-center gap-3 p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl cursor-pointer transition-all duration-200">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Déconnexion
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Contenu de la page -->
        <main class="flex-1 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
          <!-- Grille de points lumineux en arrière-plan -->
          <div class="absolute inset-0"
            style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0); background-size: 50px 50px;">
          </div>

          <!-- Contenu -->
          <div class="relative z-10 p-6">
            <router-view />
          </div>
        </main>
      </div>

      <!-- Sidebar -->
      <div class="drawer-side">
        <label for="drawer-toggle" aria-label="close sidebar" class="drawer-overlay"></label>
        <aside class="min-h-full w-64 bg-gray-900/90 backdrop-blur-xl border-r border-gray-800">
          <!-- Header sidebar -->
          <div class="p-6 border-b border-gray-700/50 bg-gradient-to-r from-blue-500/5 to-purple-600/5">
            <div class="flex items-center space-x-4">
              <div
                class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <div class="w-5 h-5 bg-white rounded-md"></div>
              </div>
              <div>
                <div class="text-lg font-semibold text-white tracking-tight">FMC Intranet</div>
                <div class="text-xs text-gray-400 font-medium">Version 2.0</div>
              </div>
            </div>
          </div>

          <!-- Navigation -->
          <nav class="p-4">
            <ul class="space-y-3">
              <!-- Dashboard -->
              <li>
                <router-link to="/dashboard"
                  class="flex items-center space-x-3 p-3 rounded-xl text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-600/20 transition-all duration-200 group"
                  :class="{ 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-400 shadow-lg': $route.path.startsWith('/dashboard') }">
                  <div
                    class="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors duration-200"
                    :class="{ 'bg-blue-500/30': $route.path.startsWith('/dashboard') }">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <span class="font-semibold">Dashboard</span>
                    <div class="text-xs text-gray-500">Vue d'ensemble</div>
                  </div>
                  <svg class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    :class="{ 'opacity-100': $route.path.startsWith('/dashboard') }" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </router-link>
              </li>

              <!-- Commandes -->
              <li>
                <router-link to="/orders"
                  class="flex items-center space-x-3 p-3 rounded-xl text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-green-500/20 hover:to-teal-600/20 transition-all duration-200 group"
                  :class="{ 'bg-gradient-to-r from-green-500/20 to-teal-600/20 text-green-400 shadow-lg': $route.path.startsWith('/orders') }">
                  <div
                    class="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-green-500/20 transition-colors duration-200"
                    :class="{ 'bg-green-500/30': $route.path.startsWith('/orders') }">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <span class="font-semibold">Commandes</span>
                    <div class="text-xs text-gray-500">Gestion des commandes</div>
                  </div>
                  <svg class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    :class="{ 'opacity-100': $route.path.startsWith('/orders') }" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </router-link>
              </li>

              <!-- Arrivages -->
              <li>
                <router-link to="/arrivals"
                  class="flex items-center space-x-3 p-3 rounded-xl text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-600/20 transition-all duration-200 group"
                  :class="{ 'bg-gradient-to-r from-purple-500/20 to-pink-600/20 text-purple-400 shadow-lg': $route.path.startsWith('/arrivals') }">
                  <div
                    class="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors duration-200"
                    :class="{ 'bg-purple-500/30': $route.path.startsWith('/arrivals') }">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 9h6m-6 2h6m-6 2h6m-6 2h6" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <span class="font-semibold">Arrivages</span>
                    <div class="text-xs text-gray-500">Gestion des livraisons</div>
                  </div>
                  <svg class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    :class="{ 'opacity-100': $route.path.startsWith('/arrivals') }" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </router-link>
              </li>

              <!-- Produits -->
              <li>
                <router-link to="/products"
                  class="flex items-center space-x-3 p-3 rounded-xl text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-600/20 transition-all duration-200 group"
                  :class="{ 'bg-gradient-to-r from-orange-500/20 to-red-600/20 text-orange-400 shadow-lg': $route.path.startsWith('/products') }">
                  <div
                    class="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors duration-200"
                    :class="{ 'bg-orange-500/30': $route.path.startsWith('/products') }">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 9h6" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <span class="font-semibold">Produits</span>
                    <div class="text-xs text-gray-500">Catalogue produits</div>
                  </div>
                  <svg class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    :class="{ 'opacity-100': $route.path.startsWith('/products') }" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </router-link>
              </li>

              <!-- Catégories -->
              <li>
                <router-link to="/categories"
                  class="flex items-center space-x-3 p-3 rounded-xl text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-600/20 transition-all duration-200 group"
                  :class="{ 'bg-gradient-to-r from-purple-500/20 to-pink-600/20 text-purple-400 shadow-lg': $route.path.startsWith('/categories') }">
                  <div
                    class="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors duration-200"
                    :class="{ 'bg-purple-500/30': $route.path.startsWith('/categories') }">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <span class="font-semibold">Catégories</span>
                    <div class="text-xs text-gray-500">Gestion des catégories</div>
                  </div>
                  <svg class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    :class="{ 'opacity-100': $route.path.startsWith('/categories') }" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </router-link>
              </li>
            </ul>

            <!-- Section info -->
            <div
              class="mt-8 p-4 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-xl border border-blue-500/20">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span class="text-xs font-medium text-green-400">Système opérationnel</span>
              </div>
              <div class="text-xs text-gray-400">
                Dernière mise à jour: 24/07/2025
              </div>
            </div>
          </nav>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore()
</script>
