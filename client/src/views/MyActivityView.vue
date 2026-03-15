<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePostsStore } from '@/stores/posts'
import workoutsData from '@/data/workouts.json'
import WorkoutPost from '@/components/WorkoutPost.vue'

import type { Workout } from '@/types'


const auth = useAuthStore()
const posts = usePostsStore()


// type workouts.json inline (no new type file)
const workouts = workoutsData as {
  id: number
  name: string
  type: string
  photo: string
}[]


const showForm = ref(false)

const selectedWorkoutId = ref<number | null>(
  workouts[0]?.id ?? null
)

const description = ref('')
const durationMinutes = ref<number | null>(null)
const distanceKm = ref<number | null>(null)

const date = ref(
  new Date().toISOString().slice(0,16)
)

const editingId = ref<number | null>(null)


const userPosts = computed<Workout[]>(() => {
  if (!auth.currentUser) return []
  return posts.postsByUser(auth.currentUser.id)
})


const route = useRoute()

const accessError = computed(
  () => route.query?.error === 'not-admin'
)


function toggleForm() {
  showForm.value = !showForm.value
}


function submit() {

  if (!auth.currentUser) {
    alert('Please log in first')
    return
  }

  // EDIT
  if (editingId.value) {

    posts.updatePost(editingId.value, {
      description: description.value || undefined,
      durationMinutes: Number(durationMinutes.value || 0),
      distanceKm: distanceKm.value ?? undefined,
      date: new Date(date.value).toISOString(),
    })

    editingId.value = null
    showForm.value = false

    description.value = ''
    durationMinutes.value = null
    distanceKm.value = null
    date.value = new Date().toISOString().slice(0,16)

    return
  }


  // ADD
  if (!selectedWorkoutId.value || !durationMinutes.value) {
    alert('Choose workout + duration')
    return
  }

  posts.addPost({
    userId: auth.currentUser.id,
    workoutId: selectedWorkoutId.value,
    description: description.value || undefined,
    durationMinutes: Number(durationMinutes.value),
    distanceKm: distanceKm.value ?? undefined,
    date: new Date(date.value).toISOString(),
    title: ''
  })


  description.value = ''
  durationMinutes.value = null
  distanceKm.value = null
  date.value = new Date().toISOString().slice(0,16)

  showForm.value = false
}


function startEdit(p: Workout) {

  editingId.value = p.id

  description.value = p.description ?? ''
  durationMinutes.value = p.durationMinutes ?? null
  distanceKm.value = p.distanceKm ?? null

  date.value =
    new Date(p.date)
      .toISOString()
      .slice(0,16)

  showForm.value = true
}


function deletePost(id: number) {

  if (!confirm('Delete this post?')) return

  posts.removePost(id)

  if (editingId.value === id) {

    editingId.value = null

    description.value = ''
    durationMinutes.value = null
    distanceKm.value = null
    date.value = new Date().toISOString().slice(0,16)

    showForm.value = false
  }
}

</script>

<template>
  <main style="padding-top:4rem">
    <h1>My Activity</h1>
    <div v-if="accessError" class="notification is-danger" style="max-width:720px; margin:12px auto; text-align:center;">
      You are not an admin and cannot access the requested page.
    </div>

    <div style="margin:48px 0 16px; display:flex; justify-content:center; width:100%">
      <button class="button is-danger is-large" @click="toggleForm" style="font-weight:700">
        Add Workout
      </button>
    </div>

    <div v-if="showForm" class="box" style="width:720px; max-width:95%; margin:0 auto;">
      <div class="field">
        <label class="label">Workout</label>
        <div class="control">
          <div class="select is-fullwidth">
            <select v-model.number="selectedWorkoutId">
              <option v-for="w in workoutsData" :key="w.id" :value="w.id">{{ w.name }} — {{ w.type }}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="field">
        <label class="label">Description (optional)</label>
        <div class="control">
          <textarea class="textarea" v-model="description" placeholder="Notes..."></textarea>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-body">
          <div class="field">
            <label class="label">Duration (minutes)</label>
            <div class="control">
              <input type="number" min="0" class="input" v-model.number="durationMinutes" />
            </div>
          </div>

          <div class="field">
            <label class="label">Distance (km) — optional</label>
            <div class="control">
              <input type="number" step="0.01" min="0" class="input" v-model.number="distanceKm" />
            </div>
          </div>

          <div class="field">
            <label class="label">Date/time</label>
            <div class="control">
              <input type="datetime-local" class="input" v-model="date" />
            </div>
          </div>
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button class="button is-primary" @click="submit">Post Workout</button>
        </div>
        <div class="control">
          <button class="button" @click="toggleForm">Cancel</button>
        </div>
      </div>
    </div>

    <section style="margin-top:24px; display:flex; flex-direction:column; align-items:center;">
      <h2 class="title is-4">Your Workouts</h2>
      <div v-if="!auth.currentUser">Please log in to see and add workouts.</div>
      <div v-else style="width:100%; display:flex; flex-direction:column; align-items:center;">
        <div v-if="userPosts.length === 0">No workouts yet.</div>
        <div v-for="p in userPosts" :key="p.id" style="width:100%; display:flex; flex-direction:column; align-items:center;">
          <WorkoutPost :post="p" />
          <div style="margin:8px 0; display:flex; gap:8px;">
            <button class="button is-small is-info" @click="startEdit(p)">Edit</button>
            <button class="button is-small is-danger" @click="deletePost(p.id)">Delete</button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>


