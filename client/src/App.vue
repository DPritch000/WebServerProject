<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue';
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const auth = useAuthStore()

onMounted(async () => {
  if (!auth.currentUser) return
  await auth.refreshFollowing()
})
</script>

<template>
  <NavBar v-if="route.name !== 'login'" />
  <div class="container">
    <RouterView />
  </div>
</template>

<style scoped></style>
