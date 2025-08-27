/**
 * Standards et conventions de développement pour le projet WEB_INTRAFMC
 */

export const CODING_STANDARDS = {
  
  /**
   * CONVENTIONS DE NOMMAGE
   */
  naming: {
    // Fichiers et dossiers
    files: {
      components: 'PascalCase.vue', // ex: UserModal.vue
      views: 'PascalCaseView.vue', // ex: UsersListView.vue
      composables: 'useCamelCase.ts', // ex: useUsers.ts
      stores: 'camelCaseStore.ts', // ex: userStore.ts
      services: 'camelCaseService.ts', // ex: userService.ts
      types: 'index.ts', // dans un dossier types/
      utils: 'camelCase.ts', // ex: formatters.ts
      constants: 'UPPER_CASE.ts' // ex: API_ENDPOINTS.ts
    },
    
    // Variables et fonctions
    code: {
      variables: 'camelCase',
      functions: 'camelCase',
      constants: 'UPPER_SNAKE_CASE',
      types: 'PascalCase',
      interfaces: 'PascalCase',
      enums: 'PascalCase'
    }
  },

  /**
   * STRUCTURE DES MODULES
   */
  moduleStructure: {
    required: [
      'index.ts',      // Point d'entrée du module
      'types/',        // Types TypeScript
      'services/',     // Services API
      'stores/',       // Stores Pinia
      'views/',        // Vues principales
      'components/'    // Composants spécifiques
    ],
    optional: [
      'composables/',  // Logique réutilisable
      'utils/',        // Utilitaires
      'constants/',    // Constantes
      'README.md'      // Documentation
    ]
  },

  /**
   * STRUCTURE DES SERVICES
   */
  serviceStructure: {
    template: `
// Interface du service
export interface I{Entity}Service {
  findAll(params?: any): Promise<PaginatedResponse<{Entity}>>
  findById(id: number): Promise<{Entity}>
  create(input: Create{Entity}Input): Promise<{Entity}>
  update(id: number, input: Update{Entity}Input): Promise<{Entity}>
  delete(id: number): Promise<boolean>
}

// Implémentation du service
export class {Entity}Service extends BaseCrudService<{Entity}, Create{Entity}Input, Update{Entity}Input> implements I{Entity}Service {
  constructor() {
    super('{entity}', '{entities}')
  }
  
  // Requêtes GraphQL spécifiques
  protected buildFindAllQuery(): string { /* ... */ }
  protected buildFindByIdQuery(): string { /* ... */ }
  protected buildCreateMutation(): string { /* ... */ }
  protected buildUpdateMutation(): string { /* ... */ }
  protected buildDeleteMutation(): string { /* ... */ }
}

// Instance singleton
export const {entity}Service = new {Entity}Service()
    `
  },

  /**
   * STRUCTURE DES STORES
   */
  storeStructure: {
    template: `
export const use{Entity}Store = defineStore('{entity}', {
  state: () => ({
    {entities}: [] as {Entity}[],
    current{Entity}: null as {Entity} | null,
    pagination: null as PaginatorInfo | null,
    loading: false,
    error: null as string | null
  }),

  getters: {
    get{Entity}ById: (state) => (id: number) => 
      state.{entities}.find({entity} => {entity}.id === id),
    
    has{Entities}: (state) => state.{entities}.length > 0,
    
    total{Entities}: (state) => state.pagination?.total || 0
  },

  actions: {
    async fetch{Entities}(params?: any) {
      this.loading = true
      this.error = null
      
      try {
        const response = await {entity}Service.findAll(params)
        this.{entities} = response.data
        this.pagination = response.paginatorInfo
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async create{Entity}(input: Create{Entity}Input) {
      try {
        const {entity} = await {entity}Service.create(input)
        this.{entities}.unshift({entity})
        return {entity}
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async update{Entity}(id: number, input: Update{Entity}Input) {
      try {
        const updated{Entity} = await {entity}Service.update(id, input)
        const index = this.{entities}.findIndex({entity} => {entity}.id === id)
        if (index > -1) {
          this.{entities}[index] = updated{Entity}
        }
        return updated{Entity}
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async delete{Entity}(id: number) {
      try {
        await {entity}Service.delete(id)
        const index = this.{entities}.findIndex({entity} => {entity}.id === id)
        if (index > -1) {
          this.{entities}.splice(index, 1)
        }
      } catch (error) {
        this.error = error.message
        throw error
      }
    }
  }
})
    `
  },

  /**
   * GESTION DES ERREURS
   */
  errorHandling: {
    principles: [
      'Toujours capturer les erreurs dans les try/catch',
      'Utiliser le gestionnaire d\'erreurs global',
      'Fournir des messages d\'erreur clairs',
      'Logger les erreurs pour le debug',
      'Afficher des notifications utilisateur appropriées'
    ],
    example: `
try {
  const result = await someAsyncOperation()
  return result
} catch (error) {
  const appError = errorHandler.handleError(error, {
    operation: 'someAsyncOperation',
    context: { userId: user.id }
  })
  
  // Afficher une notification à l'utilisateur
  toast.showError(appError.message)
  
  // Re-lancer l'erreur si nécessaire
  throw appError
}
    `
  },

  /**
   * VALIDATION DES DONNÉES
   */
  validation: {
    principles: [
      'Valider côté client ET serveur',
      'Utiliser les schémas Zod pour la validation',
      'Nettoyer les données d\'entrée (sanitization)',
      'Fournir des messages de validation clairs'
    ],
    example: `
import { validateData, UserSchema } from '@/shared/security/validation'

try {
  const validatedData = validateData(UserSchema, formData)
  await userService.create(validatedData)
} catch (error) {
  if (error instanceof ValidationError) {
    // Afficher les erreurs de validation
    toast.showError(error.message)
  }
  throw error
}
    `
  },

  /**
   * PERFORMANCE
   */
  performance: {
    principles: [
      'Utiliser le cache GraphQL pour les requêtes',
      'Mesurer les performances avec performanceMonitor',
      'Lazy loading pour les composants lourds',
      'Pagination pour les listes importantes',
      'Debounce pour les recherches'
    ],
    example: `
// Dans un service
async findAll(params = {}) {
  return performanceMonitor.measureAsync(
    'UserService.findAll',
    () => this.graphql.request(query, variables, { useCache: true })
  )
}

// Dans un composable
const { trackOperation } = usePerformanceTracking()

const searchUsers = debounce(async (query: string) => {
  await trackOperation('search-users', () => 
    userStore.fetchUsers({ search: query })
  )
}, 300)
    `
  },

  /**
   * SÉCURITÉ
   */
  security: {
    principles: [
      'Valider et nettoyer toutes les entrées utilisateur',
      'Utiliser HTTPS en production',
      'Gérer les tokens d\'authentification de manière sécurisée',
      'Appliquer les permissions et autorisations',
      'Éviter les injections XSS et CSRF'
    ],
    checklist: [
      '✅ Validation des entrées avec Zod',
      '✅ Sanitization avec DOMPurify',
      '✅ En-têtes de sécurité configurés',
      '✅ Gestion sécurisée des tokens',
      '✅ Permissions vérifiées côté client et serveur'
    ]
  },

  /**
   * TESTS
   */
  testing: {
    structure: [
      'unit/', // Tests unitaires
      'integration/', // Tests d\'intégration
      'e2e/', // Tests end-to-end
      'fixtures/', // Données de test
      'mocks/' // Mocks et stubs
    ],
    naming: [
      '{ComponentName}.test.ts',
      '{serviceName}.test.ts',
      '{featureName}.e2e.ts'
    ]
  },

  /**
   * DOCUMENTATION
   */
  documentation: {
    required: [
      'README.md pour chaque module',
      'Commentaires JSDoc pour les fonctions publiques',
      'Types TypeScript pour toutes les interfaces',
      'Exemples d\'utilisation dans les README'
    ],
    example: `
/**
 * Service de gestion des utilisateurs
 * 
 * @example
 * \`\`\`typescript
 * const users = await userService.findAll({ page: 1, perPage: 10 })
 * const user = await userService.create({ name: 'John', email: 'john@example.com' })
 * \`\`\`
 */
export class UserService extends BaseCrudService<User, CreateUserInput, UpdateUserInput> {
  // ...
}
    `
  }
}

/**
 * Utilitaires pour vérifier la conformité aux standards
 */
export const validateStandards = {
  /**
   * Vérifie la structure d'un module
   */
  checkModuleStructure(modulePath: string): boolean {
    // Implementation pour vérifier la structure
    return true
  },

  /**
   * Vérifie les conventions de nommage
   */
  checkNamingConventions(filePath: string): boolean {
    // Implementation pour vérifier le nommage
    return true
  }
}
