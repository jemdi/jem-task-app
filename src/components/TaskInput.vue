<template>
  <form class="task-input-form" @submit.prevent="submit">
    <div class="task-input-row">
      <input
        v-model="newTitle"
        type="text"
        placeholder="Add a new task..."
        autocomplete="off"
      />
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
    <div class="task-input-time">
      <label for="scheduledAt">Schedule for:</label>
      <input
        id="scheduledAt"
        v-model="scheduledAt"
        type="datetime-local"
      />
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useTasks } from '../composables/useTasks'

const { addTask } = useTasks()
const newTitle = ref('')
const scheduledAt = ref('')

function submit() {
  if (!newTitle.value.trim()) return
  addTask(newTitle.value, scheduledAt.value || null)
  newTitle.value = ''
  scheduledAt.value = ''
}
</script>
