const apiBase = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
  : ''

export function getToken() {
  try {
    return localStorage.getItem('access_token')
  } catch {
    return null
  }
}

export function setToken(token) {
  try {
    localStorage.setItem('access_token', token)
  } catch {
    throw new Error('The browser could not save your session')
  }
}

export function clearToken() {
  try {
    localStorage.removeItem('access_token')
  } catch {
    // The in-memory session is still cleared by the auth provider.
  }
}

async function handleResponse(response) {
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const error = new Error(data?.error || data?.message || `HTTP ${response.status}`)
    error.status = response.status
    throw error
  }
  return data
}

async function request(path, options = {}) {
  const response = await fetch(`${apiBase}${path}`, options)
  return handleResponse(response)
}

export function login(credentials) {
  return request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })
}

export function register(payload) {
  return request('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function getCurrentUser() {
  const token = getToken()
  if (!token) return Promise.resolve(null)

  return request('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function updateCurrentUser(payload) {
  const token = getToken()
  if (!token) return Promise.reject(new Error('Authentication required'))

  return request('/api/auth/me', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
}