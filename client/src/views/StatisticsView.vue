<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usePostsStore } from '@/stores/posts'
import workoutsData from '@/data/workouts.json'

const auth = useAuthStore()
const posts = usePostsStore()

onMounted(async () => {
  if (!auth.currentUser) return
  await posts.fetchByUser(auth.currentUser.id, auth.currentUser.id)
})

const userPosts = computed(() => {
  if (!auth.currentUser) return []
  return posts.postsByUser(auth.currentUser.id)
})

// ── Summary stats ──────────────────────────────────────────────
const totalWorkouts = computed(() => userPosts.value.length)
const totalMinutes  = computed(() => userPosts.value.reduce((s, p) => s + p.durationMinutes, 0))
const totalHours    = computed(() => (totalMinutes.value / 60).toFixed(1))
const totalDistance = computed(() => {
  const d = userPosts.value.reduce((s, p) => s + (p.distanceKm ?? 0), 0)
  return d.toFixed(1)
})
const avgDuration   = computed(() =>
  totalWorkouts.value ? Math.round(totalMinutes.value / totalWorkouts.value) : 0
)

const longestWorkout = computed(() =>
  userPosts.value.reduce((best, p) => p.durationMinutes > (best?.durationMinutes ?? 0) ? p : best, null as typeof userPosts.value[0] | null)
)
const bestDistance = computed(() =>
  userPosts.value.filter(p => p.distanceKm).reduce((best, p) => (p.distanceKm ?? 0) > (best?.distanceKm ?? 0) ? p : best, null as typeof userPosts.value[0] | null)
)

// ── Workout type breakdown ──────────────────────────────────────
const typeBreakdown = computed(() => {
  const counts: Record<string, number> = {}
  for (const p of userPosts.value) {
    counts[p.title] = (counts[p.title] ?? 0) + 1
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
})

const maxTypeCount = computed(() => typeBreakdown.value[0]?.[1] ?? 1)

// ── Last 7 days activity ────────────────────────────────────────
const last7Days = computed(() => {
  const days: { label: string; date: string; minutes: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString('en-US', { weekday: 'short' })
    const minutes = userPosts.value
      .filter(p => p.date.slice(0, 10) === dateStr)
      .reduce((s, p) => s + p.durationMinutes, 0)
    days.push({ label, date: dateStr, minutes })
  }
  return days
})

const maxDayMinutes = computed(() => Math.max(...last7Days.value.map(d => d.minutes), 1))

// ── Streak ─────────────────────────────────────────────────────
const currentStreak = computed(() => {
  const activeDays = new Set(userPosts.value.map(p => p.date.slice(0, 10)))
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    if (activeDays.has(d.toISOString().slice(0, 10))) streak++
    else if (i > 0) break
  }
  return streak
})

