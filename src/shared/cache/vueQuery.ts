import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import type { App } from 'vue'

export function setupVueQuery(app: App) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Cache par défaut de 5 minutes
        staleTime: 5 * 60 * 1000,
        // Garder en cache 10 minutes après inactivité
        gcTime: 10 * 60 * 1000,
        // Retry automatique en cas d'échec
        retry: (failureCount, error: any) => {
          // Ne pas retry les erreurs d'auth
          if (error?.statusCode === 401) return false
          // Retry 3 fois max
          return failureCount < 3
        },
        // Refetch en arrière-plan quand la fenêtre redevient active
        refetchOnWindowFocus: true,
        // Ne pas refetch automatiquement au montage si on a des données récentes
        refetchOnMount: 'always'
      },
      mutations: {
        // Retry automatique pour les mutations
        retry: 1
      }
    }
  })

  app.use(VueQueryPlugin, {
    queryClient,
    enableDevtoolsV6Plugin: import.meta.env.DEV
  })

  return queryClient
}
