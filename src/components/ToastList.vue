<template>
  <div class="toast-list">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="toast.type"
        @click="remove(toast.id)"
      >
        <span class="toast-icon">{{ toast.type === 'warning' ? '⏰' : '🔔' }}</span>
        <div class="toast-body">
          <div class="toast-title">{{ toast.title }}</div>
          <div class="toast-message">{{ toast.message }}</div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useNotifications } from '../composables/useNotifications'

const { toasts, remove } = useNotifications()
</script>
