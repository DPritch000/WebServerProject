import { defineStore } from 'pinia'
import type { User } from '@/types'

const TOKEN_KEY = 'wspp_token'
const USER_KEY = 'wspp_user'

function loadToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

async function parseResponseBody(res: Response): Promise<any> {
  const text = await res.text()
  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: loadToken() as string | null,
    currentUser: loadUser() as User | null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    async login(username: string, password: string): Promise<void> {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await parseResponseBody(res)

      if (!res.ok) {
        throw new Error(data?.error ?? `Login failed (${res.status})`)
      }

      if (!data?.token || !data?.user) {
        throw new Error('Login failed: invalid server response')
      }

      const { token, user } = data
      this.token = token
      this.currentUser = { id: user.id, name: user.username, role: user.role, friends: [] }
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(this.currentUser))
    },
    async signup(username: string, password: string): Promise<void> {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await parseResponseBody(res)

      if (!res.ok) {
        throw new Error(data?.error ?? `Signup failed (${res.status})`)
      }

      if (!data?.token || !data?.user) {
        throw new Error('Signup failed: invalid server response')
      }

      const { token, user } = data
      this.token = token
      this.currentUser = { id: user.id, name: user.username, role: user.role, friends: [] }
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(this.currentUser))
    },
    logout() {
      this.token = null
      this.currentUser = null
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    },
  },
})
