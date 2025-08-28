/**
 * Types pour la gestion des utilisateurs (Admin) - Alignés avec API GraphQL
 */

import type { JSON } from '@/shared/types'

export interface User {
    id: string
    name: string
    email: string
    phone?: string
    address?: string
    birth_date?: string
    avatar?: string
    avatar_original_name?: string
    avatar_size?: number
    is_admin: boolean
    is_active: boolean
    email_verified_at?: string
    created_at: string
    updated_at: string
}

export interface UserStatistics {
    userId: string
    userName: string
    email: string
    totalOrders: number
    totalAmount: number
    averageOrderValue: number
    orderFrequency: number
    daysSinceFirstOrder: number
    favoriteProducts: JSON
    orderHistory: JSON
}

export interface UserFilterInput {
    is_active?: boolean
    is_admin?: boolean
}

export interface CreateUserInput {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
  address?: string
  birth_date?: string
  avatar?: string
  is_admin?: boolean
  is_active?: boolean
}

export interface UpdateUserInput {
  id: string
  name?: string
  email?: string
  phone?: string
  address?: string
  birth_date?: string
  avatar?: string
  is_active?: boolean
  is_admin?: boolean
}

export interface UserFormData {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone: string
  address: string
  birth_date: string
  is_admin: boolean
  is_active: boolean
}

export interface UserListFilters {
  search?: string
  is_admin?: boolean
  is_active?: boolean
  page?: number
  first?: number
}

export interface UsersState {
  users: User[]
  selectedUser: User | null
  loading: {
    users: boolean
    createUser: boolean
    updateUser: boolean
    deleteUser: boolean
  }
  error: {
    users: string | null
    createUser: string | null
    updateUser: string | null
    deleteUser: string | null
  }
  pagination: {
    currentPage: number
    totalPages: number
    total: number
    perPage: number
  }
  filters: UserListFilters
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
}

export interface PaginatedUsers {
  data: User[]
  current_page: number
  last_page: number
  total: number
  per_page: number
}
