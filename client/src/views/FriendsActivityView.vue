<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { vInfiniteScroll } from '@vueuse/components'
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

function loadMore() {
	if (displayedCount.value < combinedPosts.value.length) {
		displayedCount.value = Math.min(displayedCount.value + pageSize.value, combinedPosts.value.length)
		console.debug('[FriendsActivity] loadMore -> displayedCount', displayedCount.value, 'total', combinedPosts.value.length)
	}
}

function canLoadMore() {
	return displayedCount.value < combinedPosts.value.length
}

// ensure displayedCount stays within bounds when source changes
watch(
	combinedPosts,
	(newVal) => {
		displayedCount.value = Math.min(displayedCount.value, newVal.length || 0)
	},
	{ immediate: true }
)

onMounted(() => {
	console.debug('[FriendsActivity] onMounted combinedPosts length', combinedPosts.value.length, 'displayedCount', displayedCount.value)
})
</script>

<template>
	<main>
		<h1>Friends' Activity</h1>
		<div v-if="!auth.currentUser">Please log in to see activity.</div>
		<div v-else style="display:flex; flex-direction:column; align-items:center; width:100%;">
			<div v-if="combinedPosts.length === 0">No recent activity from you or your friends.</div>

			<div v-infinite-scroll="[loadMore, { distance: 200, canLoadMore }]" style="width:100%; display:flex; flex-direction:column; align-items:center;">
				<WorkoutPost v-for="p in displayedPosts" :key="p.id" :post="p" />
				<div v-if="combinedPosts.length > 0" style="height:1px; width:100%;"></div>
				<div style="width:100%; display:flex; justify-content:center; padding:1rem 0">
					<div v-if="canLoadMore()">Loading more…</div>
					<div v-else>End of activity</div>
				</div>
			</div>
		</div>
	</main>
</template>



