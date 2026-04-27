<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="user-login">
    <template v-if="auth.currentUser">
      <button class="button is-danger" @click.prevent="handleLogout">
        <span class="icon"><i class="fa-solid fa-right-from-bracket"></i></span>
        <span>Log out ({{ auth.currentUser.name }})</span>
      </button>
    </template>
  </div>
</template>

<style scoped></style>
