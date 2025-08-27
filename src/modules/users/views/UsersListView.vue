<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- En-tête -->
    <div class="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900">
      <div class="container mx-auto px-4 py-8">
        <div class="flex items-center justify-between">
          <!-- Navigation retour -->
          <div class="flex items-center space-x-4">
            <button @click="$router.back()" class="btn btn-ghost btn-circle text-white hover:bg-white/10">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 class="text-3xl font-bold text-white">Gestion des Utilisateurs</h1>
              <p class="text-white/70">Administration des comptes utilisateurs</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-3">
            <button 
              @click="showCreateModal = true"
              class="btn btn-primary"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Nouvel Utilisateur
            </button>
            
            <button 
              @click="refreshUsers"
              :disabled="loading.users"
              class="btn btn-outline btn-sm text-white border-white/30 hover:bg-white/10"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualiser
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-7xl mx-auto space-y-8">

        <!-- Alerte d'erreur globale -->
        <div v-if="hasErrors" class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ error.users || error.createUser || error.updateUser || error.deleteUser }}</span>
          <button @click="clearErrors" class="btn btn-sm btn-ghost">Fermer</button>
        </div>

        <!-- Alerte de succès -->
        <div v-if="showSuccessMessage" class="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ successMessage }}</span>
        </div>

        <!-- Filtres et recherche -->
        <div class="bg-gray-800 rounded-2xl border border-gray-700 p-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Recherche -->
            <div class="form-control">
              <label class="label">
                <span class="label-text text-white">Rechercher</span>
              </label>
              <input
                v-model="searchTerm"
                @input="debouncedSearch"
                type="text"
                placeholder="Nom, email..."
                class="input input-bordered w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500"
              />
            </div>

            <!-- Filtre par rôle -->
            <div class="form-control">
              <label class="label">
                <span class="label-text text-white">Rôle</span>
              </label>
              <select
                v-model="roleFilter"
                @change="handleRoleFilter"
                class="select select-bordered w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500"
              >
                <option value="">Tous les rôles</option>
                <option :value="true">Administrateurs</option>
                <option :value="false">Utilisateurs</option>
              </select>
            </div>

            <!-- Filtre par statut -->
            <div class="form-control">
              <label class="label">
                <span class="label-text text-white">Statut</span>
              </label>
              <select
                v-model="statusFilter"
                @change="handleStatusFilter"
                class="select select-bordered w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500"
              >
                <option value="">Tous les statuts</option>
                <option :value="true">Actifs</option>
                <option :value="false">Inactifs</option>
              </select>
            </div>

            <!-- Bouton reset filtres -->
            <div class="form-control">
              <label class="label">
                <span class="label-text text-white">&nbsp;</span>
              </label>
              <button
                @click="resetAllFilters"
                class="btn btn-outline text-white border-gray-600 hover:bg-gray-700"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        <!-- Statistiques -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-6 border border-blue-500/30">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-200 text-sm">Total Utilisateurs</p>
                <p class="text-2xl font-bold text-white">{{ pagination.total }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-6 border border-purple-500/30">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-200 text-sm">Administrateurs</p>
                <p class="text-2xl font-bold text-white">{{ adminCount }}</p>
              </div>
              <div class="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-6 border border-green-500/30">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-200 text-sm">Comptes Actifs</p>
                <p class="text-2xl font-bold text-white">{{ activeCount }}</p>
              </div>
              <div class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl p-6 border border-red-500/30">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-red-200 text-sm">Comptes Inactifs</p>
                <p class="text-2xl font-bold text-white">{{ inactiveCount }}</p>
              </div>
              <div class="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Table des utilisateurs -->
        <div class="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div class="p-6 border-b border-gray-700">
            <h2 class="text-xl font-semibold text-white">Liste des Utilisateurs</h2>
          </div>

          <!-- Loading state -->
          <div v-if="loading.users" class="flex justify-center items-center py-12">
            <div class="loading loading-spinner loading-lg text-primary"></div>
          </div>

          <!-- Table -->
          <div v-else-if="users.length > 0" class="overflow-x-auto">
            <table class="table w-full">
              <thead class="bg-gray-700">
                <tr>
                  <th class="text-white">Utilisateur</th>
                  <th class="text-white">Email</th>
                  <th class="text-white">Téléphone</th>
                  <th class="text-white">Rôle</th>
                  <th class="text-white">Statut</th>
                  <th class="text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id" class="hover:bg-gray-700/50">
                  <td>
                    <div class="flex items-center space-x-3">
                      <div class="avatar placeholder">
                        <div class="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center">
                          <span class="text-sm font-bold">{{ getInitials(user.name) }}</span>
                        </div>
                      </div>
                      <div>
                        <div class="font-bold text-white">{{ user.name }}</div>
                        <div class="text-sm text-gray-400">ID: {{ user.id }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="text-white">{{ user.email }}</td>
                  <td class="text-white">{{ user.phone || '-' }}</td>
                  <td>
                    <span :class="getUserStatusClass(user)" class="badge">
                      {{ user.is_admin ? 'Admin' : 'Utilisateur' }}
                    </span>
                  </td>
                  <td>
                    <span :class="user.is_active ? 'badge-success' : 'badge-error'" class="badge">
                      {{ user.is_active ? 'Actif' : 'Inactif' }}
                    </span>
                  </td>
                  <td>
                    <div class="flex space-x-2">
                      <button
                        @click="editUser(user)"
                        class="btn btn-sm btn-outline text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        @click="confirmDeleteUser(user)"
                        :disabled="loading.deleteUser"
                        class="btn btn-sm btn-outline text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty state -->
          <div v-else class="text-center py-12">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <p class="text-xl text-gray-400 mb-2">Aucun utilisateur trouvé</p>
            <p class="text-gray-500">Créez le premier utilisateur ou modifiez vos filtres</p>
          </div>

          <!-- Pagination -->
          <div v-if="pagination.totalPages > 1" class="p-6 border-t border-gray-700">
            <UIPagination
              :current-page="pagination.currentPage"
              :total-pages="pagination.totalPages"
              :total="pagination.total"
              :per-page="pagination.perPage"
              :from="(pagination.currentPage - 1) * pagination.perPage + 1"
              :to="Math.min(pagination.currentPage * pagination.perPage, pagination.total)"
              :filtered="isFiltered"
              @page-change="handlePageChange"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Création/Édition Utilisateur -->
    <UserModal
      v-if="showCreateModal || showEditModal"
      :user="selectedUser"
      :is-edit="showEditModal"
      @close="closeModals"
      @save="handleSaveUser"
    />

    <!-- Modal Confirmation Suppression -->
    <ConfirmDeleteModal
      v-if="showDeleteModal"
      :user="userToDelete"
      @close="showDeleteModal = false"
      @confirm="handleDeleteUser"
    />
  </div>
</template>

<script setup lang="ts">
import UIPagination from '@/shared/components/UIPagination.vue'
import { usePermissions } from '@/shared/composables/usePermissions'
import { computed, onMounted, ref } from 'vue'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal.vue'
import UserModal from '../components/UserModal.vue'
import { useUsers } from '../composables/useUsers'
import type { User, UserFormData } from '../types'

// Permissions
const { requireAdmin } = usePermissions()
requireAdmin()

// Composables
const {
  users,
  selectedUser,
  loading,
  error,
  pagination,
  hasErrors,
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  clearErrors,
  selectUser,
  getUserStatusClass,
  searchUsers,
  filterByRole,
  filterByStatus,
  changePage
} = useUsers()

// État local
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const userToDelete = ref<User | null>(null)
const showSuccessMessage = ref(false)
const successMessage = ref('')

// Filtres
const searchTerm = ref('')
const roleFilter = ref<boolean | ''>('')
const statusFilter = ref<boolean | ''>('')

// Statistiques calculées
const adminCount = computed(() => users.value.filter(user => user.is_admin).length)
const activeCount = computed(() => users.value.filter(user => user.is_active).length)
const inactiveCount = computed(() => users.value.filter(user => !user.is_active).length)

// Vérifie si des filtres sont actifs
const isFiltered = computed(() => {
  return searchTerm.value !== '' || roleFilter.value !== '' || statusFilter.value !== ''
})

// Debounce pour la recherche
let searchTimeout: NodeJS.Timeout | null = null
const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    searchUsers(searchTerm.value)
  }, 500)
}

