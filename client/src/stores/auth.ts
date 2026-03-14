import { defineStore } from 'pinia'
import type { User } from '@/types'
import usersData from '@/data/users.json'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUserId: null as number | null,
    users: usersData as User[],
  }),
  getters: {
    currentUser(state) {
      return state.users.find(u => u.id === state.currentUserId) ?? null
    }
  },
  actions: {
    login(userId: number) {
      this.currentUserId = userId
    },
    logout() {
      this.currentUserId = null
    }
  }
})
