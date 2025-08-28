/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_IMAGE_BASE_URL: string
  readonly VITE_SENTRY_DSN: string
  readonly VITE_ERROR_REPORTING_ENDPOINT: string
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
