import { computed, ref } from 'vue'
import { UserService } from '../services/userService'
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserFormData,
  UserListFilters,
  UsersState
} from '../types'

const userService = new UserService()

// État global partagé
const state = ref<UsersState>({
  users: [],
  selectedUser: null,
  loading: {
    users: false,
    createUser: false,
    updateUser: false,
    deleteUser: false
  },
  error: {
    users: null,
    createUser: null,
    updateUser: null,
    deleteUser: null
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    perPage: 10
  },
  filters: {
    search: '',
    is_admin: undefined,
    is_active: undefined,
    page: 1,
    first: 10
  }
})

/**
 * Composable pour la gestion des utilisateurs (Admin)
 */
export function useUsers() {
  // Getters
  const users = computed(() => state.value.users)
  const selectedUser = computed(() => state.value.selectedUser)
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const pagination = computed(() => state.value.pagination)
  const filters = computed(() => state.value.filters)

  const isLoading = computed(() => 
    Object.values(state.value.loading).some(loading => loading)
  )

  const hasErrors = computed(() => 
    Object.values(state.value.error).some(error => error !== null)
  )

  // Actions
  async function fetchUsers(newFilters: Partial<UserListFilters> = {}) {
    state.value.loading.users = true
    state.value.error.users = null

    // Mettre à jour les filtres
    Object.assign(state.value.filters, newFilters)

    try {
      const response = await userService.getUsers(state.value.filters)
      
      state.value.users = response.data
      state.value.pagination = {
        currentPage: response.current_page,
        totalPages: response.last_page,
        total: response.total,
        perPage: response.per_page
      }

      return response
    } catch (error: any) {
      state.value.error.users = error.message
      throw error
    } finally {
      state.value.loading.users = false
    }
  }

  async function fetchUser(id: string) {
    try {
      const user = await userService.getUser(id)
      state.value.selectedUser = user
      return user
    } catch (error: any) {
      state.value.error.users = error.message
      throw error
    }
  }

  async function createUser(formData: UserFormData) {
    state.value.loading.createUser = true
    state.value.error.createUser = null

    try {
      // Validation côté client
      const errors = userService.validateUserData(formData)
      if (errors.length > 0) {
        throw new Error(errors.join(', '))
      }

      const createInput: CreateUserInput = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        birth_date: formData.birth_date || undefined,
        is_admin: formData.is_admin,
        is_active: formData.is_active
      }

      const newUser = await userService.createUser(createInput)
      
      // Ajouter à la liste locale
      state.value.users.unshift(newUser)
      state.value.pagination.total++

      return newUser
    } catch (error: any) {
      state.value.error.createUser = error.message
      throw error
    } finally {
      state.value.loading.createUser = false
    }
  }

  async function updateUser(formData: Partial<UserFormData> & { id: string }) {
    state.value.loading.updateUser = true
    state.value.error.updateUser = null

    try {
      // Validation côté client
      const errors = userService.validateUpdateData(formData)
      if (errors.length > 0) {
        throw new Error(errors.join(', '))
      }

      const updateInput: UpdateUserInput = {
        id: formData.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        birth_date: formData.birth_date || undefined,
        is_admin: formData.is_admin,
        is_active: formData.is_active
      }

      const updatedUser = await userService.updateUser(updateInput)
      
      // Mettre à jour dans la liste locale
      const index = state.value.users.findIndex(user => user.id === updatedUser.id)
      if (index !== -1) {
        state.value.users[index] = updatedUser
      }

      // Mettre à jour l'utilisateur sélectionné si c'est le même
      if (state.value.selectedUser?.id === updatedUser.id) {
        state.value.selectedUser = updatedUser
      }

      return updatedUser
    } catch (error: any) {
      state.value.error.updateUser = error.message
      throw error
    } finally {
      state.value.loading.updateUser = false
    }
  }

  async function deleteUser(id: string) {
    state.value.loading.deleteUser = true
    state.value.error.deleteUser = null

    try {
      const response = await userService.deleteUser(id)
      
      // Supprimer de la liste locale
      const index = state.value.users.findIndex(user => user.id === id)
      if (index !== -1) {
        state.value.users.splice(index, 1)
        state.value.pagination.total--
      }

      // Vider l'utilisateur sélectionné si c'est celui supprimé
      if (state.value.selectedUser?.id === id) {
        state.value.selectedUser = null
      }

      return response
    } catch (error: any) {
      state.value.error.deleteUser = error.message
      throw error
    } finally {
      state.value.loading.deleteUser = false
    }
  }

  function setFilters(newFilters: Partial<UserListFilters>) {
    Object.assign(state.value.filters, newFilters)
  }

  function resetFilters() {
    state.value.filters = {
      search: '',
      is_admin: undefined,
      is_active: undefined,
      page: 1,
      first: 10
    }
  }

  function clearErrors() {
    Object.keys(state.value.error).forEach(key => {
      state.value.error[key as keyof typeof state.value.error] = null
    })
  }

  function selectUser(user: User | null) {
    state.value.selectedUser = user
  }

  // Fonctions utilitaires
  function getUserStatusLabel(user: User): string {
    if (!user.is_active) return 'Inactif'
    return user.is_admin ? 'Administrateur' : 'Utilisateur'
  }

  function getUserStatusClass(user: User): string {
    if (!user.is_active) return 'text-red-500'
    return user.is_admin ? 'text-purple-500' : 'text-green-500'
  }

  async function searchUsers(searchTerm: string) {
    await fetchUsers({ search: searchTerm, page: 1 })
  }

  async function filterByRole(isAdmin?: boolean) {
    await fetchUsers({ is_admin: isAdmin, page: 1 })
  }

  async function filterByStatus(isActive?: boolean) {
    await fetchUsers({ is_active: isActive, page: 1 })
  }

  async function changePage(page: number) {
    await fetchUsers({ page })
  }

  return {
    // State
    users,
    selectedUser,
    loading,
    error,
    pagination,
    filters,
    isLoading,
    hasErrors,

    // Actions
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    setFilters,
    resetFilters,
    clearErrors,
    selectUser,

    // Utilities
    getUserStatusLabel,
    getUserStatusClass,
    searchUsers,
    filterByRole,
    filterByStatus,
    changePage
  }
}
