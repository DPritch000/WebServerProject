<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const mode = ref<'login' | 'signup'>('login')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''

  if (!username.value || !password.value) {
    error.value = 'Username and password are required.'
    return
  }

  if (mode.value === 'signup' && password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }

  loading.value = true
  try {
    if (mode.value === 'login') {
      await auth.login(username.value, password.value)
    } else {
      await auth.signup(username.value, password.value)
    }
    router.push('/')
  } catch (err: any) {
    error.value = err.message ?? 'Something went wrong.'
  } finally {
    loading.value = false
  }
}

function switchMode(m: 'login' | 'signup') {
  mode.value = m
  error.value = ''
  username.value = ''
  password.value = ''
  confirmPassword.value = ''
}
</script>

<template>
  <section class="hero is-fullheight-with-navbar">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-5-tablet is-4-desktop">

            <div class="has-text-centered mb-5">
              <h1 class="title is-2">
                <i class="fa-solid fa-person-running mr-2"></i>WorkoutApp
              </h1>
              <p class="subtitle is-6">Track your fitness journey</p>
            </div>

            <div class="box">
              <!-- Tabs -->
              <div class="tabs is-fullwidth mb-4">
                <ul>
                  <li :class="{ 'is-active': mode === 'login' }">
                    <a @click.prevent="switchMode('login')">Log In</a>
                  </li>
                  <li :class="{ 'is-active': mode === 'signup' }">
                    <a @click.prevent="switchMode('signup')">Sign Up</a>
                  </li>
                </ul>
              </div>

              <!-- Error -->
              <div v-if="error" class="notification is-danger is-light py-2 px-3 mb-4">
                {{ error }}
              </div>

              <form @submit.prevent="submit">
                <!-- Username -->
                <div class="field">
                  <label class="label">Username</label>
                  <div class="control has-icons-left">
                    <input
                      v-model="username"
                      class="input"
                      type="text"
                      placeholder="Enter your username"
                      autocomplete="username"
                    />
                    <span class="icon is-left">
                      <i class="fa-solid fa-user"></i>
                    </span>
                  </div>
                </div>

                <!-- Password -->
                <div class="field">
                  <label class="label">Password</label>
                  <div class="control has-icons-left">
                    <input
                      v-model="password"
                      class="input"
                      type="password"
                      placeholder="Enter your password"
                      autocomplete="current-password"
                    />
                    <span class="icon is-left">
                      <i class="fa-solid fa-lock"></i>
                    </span>
                  </div>
                </div>

                <!-- Confirm Password (signup only) -->
                <div v-if="mode === 'signup'" class="field">
                  <label class="label">Confirm Password</label>
                  <div class="control has-icons-left">
                    <input
                      v-model="confirmPassword"
                      class="input"
                      type="password"
                      placeholder="Confirm your password"
                      autocomplete="new-password"
                    />
                    <span class="icon is-left">
                      <i class="fa-solid fa-lock"></i>
                    </span>
                  </div>
                </div>

                <!-- Submit -->
                <div class="field mt-5">
                  <button
                    class="button is-info is-fullwidth"
                    type="submit"
                    :class="{ 'is-loading': loading }"
                  >
                    {{ mode === 'login' ? 'Log In' : 'Create Account' }}
                  </button>
                </div>
              </form>

              <p class="has-text-centered mt-3 is-size-7 has-text-grey">
                <template v-if="mode === 'login'">
                  Don't have an account?
                  <a @click.prevent="switchMode('signup')">Sign up</a>
                </template>
                <template v-else>
                  Already have an account?
                  <a @click.prevent="switchMode('login')">Log in</a>
                </template>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>
