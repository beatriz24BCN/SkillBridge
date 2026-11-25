import React from 'react'
import UserSidebar from '../components/UserSidebar/UserSidebar'
import './user.css'

export default function SavedJobs(){
  return (
    <div className="user-page">
      <UserSidebar />
      <div className="user-main">
        <h2>Saved Jobs</h2>
        <div className="card note">Saving jobs is not available yet.</div>
      </div>
    </div>
  )
}
