<template>
  <section class="section">
    <div class="container auth-wrap">
      <div class="auth-card box">
        <h1 class="title is-3">Welcome to Workout Tracker</h1>
        <p class="subtitle is-6">Create an account or log in to access the app.</p>

        <div class="tabs is-toggle is-fullwidth" style="margin-bottom: 1.25rem;">
          <ul>
            <li :class="{ 'is-active': mode === 'login' }">
              <a @click.prevent="setMode('login')">Log in</a>
            </li>
            <li :class="{ 'is-active': mode === 'signup' }">
              <a @click.prevent="setMode('signup')">Sign up</a>
            </li>
          </ul>
        </div>

        <p v-if="error" class="has-text-danger" style="margin-bottom: 0.75rem;">{{ error }}</p>

        <form v-if="mode === 'login'" @submit.prevent="handleLogin">
          <div class="field">
            <label class="label">Username</label>
            <div class="control">
              <input
                v-model="loginName"
                class="input"
                type="text"
                autocomplete="username"
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div class="field">
            <button class="button is-link is-fullwidth" type="submit">Log in</button>
          </div>
        </form>

        <form v-else @submit.prevent="handleSignup">
          <div class="field">
            <label class="label">Username</label>
            <div class="control">
              <input
                v-model="signupName"
                class="input"
                type="text"
                autocomplete="username"
                placeholder="Choose a username"
              />
            </div>
          </div>

          <div class="field">
            <label class="label">Profile Picture URL (optional)</label>
            <div class="control">
              <input
                v-model="signupPicture"
                class="input"
                type="url"
                autocomplete="url"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
          </div>

          <div class="field">
            <button class="button is-primary is-fullwidth" type="submit">Create Account</button>
          </div>
        </form>

        <hr />

        <div>
          <p class="has-text-weight-semibold" style="margin-bottom: 0.5rem;">Existing users</p>
          <div class="tags">
            <button
              v-for="u in auth.users"
              :key="u.id"
              class="button is-small"
              style="margin: 0.2rem"
              @click="loginAs(u.name)"
            >
              {{ u.name }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const loginName = ref('')
const signupName = ref('')
const signupPicture = ref('')
const error = ref('')

const mode = computed(() => (route.query.mode === 'signup' ? 'signup' : 'login'))

function setMode(nextMode: 'login' | 'signup') {
  error.value = ''
  router.replace({ name: 'auth', query: { ...route.query, mode: nextMode } })
}

function navigateAfterAuth() {
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
  router.replace(redirect)
}

function loginAs(name: string) {
  error.value = ''
  const user = auth.loginByName(name)
  if (!user) {
    error.value = 'User not found. Please sign up first.'
    return
  }
  navigateAfterAuth()
}

function handleLogin() {
  const name = loginName.value.trim()
  if (!name) {
    error.value = 'Please enter your username.'
    return
  }
  const user = auth.loginByName(name)
  if (!user) {
    error.value = 'No account found with that username.'
    return
  }
  navigateAfterAuth()
}

function handleSignup() {
  const name = signupName.value.trim()
  if (!name) {
    error.value = 'Please choose a username.'
    return
  }

  try {
    auth.signup(name, signupPicture.value)
    navigateAfterAuth()
  } catch (err: any) {
    error.value = err?.message || 'Could not create account.'
  }
}
</script>

<style scoped>
.auth-wrap {
  max-width: 560px;
}

.auth-card {
  margin: 1rem auto;
}
</style>
