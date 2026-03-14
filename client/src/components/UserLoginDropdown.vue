<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const open = ref(false)

function toggle() { open.value = !open.value }
function selectUser(id: number) {
  auth.login(id)
  open.value = false
}
function handleLogout() {
  auth.logout()
}
</script>

<template>
  <div class="user-login">
    <template v-if="!auth.currentUser">
      <div :class="['dropdown', { 'is-active': open }]">
        <div class="dropdown-trigger">
          <button class="button" @click.prevent="toggle">
            <span class="icon"><i class="fa-solid fa-right-to-bracket"></i></span>
            <span>Log in</span>
            <span class="icon is-small"><i class="fas fa-angle-down" aria-hidden="true"></i></span>
          </button>
        </div>
        <div class="dropdown-menu" role="menu">
          <div class="dropdown-content">
            <a v-for="u in auth.users" :key="u.id" class="dropdown-item" @click.prevent="selectUser(u.id)">
              <figure class="image is-32x32" style="margin-right:8px; display:inline-block; vertical-align:middle;">
                <img :src="u.profilePicture" alt="" style="object-fit:cover; border-radius:50%;" />
              </figure>
              <span>{{ u.name }}</span>
            </a>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <button class="button is-danger" @click.prevent="handleLogout">
        <span class="icon"><i class="fa-solid fa-right-from-bracket"></i></span>
        <span>Log out ({{ auth.currentUser?.name }})</span>
      </button>
    </template>
  </div>
</template>

<style scoped>
.dropdown .dropdown-item img { width:32px; height:32px; }
</style>
