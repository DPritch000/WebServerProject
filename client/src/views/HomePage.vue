<template>
  <section class="section">
    <div class="container">
      <div class="has-text-centered">
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
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usePostsStore } from '@/stores/posts'

const auth = useAuthStore()
const posts = usePostsStore()

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
