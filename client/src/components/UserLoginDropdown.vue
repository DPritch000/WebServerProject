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
        <img
          :src="auth.currentUser.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.currentUser.name)}&background=random`"
          alt="current user profile"
          style="width:22px; height:22px; border-radius:50%; object-fit:cover; margin-right:8px;"
          @error="(e) => { const t = e.target as HTMLImageElement; t.onerror = null; t.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.currentUser!.name)}&background=random` }"
        />
        <span class="icon"><i class="fa-solid fa-right-from-bracket"></i></span>
        <span>Log out ({{ auth.currentUser.name }})</span>
      </button>
    </template>
  </div>
</template>

<style scoped></style>
