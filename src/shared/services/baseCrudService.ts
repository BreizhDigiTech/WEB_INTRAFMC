/**
 * Service de base générique pour les opérations CRUD
 * Élimine la duplication de code entre les services
 */

import { performanceMonitor } from '@/shared/monitoring/performance'
import { GraphQLService } from './graphql'

export interface PaginatedResponse<T> {
  data: T[]
  paginatorInfo: {
    currentPage: number
    lastPage: number
    perPage: number
    total: number
    hasMorePages: boolean
  }
}

export interface CrudOperations<T, CreateInput, UpdateInput> {
  findAll(params?: any): Promise<PaginatedResponse<T>>
  findById(id: number): Promise<T>
  create(input: CreateInput): Promise<T>
  update(id: number, input: UpdateInput): Promise<T>
  delete(id: number): Promise<boolean>
}

export abstract class BaseCrudService<T, CreateInput, UpdateInput> 
  implements CrudOperations<T, CreateInput, UpdateInput> {
  
  protected graphql: GraphQLService
  protected entityName: string
  protected entityNamePlural: string

  constructor(
    entityName: string,
    entityNamePlural?: string,
    graphqlService?: GraphQLService
  ) {
    this.entityName = entityName
    this.entityNamePlural = entityNamePlural || `${entityName}s`
    this.graphql = graphqlService || new GraphQLService()
  }

  /**
   * Récupère tous les éléments avec pagination
   */
  async findAll(params: {
    page?: number
    perPage?: number
    search?: string
    filters?: Record<string, any>
    orderBy?: string
    orderDirection?: 'ASC' | 'DESC'
  } = {}): Promise<PaginatedResponse<T>> {
    const operationName = `${this.constructor.name}.findAll`
    
    return performanceMonitor.measureAsync(operationName, async () => {
      const query = this.buildFindAllQuery()
      const variables = this.buildFindAllVariables(params)
      
      const response = await this.graphql.request<any>(query, variables, {
        useCache: true,
        cacheTTL: 2 * 60 * 1000 // 2 minutes
      })
      
      return this.transformPaginatedResponse(response)
    })
  }

  /**
   * Récupère un élément par son ID
   */
  async findById(id: number): Promise<T> {
    const operationName = `${this.constructor.name}.findById`
    
    return performanceMonitor.measureAsync(operationName, async () => {
      const query = this.buildFindByIdQuery()
      const variables = { id }
      
      const response = await this.graphql.request<any>(query, variables, {
        useCache: true,
        cacheTTL: 5 * 60 * 1000 // 5 minutes
      })
      
      return this.transformSingleResponse(response)
    })
  }

  /**
   * Crée un nouvel élément
   */
  async create(input: CreateInput): Promise<T> {
    const operationName = `${this.constructor.name}.create`
    
    return performanceMonitor.measureAsync(operationName, async () => {
      const mutation = this.buildCreateMutation()
      const variables = { input: this.transformCreateInput(input) }
      
      const response = await this.graphql.request<any>(mutation, variables)
      
      // Invalider le cache après création
      this.graphql.invalidateCache(this.entityName)
      
      return this.transformSingleResponse(response)
    })
  }

  /**
   * Met à jour un élément existant
   */
  async update(id: number, input: UpdateInput): Promise<T> {
    const operationName = `${this.constructor.name}.update`
    
    return performanceMonitor.measureAsync(operationName, async () => {
      const mutation = this.buildUpdateMutation()
      const variables = { 
        id, 
        input: this.transformUpdateInput(input) 
      }
      
      const response = await this.graphql.request<any>(mutation, variables)
      
      // Invalider le cache après mise à jour
      this.graphql.invalidateCache(this.entityName)
      
      return this.transformSingleResponse(response)
    })
  }

  /**
   * Supprime un élément
   */
  async delete(id: number): Promise<boolean> {
    const operationName = `${this.constructor.name}.delete`
    
    return performanceMonitor.measureAsync(operationName, async () => {
      const mutation = this.buildDeleteMutation()
      const variables = { id }
      
      const response = await this.graphql.request<any>(mutation, variables)
      
      // Invalider le cache après suppression
      this.graphql.invalidateCache(this.entityName)
      
      return this.transformDeleteResponse(response)
    })
  }

  // Méthodes abstraites à implémenter dans les classes filles
  protected abstract buildFindAllQuery(): string
  protected abstract buildFindByIdQuery(): string
  protected abstract buildCreateMutation(): string
  protected abstract buildUpdateMutation(): string
  protected abstract buildDeleteMutation(): string

  // Méthodes de transformation par défaut (peuvent être surchargées)
  protected buildFindAllVariables(params: any): any {
    return {
      page: params.page || 1,
      first: params.perPage || 10,
      search: params.search || '',
      ...params.filters,
      orderBy: params.orderBy ? [{
        column: params.orderBy,
        order: params.orderDirection || 'ASC'
      }] : undefined
    }
  }

  protected transformCreateInput(input: CreateInput): any {
    return input
  }

  protected transformUpdateInput(input: UpdateInput): any {
    return input
  }

  protected transformPaginatedResponse(response: any): PaginatedResponse<T> {
    const data = response[this.entityNamePlural]
    return {
      data: data.data,
      paginatorInfo: data.paginatorInfo
    }
  }

  protected transformSingleResponse(response: any): T {
    const actionKey = Object.keys(response)[0]
    return response[actionKey]
  }

  protected transformDeleteResponse(response: any): boolean {
    const actionKey = Object.keys(response)[0]
    return response[actionKey] === true || response[actionKey]?.success === true
  }

  /**
   * Méthodes utilitaires pour construire les fragments GraphQL
   */
  protected buildFragment(fields: string[]): string {
    return fields.join('\n    ')
  }

  protected buildPaginatorFragment(): string {
    return `
      paginatorInfo {
        currentPage
        lastPage
        perPage
        total
        hasMorePages
      }
    `
  }
}
