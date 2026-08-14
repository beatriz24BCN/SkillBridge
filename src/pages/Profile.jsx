import React from 'react'
import UserSidebar from '../components/UserSidebar/UserSidebar'
import { getUser } from '../mocks/mockUser'
import { Link } from 'react-router-dom'
import './user.css'

export default function Profile(){
  const user = getUser()

  return (
    <div className="user-page">
      <UserSidebar />
      <div className="user-main">
        <div className="profile-header">
          <div className="profile-left">
            <div className="avatar-large">{user.name.charAt(0)}</div>
            <div>
              <h2>{user.name}</h2>
              <div className="muted">{user.title} • {user.city}, {user.country}</div>
            </div>
          </div>
          <div>
            <Link to="/profile/edit" className="btn-primary">Edit profile</Link>
          </div>
        </div>

        <section className="section">
          <h3>Personal information</h3>
          <div className="profile-grid">
            <div><strong>Full name</strong><div className="muted">{user.name}</div></div>
            <div><strong>Email</strong><div className="muted">{user.email}</div></div>
            <div><strong>Phone</strong><div className="muted">{user.phone}</div></div>
            <div><strong>City</strong><div className="muted">{user.city}</div></div>
            <div><strong>Country</strong><div className="muted">{user.country}</div></div>
            <div><strong>Address</strong><div className="muted">{user.address}</div></div>
          </div>
        </section>

        <section className="section">
          <h3>Professional profile</h3>
          <div><strong>About me</strong><div className="muted">{user.about}</div></div>
          <div className="tags-row">
            {user.skills.map(s=> <span key={s} className="tag">{s}</span>)}
          </div>
        </section>

        <section className="section">
          <h3>Experience</h3>
          {user.experience.map((exp,i)=> (
            <div key={i} className="card note">
              <div className="note-title">{exp.position} — {exp.company}</div>
              <div className="muted">{exp.start} — {exp.end}</div>
              <div className="muted">{exp.description}</div>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
