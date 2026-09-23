const apiBase = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
  : ''

function authHeaders() {
  const token = (() => {
    try { return localStorage.getItem('access_token') } catch (e) { return null }
  })()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function handleRes(res) {
  const text = await res.text()
  let data = null
  try { data = text ? JSON.parse(text) : null } catch (e) { data = { message: text } }
  if (!res.ok) {
    const err = new Error((data && (data.error || data.message)) || `HTTP ${res.status}`)
    err.status = res.status
    err.body = data
    throw err
  }
  return data
}

export async function getJobs() {
  const res = await fetch(`${apiBase}/api/jobs`, { method: 'GET' })
  return handleRes(res)
}

export async function getJob(id) {
  const res = await fetch(`${apiBase}/api/jobs/${id}`, { method: 'GET' })
  return handleRes(res)
}

export async function createJob(payload) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, authHeaders())
  const res = await fetch(`${apiBase}/api/jobs`, { method: 'POST', headers, body: JSON.stringify(payload) })
  return handleRes(res)
}

export async function updateJob(id, payload, usePatch = false) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, authHeaders())
  const method = usePatch ? 'PATCH' : 'PUT'
  const res = await fetch(`${apiBase}/api/jobs/${id}`, { method, headers, body: JSON.stringify(payload) })
  return handleRes(res)
}

export async function deleteJob(id) {
  const headers = Object.assign({}, authHeaders())
  const res = await fetch(`${apiBase}/api/jobs/${id}`, { method: 'DELETE', headers })
  return handleRes(res)
}
