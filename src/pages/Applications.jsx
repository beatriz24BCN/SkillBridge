import React from 'react'
import UserSidebar from '../components/UserSidebar/UserSidebar'
import { getJobs, getUser } from '../mocks/mockUser'
import JobCard from '../components/JobCard/JobCard'
import './user.css'

export default function Applications(){
  const jobs = getJobs()
  const user = getUser()

  return (
    <div className="user-page">
      <UserSidebar />
      <div className="user-main">
        <h2>My Applications</h2>
        <p className="muted">Status overview</p>
        <div className="apps-grid">
          {jobs.map(j=> <JobCard key={j.id} job={j} />)}
        </div>
      </div>
    </div>
  )
}
