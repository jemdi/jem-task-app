import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'jem-tasks'

function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const tasks = ref(loadFromStorage())
const activeFilter = ref('all')

watch(tasks, (val) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
}, { deep: true })

const filteredTasks = computed(() => {
  if (activeFilter.value === 'active') return tasks.value.filter(t => !t.completed)
  if (activeFilter.value === 'completed') return tasks.value.filter(t => t.completed)
  return tasks.value
})

const remainingCount = computed(() => tasks.value.filter(t => !t.completed).length)

function addTask(title) {
  const trimmed = title.trim()
  if (!trimmed) return
  tasks.value.push({
    id: crypto.randomUUID(),
    title: trimmed,
    completed: false,
    createdAt: new Date().toISOString()
  })
}

function toggleTask(id) {
  const task = tasks.value.find(t => t.id === id)
  if (task) task.completed = !task.completed
}

function updateTask(id, newTitle) {
  const trimmed = newTitle.trim()
  if (!trimmed) return
  const task = tasks.value.find(t => t.id === id)
  if (task) task.title = trimmed
}

function deleteTask(id) {
  const index = tasks.value.findIndex(t => t.id === id)
  if (index !== -1) tasks.value.splice(index, 1)
}

function clearCompleted() {
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
    remainingCount,
    addTask,
    toggleTask,
    updateTask,
    deleteTask,
    clearCompleted,
    setFilter
  }
}
