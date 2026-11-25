import React, { useEffect, useState } from 'react'
import UserSidebar from '../components/UserSidebar/UserSidebar'
import JobCard from '../components/JobCard/JobCard'
import { getSavedJobs } from '../services/savedJobsService'
import './user.css'

export default function SavedJobs(){
  const [savedJobs, setSavedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getSavedJobs()
      .then(data => {
        if (active) setSavedJobs(data || [])
      })
      .catch(loadError => {
        if (active) setError(loadError.message || 'Unable to load saved jobs')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  function handleUnsaved(jobId) {
    setSavedJobs(current => current.filter(item => item.job_id !== jobId))
  }

  return (
    <div className="user-page">
      <UserSidebar />
      <div className="user-main">
        <h2>Saved Jobs</h2>
        {loading && <div className="muted">Loading saved jobs…</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && savedJobs.length === 0 && <div className="card note">You have no saved jobs yet.</div>}
        <div className="jobs-grid">
          {savedJobs.map(item => (
            <JobCard key={item.id} job={{ ...item.job, tags: item.job.requirements ? [item.job.requirements] : [], labels: [], type: item.job.modality }} initiallySaved onUnsaved={handleUnsaved} />
          ))}
        </div>
      </div>
    </div>
  )
}
