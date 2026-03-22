<template>
  <form class="task-input-form" @submit.prevent="submit">
    <input
      v-model="newTitle"
      type="text"
      placeholder="Add a new task..."
      autocomplete="off"
    />
    <button type="submit" class="btn btn-primary">Add</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useTasks } from '../composables/useTasks'

const { addTask } = useTasks()
const newTitle = ref('')

function submit() {
  if (!newTitle.value.trim()) return
  addTask(newTitle.value)
  newTitle.value = ''
}
</script>