// Actions
const refreshUsers = async () => {
  await fetchUsers()
}

const editUser = (user: User) => {
  selectUser(user)
  showEditModal.value = true
}

const confirmDeleteUser = (user: User) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const handleSaveUser = async (formData: UserFormData) => {
  try {
    if (showEditModal.value && selectedUser.value) {
      await updateUser({ ...formData, id: selectedUser.value.id })
      successMessage.value = 'Utilisateur mis à jour avec succès'
    } else {
      await createUser(formData)
      successMessage.value = 'Utilisateur créé avec succès'
    }
    
    closeModals()
    showSuccessMessage.value = true
    setTimeout(() => { showSuccessMessage.value = false }, 3000)
  } catch (error) {
    // L'erreur est gérée par le composable
  }
}

const handleDeleteUser = async () => {
  if (!userToDelete.value) return
  
  try {
    await deleteUser(userToDelete.value.id)
    successMessage.value = 'Utilisateur supprimé avec succès'
    showDeleteModal.value = false
    userToDelete.value = null
    showSuccessMessage.value = true
    setTimeout(() => { showSuccessMessage.value = false }, 3000)
  } catch (error) {
    showDeleteModal.value = false
  }
}

const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  selectUser(null)
}

const handleRoleFilter = () => {
  filterByRole(roleFilter.value === '' ? undefined : roleFilter.value)
}

const handleStatusFilter = () => {
  filterByStatus(statusFilter.value === '' ? undefined : statusFilter.value)
}

const resetAllFilters = () => {
  searchTerm.value = ''
  roleFilter.value = ''
  statusFilter.value = ''
  fetchUsers()
}

const handlePageChange = (page: number) => {
  changePage(page)
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2)
}

// Lifecycle
onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.table tbody tr:hover {
  @apply bg-gray-700/30;
}

.badge {
  @apply text-xs px-2 py-1 rounded-full font-medium;
}

.badge-success {
  @apply bg-green-500/20 text-green-400 border border-green-500/30;
}

.badge-error {
  @apply bg-red-500/20 text-red-400 border border-red-500/30;
}
</style>
