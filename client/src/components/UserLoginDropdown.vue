<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

function goToLogin() {
  router.push({ name: 'auth', query: { mode: 'login' } })
}

function handleLogout() {
  auth.logout()
  router.push({ name: 'auth', query: { mode: 'login' } })
}
</script>

<template>
  <div class="user-login">
    <template v-if="!auth.currentUser">
      <button class="button" @click.prevent="goToLogin">
        <span class="icon"><i class="fa-solid fa-right-to-bracket"></i></span>
        <span>Log in</span>
      </button>
    </template>

    <template v-else>
      <button class="button is-danger" @click.prevent="handleLogout">
        <span class="icon"><i class="fa-solid fa-right-from-bracket"></i></span>
        <span>Log out ({{ auth.currentUser?.name }})</span>
      </button>
    </template>
  </div>
</template>

<style scoped></style>
