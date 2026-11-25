import React from 'react'
import UserSidebar from '../components/UserSidebar/UserSidebar'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './user.css'

export default function Profile(){
  const { user } = useAuth()
  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim()

  return (
    <div className="user-page">
      <UserSidebar />
      <div className="user-main">
        <div className="profile-header">
          <div className="profile-left">
            <div className="avatar-large">{(fullName || user.email).charAt(0).toUpperCase()}</div>
            <div>
              <h2>{fullName || 'Your profile'}</h2>
              <div className="muted">{user.email}</div>
            </div>
          </div>
          <div>
            <Link to="/profile/edit" className="btn-primary">Edit profile</Link>
          </div>
        </div>

        <section className="section">
          <h3>Personal information</h3>
          <div className="profile-grid">
            <div><strong>Full name</strong><div className="muted">{fullName || 'Not provided'}</div></div>
            <div><strong>Email</strong><div className="muted">{user.email}</div></div>
            <div><strong>Member since</strong><div className="muted">{user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</div></div>
          </div>
        </section>

        <section className="section">
          <h3>Professional profile</h3>
          <div className="muted">Complete more profile fields as SkillBridge adds candidate profile attributes.</div>
        </section>

        <section className="section">
          <h3>Experience</h3>
          <div className="muted">No experience added yet.</div>
        </section>
      </div>
    </div>
  )
}
