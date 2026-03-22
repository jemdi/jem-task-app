<template>
  <div class="task-filter">
    <button
      v-for="option in options"
      :key="option.value"
      class="filter-btn"
      :class="{ active: activeFilter === option.value }"
      @click="setFilter(option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup>
import { useTasks } from '../composables/useTasks'

const { activeFilter, setFilter } = useTasks()

const options = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' }
]
</script>
