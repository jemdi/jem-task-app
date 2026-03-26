import { watch, ref } from 'vue'
import { useTasks } from './useTasks'

const notified = new Set()
const toasts = ref([])

// Single shared AudioContext — created once, resumed on user interaction
let audioCtx = null

function getAudioCtx() {
  if (!audioCtx) audioCtx = new AudioContext()
  return audioCtx
}

// Unlock audio on first user interaction so sounds play reliably
function unlockAudio() {
  getAudioCtx().resume()
  document.removeEventListener('click', unlockAudio)
  document.removeEventListener('keydown', unlockAudio)
}
document.addEventListener('click', unlockAudio)
document.addEventListener('keydown', unlockAudio)

function remove(id) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

function addToast(title, message, type) {
  const id = Date.now()
  toasts.value.push({ id, title, message, type })
  setTimeout(() => remove(id), 6000)
}

function playSound() {
  const ctx = getAudioCtx()
  ctx.resume().then(() => {
    function beep(startTime, freq, duration) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.3, startTime)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
      osc.start(startTime)
      osc.stop(startTime + duration)
    }

    const now = ctx.currentTime
    beep(now, 880, 0.15)
    beep(now + 0.18, 880, 0.15)
    beep(now + 0.36, 1100, 0.3)
  })
}

function notify(title, message, type) {
  addToast(title, message, type)
  playSound()
  if (Notification.permission === 'granted') {
    new Notification(title, { body: message, icon: '/favicon.ico' })
  }
}

function checkTasks(tasks) {
  const now = Date.now()
  const five = 5 * 60 * 1000
  const dueCutoff = 2 * 60 * 1000

  tasks.forEach(task => {
    if (task.completed || !task.scheduledAt) return
    const due = new Date(task.scheduledAt).getTime()
    const diff = due - now

    // 5-minute warning
    if (!notified.has(`${task.id}-warn`) && diff > 0 && diff <= five) {
      notified.add(`${task.id}-warn`)
      const mins = Math.ceil(diff / 60000)
      notify(
        'Task Due Soon',
        `"${task.title}" is due in ${mins} minute${mins !== 1 ? 's' : ''}.`,
        'warning'
      )
    }

    // Due now — fire within 2 minutes of the scheduled time
    if (!notified.has(`${task.id}-due`) && diff <= 0 && diff >= -dueCutoff) {
      notified.add(`${task.id}-due`)
      notify('Task Started', `"${task.title}" is starting now!`, 'due')
    }
  })
}

let initialized = false

export function useNotifications() {
  const { tasks } = useTasks()

  if (!initialized) {
    initialized = true

    if ('Notification' in window) {
      if (Notification.permission === 'default') Notification.requestPermission()

      watch(tasks, (val) => checkTasks(val), { deep: true })

      setInterval(() => checkTasks(tasks.value), 30_000)

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') checkTasks(tasks.value)
      })
    }
  }

  return { toasts, remove }
}
