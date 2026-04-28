<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usePostsStore } from '@/stores/posts'
import WorkoutPost from '@/components/WorkoutPost.vue'

const auth = useAuthStore()
const posts = usePostsStore()

const combinedPosts = computed(() => {
	if (!auth.currentUser) return []
	return posts.posts
})

onMounted(async () => {
  if (!auth.currentUser) return
  await auth.refreshFollowing()
  await posts.fetchFeed(auth.currentUser.id)
})
</script>

<template>
	<main>
		<h1>Friends' Activity</h1>
		<div v-if="!auth.currentUser">Please log in to see activity.</div>
		<div v-else style="display:flex; flex-direction:column; align-items:center; width:100%;">
			<div v-if="combinedPosts.length === 0">No recent activity from you or your friends.</div>
			<WorkoutPost v-for="p in combinedPosts" :key="p.id" :post="p" />
		</div>
	</main>
</template>

 

