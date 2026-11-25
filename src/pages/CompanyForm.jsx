import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import * as companiesService from '../services/companiesService'

const emptyCompany = {
  name: '',
  description: '',
  email: '',
  phone: '',
  website: '',
  location: '',
  logo: '',
}

export default function CompanyForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyCompany)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    let active = true
    companiesService.getCompany(id)
      .then(company => {
        if (active) setForm(Object.fromEntries(Object.keys(emptyCompany).map(key => [key, company[key] || ''])))
      })
      .catch(loadError => {
        if (active) setError(loadError.message || 'Unable to load company')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [id, isEdit])

  function onChange(event) {
    const { name, value } = event.target
    setForm(current => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const company = isEdit
        ? await companiesService.updateCompany(id, form)
        : await companiesService.createCompany(form)
      navigate(`/companies/${company.id}`)
    } catch (saveError) {
      setError(saveError.message || 'Unable to save company')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="container muted">Loading company…</div>

  return (
    <div className="container">
      <h2>{isEdit ? 'Edit company' : 'Create company'}</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label>Company name<input name="name" value={form.name} onChange={onChange} required /></label>
        <label>Description<textarea name="description" value={form.description} onChange={onChange} /></label>
        <label>Email<input type="email" name="email" value={form.email} onChange={onChange} /></label>
        <label>Phone<input name="phone" value={form.phone} onChange={onChange} /></label>
        <label>Website<input name="website" value={form.website} onChange={onChange} /></label>
        <label>Location<input name="location" value={form.location} onChange={onChange} /></label>
        <label>Logo URL<input name="logo" value={form.logo} onChange={onChange} /></label>
        <div style={{ marginTop: 12 }}>
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save company'}</button>
          <button type="button" className="btn-ghost" style={{ marginLeft: 12 }} onClick={() => navigate('/companies')}>Cancel</button>
        </div>
      </form>
    </div>
  )
}
