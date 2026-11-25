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
            <div><strong>Phone</strong><div className="muted">{user.phone || 'Not provided'}</div></div>
            <div><strong>Location</strong><div className="muted">{user.location || 'Not provided'}</div></div>
            <div><strong>Member since</strong><div className="muted">{user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</div></div>
          </div>
        </section>

        <section className="section">
          <h3>Professional profile</h3>
          {(user.skills || []).length > 0 ? (
            <div className="tags-row">{user.skills.map(skill => <span key={skill} className="tag">{skill}</span>)}</div>
          ) : (
            <div className="muted">No skills added yet.</div>
          )}
        </section>

        <section className="section">
          <h3>Experience</h3>
          {(user.experience || []).length === 0 && <div className="muted">No experience added yet.</div>}
          {(user.experience || []).map((item, index) => (
            <div key={`${item.company}-${item.position}-${index}`} className="card note">
              <div className="note-title">{item.position} — {item.company}</div>
              <div className="muted">{item.start || 'Start not provided'} — {item.end || 'Present'}</div>
              {item.description && <div className="muted">{item.description}</div>}
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
