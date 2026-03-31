<template>
  <LoginView v-if="!token" />
  <div v-else class="card">
    <div class="app-header">
      <span class="channel-hash">#</span>
      <h1>tasks</h1>
      <span class="header-divider">|</span>
      <p>Stay on top of your tasks</p>
      <button class="btn-logout" @click="logout" title="Log out">↩ Logout</button>
    </div>

    <TaskInput />
    <TaskFilter />
    <TaskList />
    <ToastList />

    <div class="task-footer" v-if="tasks.length > 0">
      <span>{{ remainingCount }} task{{ remainingCount !== 1 ? 's' : '' }} remaining</span>
      <button
        v-if="tasks.some(t => t.completed)"
        class="btn-clear"
        @click="clearCompleted"
      >
        Clear completed
      </button>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useAuth } from './composables/useAuth'
import { useTasks } from './composables/useTasks'
import { useNotifications } from './composables/useNotifications'
import LoginView from './components/LoginView.vue'
import TaskInput from './components/TaskInput.vue'
import TaskFilter from './components/TaskFilter.vue'
import TaskList from './components/TaskList.vue'
import ToastList from './components/ToastList.vue'

const { token, logout } = useAuth()
const { tasks, remainingCount, clearCompleted, fetchTasks } = useTasks()
useNotifications()

// Load tasks once the user is logged in
watch(token, (val) => { if (val) fetchTasks() }, { immediate: true })
</script>
