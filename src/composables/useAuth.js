import { ref } from 'vue'

const API = import.meta.env.VITE_API_URL || ''
const token = ref(localStorage.getItem('auth_token') || '')

async function login(username, password) {
  let res
  try {
    res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
  } catch {
    throw new Error('Cannot reach the server. Please try again later.')
  }
  let data
  try {
    data = await res.json()
  } catch {
    throw new Error(`Bad response from: ${API}/api/auth/login (status ${res.status})`)
  }
  if (!res.ok) throw new Error(data.error || 'Invalid username or password')
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
