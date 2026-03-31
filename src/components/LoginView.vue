<template>
  <div class="login-bg">
    <div class="login-card">
      <div class="login-header">
        <span class="login-hash">#</span>
        <h1>tasks</h1>
      </div>
      <p class="login-subtitle">Welcome back! Sign in to continue.</p>

      <form class="login-form" @submit.prevent="submit">
        <div class="login-field">
          <label>Username</label>
          <input
            v-model="username"
            type="text"
            placeholder="Enter your username"
            autocomplete="username"
            autofocus
          />
        </div>
        <div class="login-field">
          <label>Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Enter your password"
            autocomplete="current-password"
          />
        </div>
        <p v-if="error" class="login-error">{{ error }}</p>
        <button class="btn btn-primary login-btn" type="submit" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Log In' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

const { login } = useAuth()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await login(username.value, password.value)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