// ── Most active month ───────────────────────────────────────────
const mostActiveMonth = computed(() => {
  const counts: Record<string, number> = {}
  for (const p of userPosts.value) {
    const key = p.date.slice(0, 7)
    counts[key] = (counts[key] ?? 0) + 1
  }
  const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
  if (!best) return '—'
  const [yr, mo] = best[0].split('-')
  return new Date(Number(yr), Number(mo) - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' })
})

// ── Workout type colour map ─────────────────────────────────────
const typeColours: Record<string, string> = {
  'Morning Run': '#23d160', 'Evening Yoga': '#9b59b6', 'Strength Training': '#e74c3c',
  'Cycling': '#f39c12', 'Swimming': '#3498db', 'HIIT Workout': '#e67e22',
  'Pilates': '#1abc9c', 'Boxing': '#c0392b', 'Rowing': '#2980b9',
  'Martial Arts': '#8e44ad', 'Stretching': '#27ae60',
}
function colourFor(title: string) {
  return typeColours[title] ?? '#485fc7'
}
</script>

<template>
  <main style="padding-top:4rem; max-width:900px; margin:0 auto; padding-left:16px; padding-right:16px;">
    <h1 class="title is-3" style="margin-bottom:1.5rem;">My Statistics</h1>

    <div v-if="!auth.currentUser" class="notification is-warning">
      Please log in to see your statistics.
    </div>

    <template v-else-if="totalWorkouts === 0">
      <div class="notification is-info">
        No workouts logged yet. Head over to <strong>My Activity</strong> to add your first workout!
      </div>
    </template>

    <template v-else>

      <!-- ── Summary cards ── -->
      <div class="columns is-multiline" style="margin-bottom:1rem;">
        <div class="column is-half-tablet is-one-quarter-desktop">
          <div class="box has-text-centered" style="padding:1.25rem;">
            <p class="heading">Total Workouts</p>
            <p class="title is-2 has-text-primary">{{ totalWorkouts }}</p>
          </div>
        </div>
        <div class="column is-half-tablet is-one-quarter-desktop">
          <div class="box has-text-centered" style="padding:1.25rem;">
            <p class="heading">Total Time</p>
            <p class="title is-2 has-text-info">{{ totalHours }}<span class="is-size-5"> hrs</span></p>
          </div>
        </div>
        <div class="column is-half-tablet is-one-quarter-desktop">
          <div class="box has-text-centered" style="padding:1.25rem;">
            <p class="heading">Total Distance</p>
            <p class="title is-2 has-text-success">{{ totalDistance }}<span class="is-size-5"> km</span></p>
          </div>
        </div>
        <div class="column is-half-tablet is-one-quarter-desktop">
          <div class="box has-text-centered" style="padding:1.25rem;">
            <p class="heading">Avg Duration</p>
            <p class="title is-2 has-text-warning">{{ avgDuration }}<span class="is-size-5"> min</span></p>
          </div>
        </div>
      </div>

      <!-- ── Streak + best month ── -->
      <div class="columns" style="margin-bottom:1rem;">
        <div class="column is-half">
          <div class="box" style="padding:1.25rem; display:flex; align-items:center; gap:16px;">
            <span style="font-size:2.4rem;">🔥</span>
            <div>
              <p class="heading">Current Streak</p>
              <p class="title is-4" style="margin-bottom:0;">{{ currentStreak }} day{{ currentStreak !== 1 ? 's' : '' }}</p>
            </div>
          </div>
        </div>
        <div class="column is-half">
          <div class="box" style="padding:1.25rem; display:flex; align-items:center; gap:16px;">
            <span style="font-size:2.4rem;">📅</span>
            <div>
              <p class="heading">Most Active Month</p>
              <p class="title is-4" style="margin-bottom:0;">{{ mostActiveMonth }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Personal bests ── -->
      <div class="columns" style="margin-bottom:1rem;">
        <div class="column is-half">
          <div class="box" style="padding:1.25rem;">
            <p class="heading" style="margin-bottom:8px;">🏅 Longest Workout</p>
            <template v-if="longestWorkout">
              <p><strong>{{ longestWorkout.title }}</strong></p>
              <p class="is-size-7 has-text-grey">{{ longestWorkout.durationMinutes }} min · {{ new Date(longestWorkout.date).toLocaleDateString() }}</p>
            </template>
            <p v-else class="has-text-grey">—</p>
          </div>
        </div>
        <div class="column is-half">
          <div class="box" style="padding:1.25rem;">
            <p class="heading" style="margin-bottom:8px;">🚀 Best Distance</p>
            <template v-if="bestDistance">
              <p><strong>{{ bestDistance.title }}</strong></p>
              <p class="is-size-7 has-text-grey">{{ bestDistance.distanceKm }} km · {{ new Date(bestDistance.date).toLocaleDateString() }}</p>
            </template>
            <p v-else class="has-text-grey">No distance recorded yet</p>
          </div>
        </div>
      </div>

      <!-- ── Last 7 days bar chart ── -->
      <div class="box" style="padding:1.5rem; margin-bottom:1rem;">
        <p class="heading" style="margin-bottom:1rem; font-size:0.85rem;">Activity — Last 7 Days (minutes)</p>
        <div style="display:flex; align-items:flex-end; gap:8px; height:120px;">
          <div
            v-for="day in last7Days"
            :key="day.date"
            style="flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; height:100%;"
          >
            <span class="is-size-7 has-text-grey" style="min-height:16px;">
              {{ day.minutes > 0 ? day.minutes + 'm' : '' }}
            </span>
            <div style="width:100%; flex:1; display:flex; align-items:flex-end;">
              <div
                :style="{
                  width: '100%',
                  height: day.minutes > 0 ? Math.max(4, Math.round((day.minutes / maxDayMinutes) * 80)) + 'px' : '3px',
                  background: day.minutes > 0 ? '#485fc7' : '#e0e0e0',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.3s',
                }"
              />
            </div>
            <span class="is-size-7 has-text-grey">{{ day.label }}</span>
          </div>
        </div>
      </div>

      <!-- ── Workout type breakdown ── -->
      <div class="box" style="padding:1.5rem;">
        <p class="heading" style="margin-bottom:1rem; font-size:0.85rem;">Workout Type Breakdown</p>
        <div v-for="[title, count] in typeBreakdown" :key="title" style="margin-bottom:10px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
            <span class="is-size-7">{{ title }}</span>
            <span class="is-size-7 has-text-grey">{{ count }} session{{ count !== 1 ? 's' : '' }}</span>
          </div>
          <div style="background:#f0f0f0; border-radius:4px; height:10px; overflow:hidden;">
            <div
              :style="{
                width: Math.round((count / maxTypeCount) * 100) + '%',
                height: '100%',
                background: colourFor(title),
                borderRadius: '4px',
                transition: 'width 0.4s',
              }"
            />
          </div>
        </div>
      </div>

    </template>
  </main>
</template>
