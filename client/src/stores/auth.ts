import { defineStore } from 'pinia'
import type { User } from '@/types'
import usersData from '@/data/users.json'

const USERS_STORAGE_KEY = 'ws_users'
const CURRENT_USER_STORAGE_KEY = 'ws_current_user_id'

function loadUsers(): User[] {
  const raw = localStorage.getItem(USERS_STORAGE_KEY)
  if (!raw) return usersData as User[]
  try {
    const parsed = JSON.parse(raw) as User[]
    return Array.isArray(parsed) && parsed.length ? parsed : (usersData as User[])
  } catch {
    return usersData as User[]
  }
}

function loadCurrentUserId(): number | null {
  const raw = localStorage.getItem(CURRENT_USER_STORAGE_KEY)
  if (!raw) return null
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUserId: loadCurrentUserId() as number | null,
    users: loadUsers() as User[],
  }),
  getters: {
    currentUser(state) {
      return state.users.find(u => u.id === state.currentUserId) ?? null
    }
  },
  actions: {
    persist() {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users))
      if (this.currentUserId === null) {
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY)
      } else {
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, String(this.currentUserId))
      }
    },
    loginByName(name: string) {
      const normalized = name.trim().toLowerCase()
      const user = this.users.find(u => u.name.trim().toLowerCase() === normalized)
      if (!user) return null
      this.currentUserId = user.id
      this.persist()
      return user
    },
    login(userId: number) {
      this.currentUserId = userId
      this.persist()
    },
    signup(name: string, profilePicture?: string) {
      const cleanName = name.trim()
      if (!cleanName) throw new Error('Name is required')
      const exists = this.users.some(u => u.name.trim().toLowerCase() === cleanName.toLowerCase())
      if (exists) throw new Error('A user with that name already exists')

      const nextId = this.users.reduce((max, u) => Math.max(max, u.id), 0) + 1
      const newUser: User = {
        id: nextId,
        name: cleanName,
        friends: [],
        role: 'user',
        profilePicture: profilePicture?.trim() || undefined,
      }
      this.users.push(newUser)
      this.currentUserId = newUser.id
      this.persist()
      return newUser
    },
    logout() {
      this.currentUserId = null
      this.persist()
    }
  }
})
