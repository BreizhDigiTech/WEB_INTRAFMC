import { useAuthStore } from '@/stores/auth'
import { computed, ref } from 'vue'
import { profileService } from '../services/profileService'
import type {
  ChangePasswordInput,
  PasswordFormData,
  ProfileFormData,
  ProfileState,
  UpdateProfileInput,
  UserProfile
} from '../types'

/**
 * Composable pour la gestion du profil utilisateur
 */
export function useProfile() {
  const authStore = useAuthStore()

  // État local
  const state = ref<ProfileState>({
    profile: null,
    loading: {
      profile: false,
      updateProfile: false,
      changePassword: false,
      uploadAvatar: false
    },
    error: {
      profile: null,
      updateProfile: null,
      changePassword: null,
      uploadAvatar: null
    }
  })

  // Computed
  const profile = computed(() => state.value.profile || authStore.user)
  const isLoading = computed(() => Object.values(state.value.loading).some(loading => loading))
  const hasErrors = computed(() => Object.values(state.value.error).some(error => error !== null))

  // Actions
  async function fetchProfile() {
    state.value.loading.profile = true
    state.value.error.profile = null

    try {
      const profileData = await profileService.getProfile()
      state.value.profile = profileData
      
      // Mettre à jour le store auth aussi
      authStore.user = profileData
      
      return profileData
    } catch (error: any) {
      state.value.error.profile = error.message
      throw error
    } finally {
      state.value.loading.profile = false
    }
  }

  async function updateProfile(formData: ProfileFormData) {
    state.value.loading.updateProfile = true
    state.value.error.updateProfile = null

    try {
      // Validation côté client
      const errors = profileService.validateProfileData(formData)
      if (errors.length > 0) {
        throw new Error(errors.join(', '))
      }

      const updateInput: UpdateProfileInput = {
        id: profile.value?.id || authStore.user?.id || '',
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        birth_date: formData.birth_date || undefined,
        avatar: profile.value?.avatar // Conserver l'avatar existant
      }

      const updatedProfile = await profileService.updateProfile(updateInput)
      
      // Mettre à jour l'état local et le store auth
      state.value.profile = { ...state.value.profile, ...updatedProfile } as UserProfile
      if (authStore.user) {
        authStore.user = { ...authStore.user, ...updatedProfile }
      }

      return updatedProfile
    } catch (error: any) {
      state.value.error.updateProfile = error.message
      throw error
    } finally {
      state.value.loading.updateProfile = false
    }
  }

  async function changePassword(formData: PasswordFormData) {
    state.value.loading.changePassword = true
    state.value.error.changePassword = null

    try {
      // Validation côté client
      const errors = profileService.validatePasswordData(formData)
      if (errors.length > 0) {
        throw new Error(errors.join(', '))
      }

      const changePasswordInput: ChangePasswordInput = {
        current_password: formData.current_password,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password
      }

      const result = await profileService.changePassword(changePasswordInput)
      return result
    } catch (error: any) {
      state.value.error.changePassword = error.message
      throw error
    } finally {
      state.value.loading.changePassword = false
    }
  }

  async function uploadAvatar(file: File) {
    state.value.loading.uploadAvatar = true
    state.value.error.uploadAvatar = null

    try {
      // Validation du fichier
      if (!file.type.startsWith('image/')) {
        throw new Error('Le fichier doit être une image')
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB max
        throw new Error('L\'image ne peut pas dépasser 5MB')
      }

      const result = await profileService.uploadAvatar(file)
      
      // Mettre à jour l'avatar dans le profil
      if (state.value.profile) {
        state.value.profile.avatar = result.avatar_url
      }
      if (authStore.user) {
        authStore.user.avatar = result.avatar_url
      }

      return result
    } catch (error: any) {
      state.value.error.uploadAvatar = error.message
      throw error
    } finally {
      state.value.loading.uploadAvatar = false
    }
  }

  async function removeAvatar() {
    state.value.loading.uploadAvatar = true
    state.value.error.uploadAvatar = null

    try {
      await profileService.removeAvatar()
      
      // Supprimer l'avatar du profil
      if (state.value.profile) {
        state.value.profile.avatar = undefined
      }
      if (authStore.user) {
        authStore.user.avatar = undefined
      }
    } catch (error: any) {
      state.value.error.uploadAvatar = error.message
      throw error
    } finally {
      state.value.loading.uploadAvatar = false
    }
  }

  function clearErrors() {
    Object.keys(state.value.error).forEach(key => {
      state.value.error[key as keyof typeof state.value.error] = null
    })
  }

  function clearError(type: keyof typeof state.value.error) {
    state.value.error[type] = null
  }

  // Utilitaires
  function formatDate(dateString: string | undefined) {
    if (!dateString) return 'Non renseigné'
    try {
      return new Date(dateString).toLocaleDateString('fr-FR')
    } catch {
      return 'Date invalide'
    }
  }

  function getInitials(name: string | undefined) {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  }

  function getAvatarUrl(user: UserProfile | null) {
    return user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366f1&color=fff&size=150`
  }

  function getMembershipDuration(createdAt: string | undefined) {
    if (!createdAt) return 'Inconnu'
    
    const created = new Date(createdAt)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - created.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 30) {
      return `${diffDays} jour${diffDays > 1 ? 's' : ''}`
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return `${months} mois`
    } else {
      const years = Math.floor(diffDays / 365)
      return `${years} an${years > 1 ? 's' : ''}`
    }
  }

  return {
    // État
    state: state.value,
    profile,
    isLoading,
    hasErrors,

    // Actions
    fetchProfile,
    updateProfile,
    changePassword,
    uploadAvatar,
    removeAvatar,
    clearErrors,
    clearError,

    // Utilitaires
    formatDate,
    getInitials,
    getAvatarUrl,
    getMembershipDuration
  }
}
