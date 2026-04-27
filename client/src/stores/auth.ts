import { defineStore } from 'pinia'
import type { User } from '@/types'
import usersData from '@/data/users.json'

const TOKEN_STORAGE_KEY = 'ws_token'
const USERS_STORAGE_KEY = 'ws_users'
const DEMO_MODE_STORAGE_KEY = 'ws_demo_mode'

const API_BASE = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api'
  : '/api'

function loadToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null
}

function loadDemoUsers(): User[] {
  if (typeof window === 'undefined') return usersData as User[]
  const raw = localStorage.getItem(USERS_STORAGE_KEY)
  if (!raw) return usersData as User[]
  try {
    const parsed = JSON.parse(raw) as User[]
    return Array.isArray(parsed) && parsed.length ? parsed : (usersData as User[])
  } catch {
    return usersData as User[]
  }
}

function isDemoMode(): boolean {
  return typeof window !== 'undefined' ? localStorage.getItem(DEMO_MODE_STORAGE_KEY) === 'true' : false
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: loadToken() as string | null,
    currentUser: null as User | null,
    users: loadDemoUsers() as User[],
    isLoading: false,
    error: null as string | null,
  }),
  getters: {
    isAuthenticated(state) {
      return !!state.token || !!state.currentUser
    }
  },
  actions: {
    persistToken(token: string | null) {
      if (typeof window === 'undefined') return
      if (token === null) {
        localStorage.removeItem(TOKEN_STORAGE_KEY)
      } else {
        localStorage.setItem(TOKEN_STORAGE_KEY, token)
      }
    },
    setDemoMode(enabled: boolean) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(DEMO_MODE_STORAGE_KEY, String(enabled))
      }
    },
    async apiLogin(username: string, password: string) {
      this.isLoading = true
      this.error = null
      try {
        console.log(`Attempting to login to ${API_BASE}/auth/login`)
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || `Login failed (${res.status})`)
        this.token = data.token
        this.currentUser = data.user
        this.persistToken(data.token)
        this.setDemoMode(false)
        return this.currentUser
      } catch (err: any) {
        const msg = err?.message || 'Login failed'
        console.error('Login error:', msg, err)
        this.error = msg
        throw err
      } finally {
        this.isLoading = false
      }
    },
    async apiSignup(username: string, password: string, name?: string) {
      this.isLoading = true
      this.error = null
      try {
        console.log(`Attempting to signup at ${API_BASE}/auth/register`)
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, name }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || `Signup failed (${res.status})`)
        this.token = data.token
        this.currentUser = data.user
        this.persistToken(data.token)
        this.setDemoMode(false)
        return this.currentUser
      } catch (err: any) {
        const msg = err?.message || 'Signup failed'
        console.error('Signup error:', msg, err)
        this.error = msg
        throw err
      } finally {
        this.isLoading = false
      }
    },
    async fetchMe() {
      if (!this.token) return null
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { 'Authorization': `Bearer ${this.token}` },
        })
        if (!res.ok) throw new Error('Failed to fetch user')
        const data = await res.json()
        this.currentUser = data.user
        return this.currentUser
      } catch (err) {
        this.token = null
        this.currentUser = null
        this.persistToken(null)
        return null
      }
    },
    loginByName(name: string) {
      const normalized = name.trim().toLowerCase()
      const user = this.users.find(u => u.name.trim().toLowerCase() === normalized)
      if (!user) return null
      this.currentUser = user
      this.setDemoMode(true)
      return user
    },
    async init() {
      // On app load, if we have a token, try to fetch the user
      if (this.token && !this.currentUser) {
        await this.fetchMe()
      }
    },
    logout() {
      this.token = null
      this.currentUser = null
      this.persistToken(null)
      this.setDemoMode(false)
    }
  }
})
