import React from 'react'
import { Link } from 'react-router-dom'
import UserSidebar from '../components/UserSidebar/UserSidebar'
import { getUser, getJobs } from '../mocks/mockUser'
import JobCard from '../components/JobCard/JobCard'
import './user.css'

export default function Dashboard(){
  const user = getUser()
  const jobs = getJobs()
  const progress = 68 // mock

  const recentActivity = [
    { text: 'Applied to Senior Frontend Engineer', when: '2 hours ago' },
    { text: 'Saved Full Stack Developer at ScaleUp', when: 'Yesterday' },
    { text: 'Profile updated', when: '2 days ago' },
    { text: 'Interview scheduled with Design Studio', when: '3 days ago' }
  ]

  return (
    <div className="user-page">
      <UserSidebar />

      <div className="user-main">
        <div className="dashboard-grid">
          <div className="dashboard-left">
            <header className="dashboard-header">
              <div>
                <h2>Hi, {user.name} 👋</h2>
                <div className="muted">{user.title} · {user.city} · Open to work</div>
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
                <div className="stat-num">{user.applicationsCount}</div>
                <div className="stat-text">Applications</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🔖</div>
                <div className="stat-num">{user.savedJobsCount}</div>
                <div className="stat-text">Saved Jobs</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎤</div>
                <div className="stat-num">{user.interviewsCount}</div>
                <div className="stat-text">Interviews</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👀</div>
                <div className="stat-num">24</div>
                <div className="stat-text">Profile views</div>
              </div>
            </section>

            <section className="section">
              <h3>Recommended Jobs</h3>
              <div className="jobs-grid">
                {jobs.map(j=> <JobCard key={j.id} job={j} />)}
              </div>
            </section>

            <section className="ai-match section">
              <h4>Why these jobs match you</h4>
              <p className="muted">Your profile matches these roles based on your skills, experience and preferences.</p>
              <div className="match-list">
                {['React','JavaScript','Full Stack','Remote preference','Barcelona'].map(m=> (
                  <div key={m} className="match-item">✓ {m}</div>
                ))}
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
                <li>✓ Professional title</li>
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
                {recentActivity.map((a,i)=> (
                  <div key={i} className="activity-item">
                    <div>{a.text}</div>
                    <div className="muted small">{a.when}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card small">
              <h4>Recent applications</h4>
              <div className="app-list">
                {jobs.slice(0,3).map(j=> (
                  <div key={j.id} className="app-row">
                    <div className="app-left">
                      <div className="app-company">{j.company}</div>
                      <div className="muted small">{j.title}</div>
                    </div>
                    <div className="app-right">
                      <div className="status applied">Applied</div>
                      <div className="muted small">2d</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/applications" className="auth-link">View all applications →</Link>
            </div>

            <div className="card small">
              <h4>Saved jobs</h4>
              <div className="saved-list">
                {jobs.slice(0,2).map(j=> (
                  <div key={j.id} className="saved-row">
                    <div>{j.title}</div>
                    <div className="muted small">{j.company}</div>
                  </div>
                ))}
              </div>
              <Link to="/saved-jobs" className="auth-link">View all saved jobs →</Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
