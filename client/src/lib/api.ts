const rawBase = import.meta.env.VITE_API_BASE_URL?.trim() ?? '/api'
const normalizedBase = rawBase.replace(/\/$/, '')

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${normalizedBase}${normalizedPath}`
}
