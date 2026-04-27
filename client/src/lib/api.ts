// API helper to include auth token in all requests

export const API_BASE = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api'
  : '/api'

export async function apiFetch(path: string, options: RequestInit = {}, token?: string | null) {
  const url = `${API_BASE}${path}`
  const headers = new Headers(options.headers || {})
  
  // Add auth token if available
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  })
  
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || `API error: ${response.status}`)
  }
  
  return data
}
