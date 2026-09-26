import React, { useEffect, useState } from 'react'
import UserSidebar from '../components/UserSidebar/UserSidebar'
import JobCard from '../components/JobCard/JobCard'
import './user.css'
import { getApplications } from '../services/applicationsService'

export default function Applications(){
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    let mounted = true
    setLoading(true)
    getApplications()
      .then(data => { if(mounted) { setApps(data || []); setError(null) } })
      .catch(err => { if(mounted) setError(err) })
      .finally(()=> { if(mounted) setLoading(false) })
    return ()=> { mounted = false }
  }, [])

  return (
    <div className="user-page">
      <UserSidebar />
      <div className="user-main">
        <h2>My Applications</h2>
        <p className="muted">Status overview</p>

        {loading && <div className="muted">Loading applications…</div>}
        {error && <div className="error">{error.message || 'Error loading applications'}</div>}

        {!loading && !error && apps.length === 0 && (
          <div className="muted">You have no applications yet.</div>
        )}

        <div className="apps-grid">
          {!loading && !error && apps.map(a => {
            const job = a.job || { id: `nojob-${a.id}`, title: 'Unknown job', company: null }
            return (
              <div key={a.id} className="app-item">
                <JobCard job={job} />
                <div className="app-meta">
                  <div>Status: <strong>{a.status}</strong></div>
                  {a.cover_letter && <div className="cover">{a.cover_letter.slice(0,200)}</div>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
