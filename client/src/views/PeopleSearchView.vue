<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { PublicUser } from '@/types'

const auth = useAuthStore()
const users = ref<PublicUser[]>([])
const loading = ref(false)
const error = ref('')

async function loadPeople() {
  if (!auth.currentUser) return
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`/api/users/public/list?viewerId=${auth.currentUser.id}`)
    if (!res.ok) throw new Error('Failed to load users')
    users.value = await res.json() as PublicUser[]
  } catch (e: any) {
    error.value = e.message ?? 'Failed to load users'
  } finally {
    loading.value = false
  }
}

async function follow(userId: number) {
  if (!auth.currentUser) return
  const res = await fetch(`/api/users/${userId}/follow`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ followerId: auth.currentUser.id }),
  })
  if (!res.ok) return
  await auth.refreshFollowing()
  await loadPeople()
}

async function unfollow(userId: number) {
  if (!auth.currentUser) return
  const res = await fetch(`/api/users/${userId}/follow?followerId=${auth.currentUser.id}`, {
    method: 'DELETE',
  })
  if (!res.ok) return
  await auth.refreshFollowing()
  await loadPeople()
}

onMounted(loadPeople)
</script>

<template>
  <main class="section">
    <h1 class="title">People Search</h1>
    <p class="subtitle">Follow users to see and comment on their posts.</p>

    <div v-if="!auth.currentUser" class="notification is-warning">
      Please log in first.
    </div>

    <div v-else>
      <div v-if="loading">Loading users...</div>
      <div v-else-if="error" class="notification is-danger">{{ error }}</div>
      <div v-else-if="users.length === 0" class="notification is-light">No users found.</div>

      <div v-else class="columns is-multiline">
        <div v-for="u in users" :key="u.id" class="column is-half">
          <div class="box" style="display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:10px;">
              <img
                :src="u.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.username)}&background=random`"
                alt="profile"
                style="width:40px; height:40px; border-radius:50%; object-fit:cover;"
                @error="(e) => { const t = e.target as HTMLImageElement; t.onerror = null; t.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.username)}&background=random` }"
              />
              <div>
                <p><strong>{{ u.username }}</strong></p>
              <p class="is-size-7 has-text-grey">Role: {{ u.role }}</p>
              </div>
            </div>
            <button
              v-if="!u.isFollowing"
              class="button is-primary is-small"
              @click="follow(u.id)"
            >
              Follow
            </button>
            <button
              v-else
              class="button is-light is-small"
              @click="unfollow(u.id)"
            >
              Following
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
