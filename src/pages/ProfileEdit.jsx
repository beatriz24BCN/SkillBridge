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
      await updateUser(form)
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
