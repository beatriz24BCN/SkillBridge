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

export async function getCompanies() {
  const res = await fetch(`${apiBase}/api/companies`, { method: 'GET' })
  return handleRes(res)
}

export async function getCompany(id) {
  const res = await fetch(`${apiBase}/api/companies/${id}`, { method: 'GET' })
  return handleRes(res)
}

export async function createCompany(payload) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, authHeaders())
  const res = await fetch(`${apiBase}/api/companies`, { method: 'POST', headers, body: JSON.stringify(payload) })
  return handleRes(res)
}

export async function updateCompany(id, payload) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, authHeaders())
  const res = await fetch(`${apiBase}/api/companies/${id}`, { method: 'PUT', headers, body: JSON.stringify(payload) })
  return handleRes(res)
}

export async function patchCompany(id, payload) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, authHeaders())
  const res = await fetch(`${apiBase}/api/companies/${id}`, { method: 'PATCH', headers, body: JSON.stringify(payload) })
  return handleRes(res)
}

export async function deleteCompany(id) {
  const headers = Object.assign({}, authHeaders())
  const res = await fetch(`${apiBase}/api/companies/${id}`, { method: 'DELETE', headers })
  return handleRes(res)
}
