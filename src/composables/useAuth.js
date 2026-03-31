import { ref } from 'vue'

const API = import.meta.env.VITE_API_URL || ''
const token = ref(localStorage.getItem('auth_token') || '')

async function login(username, password) {
  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Login failed')
  token.value = data.token
  localStorage.setItem('auth_token', data.token)
}

function logout() {
  token.value = ''
  localStorage.removeItem('auth_token')
}

export function useAuth() {
  return { token, login, logout }
}
