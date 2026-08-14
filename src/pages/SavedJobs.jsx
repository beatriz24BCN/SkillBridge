import React from 'react'
import UserSidebar from '../components/UserSidebar/UserSidebar'
import { getJobs } from '../mocks/mockUser'
import JobCard from '../components/JobCard/JobCard'
import './user.css'

export default function SavedJobs(){
  const jobs = getJobs()
  return (
    <div className="user-page">
      <UserSidebar />
      <div className="user-main">
        <h2>Saved Jobs</h2>
        <div className="jobs-grid">
          {jobs.map(j=> <JobCard key={j.id} job={j} />)}
        </div>
      </div>
    </div>
  )
}
