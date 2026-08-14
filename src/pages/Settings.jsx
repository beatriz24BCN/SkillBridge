import React from 'react'
import UserSidebar from '../components/UserSidebar/UserSidebar'
import './user.css'

export default function Settings(){
  return (
    <div className="user-page">
      <UserSidebar />
      <div className="user-main">
        <h2>Settings</h2>
        <div className="card note">
          <h4>Account</h4>
          <p className="muted">Manage your account preferences.</p>
        </div>

        <div className="card note">
          <h4>Notifications</h4>
          <p className="muted">Notification preferences (UI only).</p>
        </div>

        <div className="card note">
          <h4>Privacy</h4>
          <p className="muted">Privacy controls (UI only).</p>
        </div>
      </div>
    </div>
  )
}
