<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
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

const pageSize = ref(10) // number of posts to load per batch; change this to control batch size
const displayedCount = ref(pageSize.value)
const displayedPosts = computed(() => combinedPosts.value.slice(0, displayedCount.value))
const canLoadMore = computed(() => displayedCount.value < combinedPosts.value.length)

// Sentinel element at the bottom — when it enters the viewport, load the next batch
const sentinel = ref<HTMLElement | null>(null)
useIntersectionObserver(sentinel, ([entry]) => {
  if (entry?.isIntersecting && canLoadMore.value) {
    displayedCount.value = Math.min(displayedCount.value + pageSize.value, combinedPosts.value.length)
  }
})

// When posts first load (empty → non-empty), reset to pageSize so posts appear.
// When source shrinks, clamp displayedCount so we don't reference out-of-bounds.
watch(combinedPosts, (newVal, oldVal) => {
  if ((oldVal?.length ?? 0) === 0 && newVal.length > 0) {
    displayedCount.value = pageSize.value
  } else if (displayedCount.value > newVal.length) {
    displayedCount.value = Math.max(newVal.length, 0)
  }
})
</script>

<template>
	<main>
		<h1>Friends' Activity</h1>
		<div v-if="!auth.currentUser">Please log in to see activity.</div>
		<div v-else style="display:flex; flex-direction:column; align-items:center; width:100%;">
			<div v-if="combinedPosts.length === 0">No recent activity from you or your friends.</div>

			<div style="width:100%; display:flex; flex-direction:column; align-items:center;">
				<WorkoutPost v-for="p in displayedPosts" :key="p.id" :post="p" />
				<!-- sentinel: when this enters the viewport the next batch loads -->
				<div ref="sentinel" style="height:1px; width:100%;"></div>
				<div style="width:100%; display:flex; justify-content:center; padding:1rem 0">
					<div v-if="canLoadMore">Loading more…</div>
					<div v-else>End of activity</div>
				</div>
			</div>
		</div>
	</main>
</template>



