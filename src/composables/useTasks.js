import { ref, computed } from 'vue'

const tasks = ref([])
const activeFilter = ref('all')

const filteredTasks = computed(() => {
  if (activeFilter.value === 'active') return tasks.value.filter(t => !t.completed)
  if (activeFilter.value === 'completed') return tasks.value.filter(t => t.completed)
  return tasks.value
})

const remainingCount = computed(() => tasks.value.filter(t => !t.completed).length)

async function fetchTasks() {
  const res = await fetch('/api/tasks')
  tasks.value = await res.json()
}

async function addTask(title, scheduledAt = null) {
  const trimmed = title.trim()
  if (!trimmed) return
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: trimmed, scheduledAt: scheduledAt || null })
  })
  const newTask = await res.json()
  tasks.value.push(newTask)
}

async function toggleTask(id) {
  const task = tasks.value.find(t => t.id === id)
  if (!task) return
  const res = await fetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: !task.completed })
  })
  const updated = await res.json()
  const index = tasks.value.findIndex(t => t.id === id)
  if (index !== -1) tasks.value[index] = updated
}

async function updateTask(id, newTitle, scheduledAt) {
  const trimmed = newTitle.trim()
  if (!trimmed) return
  const res = await fetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: trimmed, scheduledAt: scheduledAt || null })
  })
  const updated = await res.json()
  const index = tasks.value.findIndex(t => t.id === id)
  if (index !== -1) tasks.value[index] = updated
}

async function deleteTask(id) {
  await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
  const index = tasks.value.findIndex(t => t.id === id)
  if (index !== -1) tasks.value.splice(index, 1)
}

async function clearCompleted() {
  await fetch('/api/tasks/completed', { method: 'DELETE' })
  tasks.value = tasks.value.filter(t => !t.completed)
}

function setFilter(value) {
  activeFilter.value = value
}

fetchTasks()

export function useTasks() {
  return {
    tasks,
    filteredTasks,
    activeFilter,
    remainingCount,
    addTask,
    toggleTask,
    updateTask,
    deleteTask,
    clearCompleted,
    setFilter
  }
}
