<template>
  <div>
    <div class="level">
      <div class="level-left">
        <h1 class="title">Admin - Users</h1>
      </div>
      <div class="level-right">
        <button class="button is-info">
          <span class="icon is-small"><i class="fa-solid fa-users-plus"></i></span>
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
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const users = computed(() => auth.users)

const userMap = computed(() => Object.fromEntries(users.value.map((u: any) => [u.id, u])))

function friendNames(user: any) {
  if (!user.friends || user.friends.length === 0) return '-'
  return user.friends.map((id: number) => userMap.value[id]?.name ?? String(id)).join(', ')
}
</script>
