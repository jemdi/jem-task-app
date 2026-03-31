import { ref, computed } from 'vue'
import { useAuth } from './useAuth'

const API = import.meta.env.VITE_API_URL || ''

function toISO(localString) {
  if (!localString) return null
  return new Date(localString).toISOString()
}

function authHeaders() {
  const { token } = useAuth()
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token.value}`
  }
}

const tasks = ref([])
const activeFilter = ref('all')
const loading = ref(false)

const filteredTasks = computed(() => {
  if (activeFilter.value === 'active') return tasks.value.filter(t => !t.completed)
  if (activeFilter.value === 'completed') return tasks.value.filter(t => t.completed)
  return tasks.value
})

const remainingCount = computed(() => tasks.value.filter(t => !t.completed).length)

async function fetchTasks() {
  loading.value = true
  try {
    const res = await fetch(`${API}/api/tasks`, { headers: authHeaders() })
    tasks.value = await res.json()
  } finally {
    loading.value = false
  }
}

async function addTask(title, scheduledAt = null, notes = null) {
  const trimmed = title.trim()
  if (!trimmed) return
  const res = await fetch(`${API}/api/tasks`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ title: trimmed, scheduledAt: toISO(scheduledAt), notes: notes || null })
  })
  const newTask = await res.json()
  tasks.value.push(newTask)
}

async function toggleTask(id) {
  const task = tasks.value.find(t => t.id === id)
  if (!task) return
  const res = await fetch(`${API}/api/tasks/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ completed: !task.completed })
  })
  const updated = await res.json()
  const index = tasks.value.findIndex(t => t.id === id)
  if (index !== -1) tasks.value[index] = updated
}

async function updateTask(id, newTitle, scheduledAt, notes) {
  const trimmed = newTitle.trim()
  if (!trimmed) return
  const res = await fetch(`${API}/api/tasks/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ title: trimmed, scheduledAt: toISO(scheduledAt), notes: notes || null })
  })
  const updated = await res.json()
  const index = tasks.value.findIndex(t => t.id === id)
  if (index !== -1) tasks.value[index] = updated
}

async function deleteTask(id) {
  await fetch(`${API}/api/tasks/${id}`, { method: 'DELETE', headers: authHeaders() })
  const index = tasks.value.findIndex(t => t.id === id)
  if (index !== -1) tasks.value.splice(index, 1)
}

async function clearCompleted() {
  await fetch(`${API}/api/tasks/completed`, { method: 'DELETE', headers: authHeaders() })
  tasks.value = tasks.value.filter(t => !t.completed)
}

function setFilter(value) {
  activeFilter.value = value
}

export function useTasks() {
  return {
    tasks,
    filteredTasks,
    activeFilter,
    loading,
    remainingCount,
    fetchTasks,
    addTask,
    toggleTask,
    updateTask,
    deleteTask,
    clearCompleted,
    setFilter
  }
}
