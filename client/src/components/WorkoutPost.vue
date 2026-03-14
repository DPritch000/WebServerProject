<script setup lang="ts">
import type { Workout as PostType, User } from '@/types'
import usersData from '@/data/users.json'
import { computed } from 'vue'

const props = defineProps<{ post: PostType }>()

const user: User | undefined = (usersData as User[]).find(u => u.id === props.post.userId)

const profileImg = computed(() => user?.profilePicture ?? '')
const userName = computed(() => user?.name ?? `User #${props.post.userId}`)
</script>

<template>
  <div class="workout-post box" style="width: 720px; max-width:95%;">
    <div class="media">
      <figure class="media-left" style="margin-right:12px">
        <p class="image is-48x48">
          <img :src="profileImg" alt="avatar" style="width:48px; height:48px; border-radius:50%; object-fit:cover;" />
        </p>
      </figure>
      <div class="media-content">
        <p>
          <strong>{{ props.post.title }}</strong>
          <br />
          <span class="is-size-7 has-text-grey">{{ new Date(props.post.date).toLocaleString() }} • {{ userName }}</span>
        </p>
        <div style="margin-top:8px">{{ props.post.description }}</div>
        <div class="is-size-7 has-text-grey" style="margin-top:8px">{{ props.post.durationMinutes }} min <span v-if="props.post.distanceKm">• {{ props.post.distanceKm }} km</span></div>
      </div>
    </div>

    <div style="margin-top:12px; display:flex; justify-content:center">
      <img :src="props.post.picture" alt="workout" style="width:420px; max-width:100%; height:260px; object-fit:cover; border-radius:8px;" />
    </div>
  </div>
</template>

<style scoped>
.workout-post { margin: 12px auto; }
</style>
