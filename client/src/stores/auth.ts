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
    async updateProfilePicture(profilePicture: string): Promise<void> {
      if (!this.currentUser) {
        throw new Error('Not logged in')
      }

      const res = await fetch(`/api/users/${this.currentUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profilePicture }),
      })

      const data = await parseResponseBody(res)
      if (!res.ok) {
        throw new Error(data?.error ?? `Failed to update profile picture (${res.status})`)
      }

      this.currentUser = {
        ...this.currentUser,
        profilePicture: data?.profile_picture ?? profilePicture,
        name: data?.username ?? this.currentUser.name,
      }
      localStorage.setItem(USER_KEY, JSON.stringify(this.currentUser))
    },

    async refreshFollowing(): Promise<void> {
      if (!this.currentUser) return
      const res = await fetch(`/api/users/${this.currentUser.id}/following`)
      if (!res.ok) return

      const data = await parseResponseBody(res)
      this.currentUser = {
        ...this.currentUser,
        friends: Array.isArray(data?.followingIds) ? data.followingIds : [],
      }
      localStorage.setItem(USER_KEY, JSON.stringify(this.currentUser))
    },

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
      this.currentUser = {
        id: user.id,
        name: user.username,
        role: user.role,
        profilePicture: user.profilePicture,
        friends: [],
      }
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(this.currentUser))
      await this.refreshFollowing()
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
      this.currentUser = {
        id: user.id,
        name: user.username,
        role: user.role,
        profilePicture: user.profilePicture,
        friends: [],
      }
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(this.currentUser))
      await this.refreshFollowing()
    },
    logout() {
      this.token = null
      this.currentUser = null
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    },
  },
})
