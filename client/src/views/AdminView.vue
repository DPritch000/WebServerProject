<template>
  <div>
    <div class="level">
      <div class="level-left">
        <h1 class="title">Admin - Users</h1>
      </div>
    </div>

    <div v-if="error" class="notification is-danger">{{ error }}</div>
    <div v-if="message" class="notification is-success">{{ message }}</div>

    <div class="table-container">
      <table class="table is-fullwidth is-striped is-hoverable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Profile</th>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="5" class="has-text-centered">Loading users...</td>
          </tr>

          <tr v-else-if="users.length === 0">
            <td colspan="5" class="has-text-centered">No users found.</td>
          </tr>

          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>
              <figure class="image is-48x48">
                <img
                  :src="user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random`"
                  alt="profile"
                  @error="(e) => { const t = e.target as HTMLImageElement; t.onerror = null; t.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random` }"
                />
              </figure>
            </td>
            <td>{{ user.username }}</td>
            <td>{{ user.role }}</td>
            <td>
              <div style="display:flex; gap:8px; align-items:center;">
                <button
                  class="button is-small is-primary"
                  title="Make admin"
                  :disabled="user.role === 'admin' || actionLoadingId === user.id"
                  @click="makeAdmin(user.id)"
                >
                  Make Admin
                </button>
                <button
                  class="button is-small is-danger"
                  title="Delete user"
                  :disabled="actionLoadingId === user.id"
                  @click="removeUser(user.id, user.username)"
                >
                  <span class="icon is-small"><i class="fa-solid fa-trash"></i></span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

type AdminUser = {
  id: number
  username: string
  role: 'admin' | 'user'
  profilePicture?: string | null
}

const users = ref<AdminUser[]>([])
const loading = ref(false)
const actionLoadingId = ref<number | null>(null)
const error = ref('')
const message = ref('')

async function fetchUsers() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('/api/users')
    const data = await res.json()
    if (!res.ok) throw new Error(data?.error ?? 'Failed to fetch users')
    users.value = (data as any[]).map(u => ({
      id: u.id,
      username: u.username,
      role: u.role,
      profilePicture: u.profilePicture,
    }))
  } catch (e: any) {
    error.value = e.message ?? 'Failed to fetch users'
  } finally {
    loading.value = false
  }
}

async function makeAdmin(userId: number) {
  actionLoadingId.value = userId
  error.value = ''
  message.value = ''

  try {
    const res = await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'admin' }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.error ?? 'Failed to update role')

    message.value = 'User promoted to admin.'
    await fetchUsers()
  } catch (e: any) {
    error.value = e.message ?? 'Failed to update role'
  } finally {
    actionLoadingId.value = null
  }
}

async function removeUser(userId: number, username: string) {
  if (!confirm(`Delete user ${username}? This cannot be undone.`)) return

  actionLoadingId.value = userId
  error.value = ''
  message.value = ''

  try {
    const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' })
    if (!res.ok && res.status !== 404) {
      const data = await res.json().catch(() => null)
      throw new Error(data?.error ?? 'Failed to delete user')
    }

    message.value = 'User deleted.'
    await fetchUsers()
  } catch (e: any) {
    error.value = e.message ?? 'Failed to delete user'
  } finally {
    actionLoadingId.value = null
  }
}

onMounted(fetchUsers)
</script>
