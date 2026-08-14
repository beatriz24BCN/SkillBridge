import React, { useState } from 'react'
import UserSidebar from '../components/UserSidebar/UserSidebar'
import { getUser, updateUser } from '../mocks/mockUser'
import { useNavigate } from 'react-router-dom'
import './user.css'

export default function ProfileEdit(){
  const navigate = useNavigate()
  const user = getUser()
  const [form, setForm] = useState({...user})
  const [saved, setSaved] = useState(false)

  function handleChange(k,v){ setForm(prev=> ({...prev, [k]: v})) }

  function handleSave(e){
    e.preventDefault()
    updateUser(form)
    setSaved(true)
    setTimeout(()=>{
      setSaved(false)
      navigate('/profile')
    }, 900)
  }

  return (
    <div className="user-page">
      <UserSidebar />
      <div className="user-main">
        <h2>Edit profile</h2>
        <form className="form-grid" onSubmit={handleSave}>
          <label>Full name<input value={form.name} onChange={e=>handleChange('name', e.target.value)} /></label>
          <label>Email<input value={form.email} onChange={e=>handleChange('email', e.target.value)} /></label>
          <label>Phone<input value={form.phone} onChange={e=>handleChange('phone', e.target.value)} /></label>
          <label>City<input value={form.city} onChange={e=>handleChange('city', e.target.value)} /></label>
          <label>Country<input value={form.country} onChange={e=>handleChange('country', e.target.value)} /></label>
          <label>About<textarea value={form.about} onChange={e=>handleChange('about', e.target.value)} /></label>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={()=>navigate('/profile')}>Cancel</button>
            <button type="submit" className="btn-primary">Save changes</button>
          </div>
        </form>
        {saved && <div className="toast">Profile updated successfully</div>}
      </div>
    </div>
  )
}
