import React, { useState } from 'react'
import UserSidebar from '../components/UserSidebar/UserSidebar'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './user.css'

export default function ProfileEdit(){
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    phone: user.phone || '',
    location: user.location || '',
    skills: (user.skills || []).join(', '),
    experience: (user.experience || []).map(item => ({ ...item })),
  })
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function handleChange(k,v){ setForm(prev=> ({...prev, [k]: v})) }

  async function handleSave(e){
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await updateUser({
        ...form,
        skills: form.skills.split(',').map(skill => skill.trim()).filter(Boolean),
        experience: form.experience,
      })
      setSaved(true)
      setTimeout(()=>{
        setSaved(false)
        navigate('/profile')
      }, 900)
    } catch (saveError) {
      setError(saveError.message || 'Unable to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="user-page">
      <UserSidebar />
      <div className="user-main">
        <h2>Edit profile</h2>
        <form className="form-grid" onSubmit={handleSave}>
          <label>First name<input value={form.first_name} onChange={e=>handleChange('first_name', e.target.value)} required /></label>
          <label>Last name<input value={form.last_name} onChange={e=>handleChange('last_name', e.target.value)} required /></label>
          <label>Email<input value={form.email} onChange={e=>handleChange('email', e.target.value)} /></label>
          <label>Phone<input value={form.phone} onChange={e=>handleChange('phone', e.target.value)} /></label>
          <label>Location<input value={form.location} onChange={e=>handleChange('location', e.target.value)} /></label>
          <label>Skills and technologies<input value={form.skills} onChange={e=>handleChange('skills', e.target.value)} placeholder="React, Python, PostgreSQL" /></label>

          <div>
            <strong>Experience</strong>
            {form.experience.map((item, index) => (
              <div key={index} className="card note">
                <label>Position<input value={item.position || ''} onChange={e => setForm(current => ({
                  ...current,
                  experience: current.experience.map((entry, entryIndex) => entryIndex === index ? { ...entry, position: e.target.value } : entry),
                }))} required /></label>
                <label>Company<input value={item.company || ''} onChange={e => setForm(current => ({
                  ...current,
                  experience: current.experience.map((entry, entryIndex) => entryIndex === index ? { ...entry, company: e.target.value } : entry),
                }))} required /></label>
                <label>Start<input value={item.start || ''} onChange={e => setForm(current => ({
                  ...current,
                  experience: current.experience.map((entry, entryIndex) => entryIndex === index ? { ...entry, start: e.target.value } : entry),
                }))} placeholder="2024-01" /></label>
                <label>End<input value={item.end || ''} onChange={e => setForm(current => ({
                  ...current,
                  experience: current.experience.map((entry, entryIndex) => entryIndex === index ? { ...entry, end: e.target.value } : entry),
                }))} placeholder="Present or 2025-06" /></label>
                <label>Description<textarea value={item.description || ''} onChange={e => setForm(current => ({
                  ...current,
                  experience: current.experience.map((entry, entryIndex) => entryIndex === index ? { ...entry, description: e.target.value } : entry),
                }))} /></label>
                <button type="button" className="btn-ghost" onClick={() => setForm(current => ({
                  ...current,
                  experience: current.experience.filter((_, entryIndex) => entryIndex !== index),
                }))}>Remove experience</button>
              </div>
            ))}
            <button type="button" className="btn-secondary" onClick={() => setForm(current => ({
              ...current,
              experience: [...current.experience, { position: '', company: '', start: '', end: '', description: '' }],
            }))}>Add experience</button>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={()=>navigate('/profile')}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
          </div>
        </form>
        {error && <div className="error" role="alert">{error}</div>}
        {saved && <div className="toast">Profile updated successfully</div>}
      </div>
    </div>
  )
}
