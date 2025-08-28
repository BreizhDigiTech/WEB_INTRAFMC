/**
 * Index global des modules - Point d'entrée centralisé
 */

// Modules exports
export * as Arrivals from './arrivals'
export * as Categories from './categories'
export * as Dashboard from './dashboard'
export * as Ecommerce from './ecommerce'
export * as Orders from './orders'
export * as Products from './products'
export * as Profile from './profile'
export * as Users from './users'

// Re-exports des types les plus utilisés
export type { Category } from './categories/types'
export type { Order, OrderFilters, OrderStatus } from './orders/types'
export type { Product, ProductFilters } from './products/types'
export type { User } from './users/types'

