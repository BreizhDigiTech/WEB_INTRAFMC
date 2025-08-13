// Types d'erreurs de l'application
export class AppError extends Error {
  public readonly code: string
  public readonly statusCode?: number
  public readonly context?: Record<string, any>

  constructor(
    message: string, 
    code: string = 'UNKNOWN_ERROR', 
    statusCode?: number,
    context?: Record<string, any>
  ) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.statusCode = statusCode
    this.context = context
  }
}

export class ValidationError extends AppError {
  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', 400, { field })
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Non authentifié') {
    super(message, 'AUTH_ERROR', 401)
    this.name = 'AuthenticationError'
  }
}

export class GraphQLError extends AppError {
  public readonly extensions?: Record<string, any>

  constructor(message: string, extensions?: Record<string, any>) {
    super(message, 'GRAPHQL_ERROR', 400, extensions)
    this.name = 'GraphQLError'
    this.extensions = extensions
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Erreur de connexion') {
    super(message, 'NETWORK_ERROR', 0)
    this.name = 'NetworkError'
  }
}

export class FileUploadError extends AppError {
  constructor(message: string, fileName?: string) {
    super(message, 'UPLOAD_ERROR', 400, { fileName })
    this.name = 'FileUploadError'
  }
}
