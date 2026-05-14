<script setup lang="ts">
import type { Workout as PostType } from '@/types'
import { computed, onMounted, ref } from 'vue'
import { useCommentsStore } from '@/stores/comments'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{ post: PostType }>()
const commentsStore = useCommentsStore()
const auth = useAuthStore()
const newComment = ref('')
const commentError = ref('')

const userName = computed(() => props.post.authorUsername ?? `User #${props.post.userId}`)
const userPicture = computed(
  () => props.post.authorProfilePicture ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(userName.value)}&background=random`
)
const comments = computed(() => commentsStore.commentsByPost[props.post.id] ?? [])

onMounted(async () => {
  if (!auth.currentUser) return
  await commentsStore.fetchComments(props.post.id, auth.currentUser.id)
})

async function submitComment() {
  if (!auth.currentUser || !newComment.value.trim()) return
  commentError.value = ''

  try {
    await commentsStore.addComment(props.post.id, auth.currentUser.id, newComment.value.trim())
    newComment.value = ''
  } catch (e: any) {
    commentError.value = e.message ?? 'Failed to add comment'
  }
}
</script>

<template>
  <div class="workout-post box" style="width: 720px; max-width:95%;">
    <div class="media">
      <div class="media-left" style="margin-right:12px;">
        <img
          :src="userPicture"
          alt="author profile"
          style="width:48px; height:48px; border-radius:50%; object-fit:cover;"
          @error="(e) => { const t = e.target as HTMLImageElement; t.onerror = null; t.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random` }"
        />
      </div>
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
      <img
        :src="props.post.picture || 'https://placehold.co/420x260?text=No+Image'"
        alt="workout"
        style="width:420px; max-width:100%; height:260px; object-fit:cover; border-radius:8px;"
        @error="(e) => { const t = e.target as HTMLImageElement; t.onerror = null; t.src = 'https://placehold.co/420x260?text=No+Image' }"
      />
    </div>

    <div style="margin-top:12px; border-top:1px solid #eee; padding-top:12px;">
      <p class="is-size-7 has-text-grey" style="margin-bottom:8px;">Comments</p>

      <div v-if="comments.length === 0" class="is-size-7 has-text-grey">No comments yet.</div>
      <div v-for="c in comments" :key="c.id" style="margin-bottom:8px; display:flex; align-items:center; gap:8px;">
        <img
          :src="c.authorProfilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.authorUsername || 'Unknown user')}&background=random`"
          alt="comment author profile"
          style="width:24px; height:24px; border-radius:50%; object-fit:cover;"
          @error="(e) => { const t = e.target as HTMLImageElement; t.onerror = null; t.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.authorUsername || 'Unknown user')}&background=random` }"
        />
        <div>
          <strong class="is-size-7">{{ c.authorUsername ?? 'Unknown user' }}</strong>
          <span class="is-size-7">: {{ c.content }}</span>
        </div>
      </div>

      <div v-if="auth.currentUser" style="display:flex; gap:8px; margin-top:10px;">
        <input
          v-model="newComment"
          class="input is-small"
          type="text"
          placeholder="Write a comment..."
        />
        <button class="button is-small is-primary" @click="submitComment">Comment</button>
      </div>
      <div v-if="commentError" class="has-text-danger is-size-7" style="margin-top:6px;">{{ commentError }}</div>
    </div>
  </div>
</template>

<style scoped>
.workout-post { margin: 12px auto; }
</style>
