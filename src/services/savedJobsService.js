const apiBase = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
  : ''

function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
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
  return handleResponse(await fetch(`${apiBase}${path}`, options))
}

export function getSavedJobs() {
  return request('/api/saved-jobs/', { headers: authHeaders() })
}

export function saveJob(jobId) {
  return request(`/api/saved-jobs/${jobId}`, {
    method: 'POST',
    headers: authHeaders(),
  })
}

export function removeSavedJob(jobId) {
  return request(`/api/saved-jobs/${jobId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
}
import { getToken } from './authService'

