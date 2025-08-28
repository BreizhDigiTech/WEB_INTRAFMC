/**
 * 🚀 Configuration de production pour WEB_INTRAFMC
 * Optimisations et paramètres prêts pour la production
 */

export const PRODUCTION_CONFIG = {
  // 📊 Configuration des statistiques
  stats: {
    cacheEnabled: true,
    cacheTTL: 300000, // 5 minutes en millisecondes
    maxCacheSize: 100, // Nombre maximum d'entrées en cache
    defaultPageSize: 20,
    maxPageSize: 100,
    enablePagination: true,
    enableValidation: true,
    enableRealTimeUpdates: false, // À activer si WebSocket disponible
  },

  // 🔧 Configuration des APIs
  api: {
    timeout: 30000, // 30 secondes
    retryAttempts: 3,
    retryDelay: 1000, // 1 seconde
    enableErrorReporting: true,
    enablePerformanceMonitoring: true,
  },

  // 🛡️ Configuration de sécurité
  security: {
    enableCSRF: true,
    enableXSSProtection: true,
    enableRateLimiting: true,
    maxRequestsPerMinute: 100,
  },

  // 📈 Configuration du monitoring
  monitoring: {
    enableSentry: process.env.NODE_ENV === 'production',
    enableAnalytics: process.env.NODE_ENV === 'production',
    logLevel: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
  },

  // 🚀 Configuration des performances
  performance: {
    enableLazyLoading: true,
    enableCodeSplitting: true,
    enableCompression: true,
    enableCDN: false, // À configurer selon l'infrastructure
  },

  // 📱 Configuration de l'interface
  ui: {
    enableAnimations: true,
    enableTooltips: true,
    defaultTheme: 'dark',
    enableResponsiveDesign: true,
  }
} as const

// 🎯 Configuration spécifique par environnement
export const getEnvironmentConfig = () => {
  const isDev = process.env.NODE_ENV === 'development'
  const isProd = process.env.NODE_ENV === 'production'

  return {
    ...PRODUCTION_CONFIG,
    // Ajustements pour le développement
    ...(isDev && {
      stats: {
        ...PRODUCTION_CONFIG.stats,
        cacheEnabled: false, // Désactiver le cache en développement
        enableValidation: false, // Validation souple en dev
      },
      monitoring: {
        ...PRODUCTION_CONFIG.monitoring,
        logLevel: 'debug',
        enableSentry: false,
      }
    }),
    // Optimisations pour la production
    ...(isProd && {
      stats: {
        ...PRODUCTION_CONFIG.stats,
        cacheEnabled: true,
        enableValidation: true,
      },
      performance: {
        ...PRODUCTION_CONFIG.performance,
        enableCompression: true,
      }
    })
  }
}

export default PRODUCTION_CONFIG
