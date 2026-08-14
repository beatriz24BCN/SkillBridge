import React from 'react'
import UserSidebar from '../components/UserSidebar/UserSidebar'
import './user.css'

export default function Messages(){
  return (
    <div className="user-page">
      <UserSidebar />
      <div className="user-main">
        <h2>Messages</h2>
        <p className="muted">Messaging interface coming soon. This area will host conversations between you and employers.</p>
        <div className="card note">No messages yet (mock)</div>
      </div>
    </div>
  )
}
