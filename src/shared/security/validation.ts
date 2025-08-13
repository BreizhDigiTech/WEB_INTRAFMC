import { ValidationError } from '@/shared/errors/types'
import DOMPurify from 'dompurify'
import { z } from 'zod'

// Schémas de validation pour les données sensibles
export const LoginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court (min 6 caractères)')
})

export const ProductSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(255, 'Nom trop long'),
  description: z.string().optional(),
  price: z.number().min(0, 'Le prix doit être positif'),
  stock: z.number().int().min(0, 'Le stock doit être un entier positif'),
  category_id: z.number().int().positive().optional()
})

export const FileUploadSchema = z.object({
  name: z.string(),
  size: z.number().max(10 * 1024 * 1024, 'Fichier trop volumineux (max 10MB)'),
  type: z.string().refine(
    (type) => type.startsWith('image/') || type === 'application/pdf',
    'Type de fichier non supporté'
  )
})

// Fonction de validation générique
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]
      throw new ValidationError(firstError.message, firstError.path.join('.'))
    }
    throw error
  }
}

// Sanitisation XSS
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: []
  })
}

export function sanitizeText(text: string): string {
  // Remplacer les caractères potentiellement dangereux
  return text
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
}

// Validation des uploads
export function validateFile(file: File, options: {
  maxSize?: number
  allowedTypes?: string[]
  allowedExtensions?: string[]
} = {}): void {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB par défaut
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf']
  } = options

  // Vérifier la taille
  if (file.size > maxSize) {
    throw new ValidationError(`Fichier trop volumineux (max ${Math.round(maxSize / 1024 / 1024)}MB)`, 'file.size')
  }

  // Vérifier le type MIME
  if (!allowedTypes.includes(file.type)) {
    throw new ValidationError(`Type de fichier non supporté: ${file.type}`, 'file.type')
  }

  // Vérifier l'extension
  const extension = '.' + file.name.split('.').pop()?.toLowerCase()
  if (!allowedExtensions.includes(extension)) {
    throw new ValidationError(`Extension non supportée: ${extension}`, 'file.extension')
  }

  // Vérifier que le nom ne contient pas de caractères dangereux
  if (!/^[a-zA-Z0-9._-]+$/.test(file.name)) {
    throw new ValidationError('Nom de fichier invalide (caractères spéciaux non autorisés)', 'file.name')
  }
}

// Validation des URLs
export function validateUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    return ['http:', 'https:'].includes(parsedUrl.protocol)
  } catch {
    return false
  }
}

// CSRF Token helpers (si implémenté côté backend)
export function getCsrfToken(): string | null {
  const metaTag = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement
  return metaTag?.content || null
}

export function addCsrfToken(headers: Record<string, string>): Record<string, string> {
  const token = getCsrfToken()
  if (token) {
    headers['X-CSRF-TOKEN'] = token
  }
  return headers
}
