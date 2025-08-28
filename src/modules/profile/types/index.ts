/**
 * Types pour le module profil utilisateur
 */

import type { DateTime } from '@/shared/types'

export interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  birth_date?: string
  avatar?: string
  is_admin: boolean
  is_active: boolean
  email_verified_at?: string
  created_at?: string | DateTime
  updated_at?: string | DateTime
}

export interface UpdateProfileInput {
  id: string
  name?: string
  email?: string
  phone?: string
  address?: string
  birth_date?: string
  avatar?: string
}

export interface ChangePasswordInput {
  current_password: string
  new_password: string
  confirm_password: string
}

export interface ProfileFormData {
  name: string
  email: string
  phone: string
  address: string
  birth_date: string
}

export interface PasswordFormData {
  current_password: string
  new_password: string
  confirm_password: string
}

export interface ProfileState {
  profile: UserProfile | null
  loading: {
    profile: boolean
    updateProfile: boolean
    changePassword: boolean
    uploadAvatar: boolean
  }
  error: {
    profile: string | null
    updateProfile: string | null
    changePassword: string | null
    uploadAvatar: string | null
  }
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
}
