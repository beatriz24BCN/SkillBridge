import React, { useState } from 'react'
import UserSidebar from '../components/UserSidebar/UserSidebar'
import { useAuth } from '../context/AuthContext'
import './user.css'

const defaults = {
  job_alerts: true,
  application_updates: true,
  profile_public: false,
  remote_only: false,
  preferred_location: '',
}

export default function Settings(){
  const { user, updateUser } = useAuth()
  const [preferences, setPreferences] = useState({ ...defaults, ...(user.preferences || {}) })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function setBoolean(name, checked) {
    setPreferences(current => ({ ...current, [name]: checked }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setSaved(false)
    setError('')
    try {
      await updateUser({ preferences })
      setSaved(true)
    } catch (saveError) {
      setError(saveError.message || 'Unable to save preferences')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="user-page">
      <UserSidebar />
      <div className="user-main">
        <h2>Settings</h2>
        <form onSubmit={handleSubmit}>
          <div className="card note">
            <h4>Notifications</h4>
            <label><input type="checkbox" checked={preferences.job_alerts} onChange={event => setBoolean('job_alerts', event.target.checked)} /> Job alerts</label>
            <label><input type="checkbox" checked={preferences.application_updates} onChange={event => setBoolean('application_updates', event.target.checked)} /> Application updates</label>
          </div>

          <div className="card note">
            <h4>Privacy</h4>
            <label><input type="checkbox" checked={preferences.profile_public} onChange={event => setBoolean('profile_public', event.target.checked)} /> Public professional profile</label>
          </div>

          <div className="card note">
            <h4>Job preferences</h4>
            <label><input type="checkbox" checked={preferences.remote_only} onChange={event => setBoolean('remote_only', event.target.checked)} /> Remote opportunities only</label>
            <label>Preferred location<input value={preferences.preferred_location} onChange={event => setPreferences(current => ({ ...current, preferred_location: event.target.value }))} /></label>
          </div>

          <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save preferences'}</button>
        </form>
        {error && <div className="error" role="alert">{error}</div>}
        {saved && <div className="toast">Preferences saved</div>}
      </div>
    </div>
  )
}
