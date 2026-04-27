<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import NavBar from './components/NavBar.vue';

const auth = useAuthStore()
</script>

<template>

  <NavBar v-if="auth.currentUser" />
  <div class="container">
    <RouterView />
  </div>

</template>

<style scoped></style>
