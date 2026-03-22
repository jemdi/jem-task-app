<template>
  <li class="task-item" :class="{ completed: task.completed }">
    <input
      type="checkbox"
      class="task-checkbox"
      :checked="task.completed"
      @change="toggleTask(task.id)"
    />

    <template v-if="isEditing">
      <input
        ref="editInput"
        v-model="editTitle"
        class="task-edit-input"
        @keyup.enter="save"
        @keyup.escape="cancel"
      />
      <div class="task-actions">
        <button class="btn btn-save" @click="save">Save</button>
        <button class="btn btn-cancel" @click="cancel">Cancel</button>
      </div>
    </template>

    <template v-else>
      <span class="task-title" :class="{ done: task.completed }">{{ task.title }}</span>
      <div class="task-actions">
        <button class="btn btn-edit" @click="startEdit">Edit</button>
        <button class="btn btn-danger" @click="deleteTask(task.id)" title="Delete">✕</button>
      </div>
    </template>
  </li>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useTasks } from '../composables/useTasks'

const props = defineProps({
  task: { type: Object, required: true }
})

const { toggleTask, updateTask, deleteTask } = useTasks()

const isEditing = ref(false)
const editTitle = ref('')
const editInput = ref(null)

async function startEdit() {
  editTitle.value = props.task.title
  isEditing.value = true
  await nextTick()
  editInput.value?.focus()
}

function save() {
  if (!editTitle.value.trim()) return
  updateTask(props.task.id, editTitle.value)
  isEditing.value = false
}

function cancel() {
  isEditing.value = false
}
</script>
