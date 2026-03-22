<template>
  <div>
    <TransitionGroup name="task-list" tag="ul" class="task-list">
      <TaskItem
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
      />
    </TransitionGroup>
    <p v-if="filteredTasks.length === 0" class="empty-state">
      No tasks here. Add one above!
    </p>
  </div>
</template>

<script setup>
import { useTasks } from '../composables/useTasks'
import TaskItem from './TaskItem.vue'

const { filteredTasks } = useTasks()
</script>
