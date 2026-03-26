<template>
  <li class="task-item" :class="{ completed: task.completed, overdue: isOverdue }">
    <input
      type="checkbox"
      class="task-checkbox"
      :checked="task.completed"
      @change="toggleTask(task.id)"
    />

    <template v-if="isEditing">
      <div class="task-edit-fields">
        <input
          ref="editInput"
          v-model="editTitle"
          class="task-edit-input"
          @keyup.enter="save"
          @keyup.escape="cancel"
        />
        <input
          v-model="editScheduledAt"
          type="datetime-local"
          class="task-edit-time"
        />
        <textarea
          v-model="editNotes"
          class="task-edit-notes"
          placeholder="Notes (optional)"
          rows="2"
        />
      </div>
      <div class="task-actions">
        <button class="btn btn-save" @click="save">Save</button>
        <button class="btn btn-cancel" @click="cancel">Cancel</button>
      </div>
    </template>

    <template v-else>
      <div class="task-info">
        <span class="task-title" :class="{ done: task.completed }">{{ task.title }}</span>
        <span v-if="task.scheduledAt" class="task-time" :class="{ overdue: isOverdue }">
          {{ isOverdue ? '⚠ Overdue · ' : '🕐 ' }}{{ formatTime(task.scheduledAt) }}
        </span>
        <span v-if="task.notes" class="task-notes">{{ task.notes }}</span>
      </div>
      <div class="task-actions">
        <button class="btn btn-edit" @click="startEdit">Edit</button>
        <button class="btn btn-danger" @click="deleteTask(task.id)" title="Delete">✕</button>
      </div>
    </template>
  </li>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useTasks } from '../composables/useTasks'

const props = defineProps({
  task: { type: Object, required: true }
})

const { toggleTask, updateTask, deleteTask } = useTasks()

const isEditing = ref(false)
const editTitle = ref('')
const editScheduledAt = ref('')
const editNotes = ref('')
const editInput = ref(null)

const isOverdue = computed(() => {
  if (!props.task.scheduledAt || props.task.completed) return false
  return new Date(props.task.scheduledAt) < new Date()
})

function formatTime(isoString) {
  return new Date(isoString).toLocaleString(undefined, {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  })
}

function toLocalInput(isoString) {
  const d = new Date(isoString)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

async function startEdit() {
  editTitle.value = props.task.title
  editScheduledAt.value = props.task.scheduledAt
    ? toLocalInput(props.task.scheduledAt)
    : ''
  editNotes.value = props.task.notes || ''
  isEditing.value = true
  await nextTick()
  editInput.value?.focus()
}

function save() {
  if (!editTitle.value.trim()) return
  updateTask(props.task.id, editTitle.value, editScheduledAt.value || null, editNotes.value || null)
  isEditing.value = false
}

function cancel() {
  isEditing.value = false
}
</script>
