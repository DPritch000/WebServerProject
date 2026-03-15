<template>
  <div>
    <div class="level">
      <div class="level-left">
        <h1 class="title">Admin - Users</h1>
      </div>
      <div class="level-right">
        <button class="button is-danger">
          <span class="icon is-small"><i class="fa-solid fa-plus"></i></span>
          <span>Add User</span>
        </button>
      </div>
    </div>

    <div class="table-container">
      <table class="table is-fullwidth is-striped is-hoverable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Profile</th>
            <th>Name</th>
            <th>Role</th>
            <th>Friends</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>
              <figure class="image is-48x48">
                <img :src="user.profilePicture" alt="profile" />
              </figure>
            </td>
            <td>{{ user.name }}</td>
            <td>{{ user.role }}</td>
            <td>{{ friendNames(user) }}</td>
            <td>
              <div style="display:flex; gap:8px; align-items:center;">
                <button class="button is-small is-light" title="Edit user">
                  <span class="icon is-small"><i class="fa-solid fa-pen"></i></span>
                </button>
                <button class="button is-small is-danger" title="Delete user">
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
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/types'

const auth = useAuthStore()

// users is User[]
const users = computed<User[]>(() => auth.users)


// map of id -> user
const userMap = computed<Record<number, User>>(() =>
  Object.fromEntries(
    users.value.map((u: User) => [u.id, u])
  )
)


// function with proper type
function friendNames(user: User): string {
  if (!user.friends || user.friends.length === 0) return '-'

  return user.friends
    .map((id: number) =>
      userMap.value[id]?.name ?? String(id)
    )
    .join(', ')
}
</script>
