import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import UserSidebar from '../components/UserSidebar/UserSidebar'
import JobCard from '../components/JobCard/JobCard'
import { useAuth } from '../context/AuthContext'
import { getJobs } from '../services/jobsService'
import { getApplications } from '../services/applicationsService'
import './user.css'

export default function Dashboard(){
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [error, setError] = useState('')
  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim()
  const progress = [user.first_name, user.last_name, user.email].filter(Boolean).length === 3 ? 100 : 60

  useEffect(() => {
    let active = true
    Promise.all([getJobs(), getApplications()])
      .then(([jobData, applicationData]) => {
        if (!active) return
        setJobs(jobData || [])
        setApplications(applicationData || [])
      })
      .catch(loadError => {
        if (active) setError(loadError.message || 'Unable to load dashboard data')
      })
    return () => { active = false }
  }, [])

  return (
    <div className="user-page">
      <UserSidebar />

      <div className="user-main">
        <div className="dashboard-grid">
          <div className="dashboard-left">
            <header className="dashboard-header">
              <div>
                <h2>Hi, {fullName || 'there'} 👋</h2>
                <div className="muted">{user.email} · Open to work</div>
              </div>

              <div className="profile-complete-card">
                <div className="pc-row">
                  <div>
                    <div className="pc-label">Profile completion</div>
                    <div className="pc-percent">{progress}%</div>
                  </div>
                  <div className="pc-action">
                    <Link to="/profile/edit" className="auth-link">Complete profile</Link>
                  </div>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{width: `${progress}%`}}/></div>
                <div className="muted small">Complete your profile to receive better job matches.</div>
              </div>
            </header>

            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📄</div>
                <div className="stat-num">{applications.length}</div>
                <div className="stat-text">Applications</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🔖</div>
                <div className="stat-num">0</div>
                <div className="stat-text">Saved Jobs</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎤</div>
                <div className="stat-num">{applications.filter(app => app.status === 'accepted').length}</div>
                <div className="stat-text">Interviews</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👀</div>
                <div className="stat-num">{jobs.length}</div>
                <div className="stat-text">Available jobs</div>
              </div>
            </section>

            <section className="section">
              <h3>Recommended Jobs</h3>
              <div className="jobs-grid">
                {error && <div className="error">{error}</div>}
                {jobs.slice(0, 3).map(j=> <JobCard key={j.id} job={{
                  ...j,
                  company: j.company?.name || `Company ${j.company_id}`,
                  type: j.modality,
                  tags: j.requirements ? [j.requirements] : [],
                  labels: [],
                  raw: j,
                }} />)}
              </div>
            </section>

            <section className="ai-match section">
              <h4>Why these jobs match you</h4>
              <p className="muted">Your profile matches these roles based on your skills, experience and preferences.</p>
              <div className="match-list">
                <div className="match-item">Complete your profile to improve matching.</div>
              </div>
              <div style={{marginTop:12}}>
                <Link to="/profile/edit" className="auth-link">Improve my profile</Link>
              </div>
            </section>
          </div>

          <aside className="dashboard-right">
            <div className="card small">
              <h4>Complete your profile</h4>
              <div className="muted">{progress}% complete</div>
              <ul className="profile-checks">
                <li>✓ Basic information</li>
                <li>○ Professional title</li>
                <li>○ Skills</li>
                <li>○ Experience</li>
                <li>○ Education</li>
                <li>○ Job preferences</li>
                <li>○ CV</li>
              </ul>
              <Link to="/profile/edit" className="auth-link">Complete profile →</Link>
            </div>

            <div className="card small">
              <h4>Recent activity</h4>
              <div className="activity-list">
                {applications.slice(0, 3).map((application, i)=> (
                  <div key={i} className="activity-item">
                    <div>Applied to {application.job?.title || `job #${application.job_id}`}</div>
                    <div className="muted small">{application.status}</div>
                  </div>
                ))}
                {applications.length === 0 && <div className="muted small">No recent activity.</div>}
              </div>
            </div>

            <div className="card small">
              <h4>Recent applications</h4>
              <div className="app-list">
                {applications.slice(0,3).map(application => (
                  <div key={application.id} className="app-row">
                    <div className="app-left">
                      <div className="app-company">{application.job?.company?.name || 'Company'}</div>
                      <div className="muted small">{application.job?.title}</div>
                    </div>
                    <div className="app-right">
                      <div className="status applied">{application.status}</div>
                    </div>
                  </div>
                ))}
                {applications.length === 0 && <div className="muted small">No applications yet.</div>}
              </div>
              <Link to="/applications" className="auth-link">View all applications →</Link>
            </div>

            <div className="card small">
              <h4>Saved jobs</h4>
              <div className="saved-list">
                <div className="muted small">Saved jobs are not available yet.</div>
              </div>
              <Link to="/saved-jobs" className="auth-link">View all saved jobs →</Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
