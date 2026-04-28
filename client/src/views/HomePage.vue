<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usePostsStore } from '@/stores/posts'

const auth = useAuthStore()
const posts = usePostsStore()
const profilePictureUrl = ref('')
const profileSaveMessage = ref('')
const profileSaveError = ref('')

onMounted(async () => {
  if (!auth.currentUser) return
  profilePictureUrl.value = auth.currentUser.profilePicture ?? ''
  await posts.fetchByUser(auth.currentUser.id, auth.currentUser.id)
})

async function saveProfilePicture() {
  if (!auth.currentUser) return
  profileSaveMessage.value = ''
  profileSaveError.value = ''

  try {
    await auth.updateProfilePicture(profilePictureUrl.value.trim())
    profileSaveMessage.value = 'Profile picture updated.'
    profilePictureUrl.value = auth.currentUser.profilePicture ?? ''
  } catch (e: any) {
    profileSaveError.value = e.message ?? 'Failed to update profile picture'
  }
}

const now = new Date()
const msDay = 24 * 60 * 60 * 1000
const msWeek = msDay * 7
const msMonth = msDay * 30
const msYear = msDay * 365

function computeStats(ms: number) {
  if (!auth.currentUser) return { posts: 0, distanceKm: 0, durationMinutes: 0 }
  const list = posts.postsByUser(auth.currentUser.id)
  const since = +now - ms
  const filtered = list.filter(p => (+new Date(p.date)) >= since)
  const postsCount = filtered.length
  const distanceKm = filtered.reduce((s, p) => s + (p.distanceKm ? Number(p.distanceKm) : 0), 0)
  const durationMinutes = filtered.reduce((s, p) => s + (p.durationMinutes ? Number(p.durationMinutes) : 0), 0)
  return { posts: postsCount, distanceKm, durationMinutes }
}

const todayStats = computed(() => computeStats(msDay))
const weekStats = computed(() => computeStats(msWeek))
const monthStats = computed(() => computeStats(msMonth))
const yearStats = computed(() => computeStats(msYear))

function formatDistance(km: number) {
  return `${km.toFixed(1)} km`
}

function formatDuration(minutes: number) {
  if (minutes <= 0) return '0 min'
  const hrs = Math.floor(minutes / 60)
  const mins = Math.round(minutes % 60)
  if (hrs > 0) return `${hrs}h ${mins}m`
  return `${mins} min`
}
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="has-text-centered">
        <img
          v-if="auth.currentUser"
          :src="auth.currentUser.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.currentUser.name)}&background=random`"
          alt="current user profile"
          style="width:56px; height:56px; border-radius:50%; object-fit:cover; margin-bottom:12px;"
          @error="(e) => { const t = e.target as HTMLImageElement; t.onerror = null; t.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.currentUser!.name)}&background=random` }"
        />
        <h1 class="title">Welcome{{ auth.currentUser ? `, ${auth.currentUser.name}` : '' }}!</h1>
        <p class="subtitle">Quick snapshot of your recent activity based on your posts.</p>
      </div>

      <div class="columns is-centered" style="margin-top:2rem">
        <div class="column is-half">
          <div class="box">
            <div class="level">
              <div class="level-left">
                <div>
                  <h2 class="title is-5">Recent Activity</h2>
                  <p class="subtitle is-6">Counts are derived from your posts' timestamps.</p>
                </div>
              </div>
            </div>

            <div class="columns is-mobile is-multiline is-centered" style="margin-top:1rem">
              <div class="column is-3">
                <div class="box has-text-centered">
                  <p class="heading">Today</p>
                  <p class="title">{{ todayStats.posts }}</p>
                  <p class="subtitle is-6">{{ formatDistance(todayStats.distanceKm) }} • {{ formatDuration(todayStats.durationMinutes) }}</p>
                </div>
              </div>

              <div class="column is-3">
                <div class="box has-text-centered">
                  <p class="heading">This Week</p>
                  <p class="title">{{ weekStats.posts }}</p>
                  <p class="subtitle is-6">{{ formatDistance(weekStats.distanceKm) }} • {{ formatDuration(weekStats.durationMinutes) }}</p>
                </div>
              </div>

              <div class="column is-3">
                <div class="box has-text-centered">
                  <p class="heading">This Month</p>
                  <p class="title">{{ monthStats.posts }}</p>
                  <p class="subtitle is-6">{{ formatDistance(monthStats.distanceKm) }} • {{ formatDuration(monthStats.durationMinutes) }}</p>
                </div>
              </div>

              <div class="column is-3">
                <div class="box has-text-centered">
                  <p class="heading">This Year</p>
                  <p class="title">{{ yearStats.posts }}</p>
                  <p class="subtitle is-6">{{ formatDistance(yearStats.distanceKm) }} • {{ formatDuration(yearStats.durationMinutes) }}</p>
                </div>
              </div>
            </div>

            <div class="has-text-centered" style="margin-top:0.5rem">
              <small v-if="!auth.currentUser">Log in to see your personal stats.</small>
              <small v-else>Based on posts you've created.</small>
            </div>
          </div>
        </div>
      </div>

      <section v-if="auth.currentUser" class="box" style="width:720px; max-width:95%; margin:16px auto 0;">
        <h2 class="title is-5">Profile Picture</h2>
        <div style="display:flex; align-items:center; gap:14px; margin-bottom:12px;">
          <img
            :src="auth.currentUser.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.currentUser.name)}&background=random`"
            alt="profile"
            style="width:56px; height:56px; border-radius:50%; object-fit:cover;"
            @error="(e) => { const t = e.target as HTMLImageElement; t.onerror = null; t.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.currentUser!.name)}&background=random` }"
          />
          <div style="flex:1;">
            <label class="label">Profile picture URL</label>
            <input
              v-model="profilePictureUrl"
              class="input"
              type="url"
              placeholder="https://example.com/my-photo.jpg"
            />
          </div>
          <button class="button is-primary" @click="saveProfilePicture">Save</button>
        </div>
        <p v-if="profileSaveMessage" class="has-text-success is-size-7">{{ profileSaveMessage }}</p>
        <p v-if="profileSaveError" class="has-text-danger is-size-7">{{ profileSaveError }}</p>
      </section>
    </div>
  </section>
</template>
