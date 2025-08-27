/**
 * Module Profile - Point d'entrée
 */

// Vues
export { default as ProfileView } from './views/ProfileView.vue'

// Composants
export { default as ProfileInfoForm } from './components/ProfileInfoForm.vue'
export { default as ProfileSecurityForm } from './components/ProfileSecurityForm.vue'

// Services
export { profileService } from './services/profileService'

// Composables
export { useProfile } from './composables/useProfile'

// Types
export type {
    ApiResponse, ChangePasswordInput, PasswordFormData, ProfileFormData, ProfileState, UpdateProfileInput, UserProfile
} from './types'

