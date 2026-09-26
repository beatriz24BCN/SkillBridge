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

export async function getApplications() {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, authHeaders())
  const res = await fetch(`${apiBase}/api/applications`, { method: 'GET', headers })
  return handleRes(res)
}

export async function getApplication(id) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, authHeaders())
  const res = await fetch(`${apiBase}/api/applications/${id}`, { method: 'GET', headers })
  return handleRes(res)
}

export async function createApplication(payload) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, authHeaders())
  const res = await fetch(`${apiBase}/api/applications`, { method: 'POST', headers, body: JSON.stringify(payload) })
  return handleRes(res)
}

export async function updateApplication(id, payload, usePatch = true) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, authHeaders())
  const method = usePatch ? 'PATCH' : 'PUT'
  const res = await fetch(`${apiBase}/api/applications/${id}`, { method, headers, body: JSON.stringify(payload) })
  return handleRes(res)
}

export async function deleteApplication(id) {
  const headers = Object.assign({}, authHeaders())
  const res = await fetch(`${apiBase}/api/applications/${id}`, { method: 'DELETE', headers })
  return handleRes(res)
}

export default { getApplications, getApplication, createApplication, updateApplication, deleteApplication }
