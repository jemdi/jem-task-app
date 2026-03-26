import { watch } from 'vue'
import { useTasks } from './useTasks'

const notified = new Set()

function playSound() {
  const ctx = new AudioContext()

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
}

function notify(title, body) {
  new Notification(title, { body, icon: '/favicon.ico' })
  playSound()
}

function checkTasks(tasks) {
  const now = Date.now()
  const five = 5 * 60 * 1000
  const window = 30_000

  tasks.forEach(task => {
    if (task.completed || !task.scheduledAt) return
    const due = new Date(task.scheduledAt).getTime()
    const diff = due - now

    // 5-minute warning
    if (!notified.has(`${task.id}-warn`) && diff > 0 && diff <= five) {
      notified.add(`${task.id}-warn`)
      const mins = Math.ceil(diff / 60000)
      notify('Task Due Soon', `"${task.title}" is due in ${mins} minute${mins !== 1 ? 's' : ''}.`)
    }

    // Due now (within the last 30 seconds)
    if (!notified.has(`${task.id}-due`) && diff <= 0 && diff >= -window) {
      notified.add(`${task.id}-due`)
      notify('Task Started', `"${task.title}" is starting now!`)
    }
  })
}

export function useNotifications() {
  const { tasks } = useTasks()

  if (!('Notification' in window)) return

  if (Notification.permission === 'default') {
    Notification.requestPermission()
  }

  watch(tasks, (val) => checkTasks(val), { deep: true })

  const interval = setInterval(() => checkTasks(tasks.value), 30_000)

  return { stopNotifications: () => clearInterval(interval) }
}
