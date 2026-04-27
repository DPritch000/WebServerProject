<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue';

const route = useRoute()
</script>

<template>
  <NavBar v-if="route.name !== 'login'" />
  <div class="container">
    <RouterView />
  </div>
</template>

<style scoped></style>
