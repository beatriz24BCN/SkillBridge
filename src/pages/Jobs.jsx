import React, { useEffect, useState, useCallback } from 'react'
import JobCard from '../components/JobCard/JobCard'
import './Jobs.css'
import * as jobsService from '../services/jobsService'
import { Link, useNavigate } from 'react-router-dom'

export default function Jobs(){
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const loadJobs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await jobsService.getJobs()
      // map backend job shape to UI-friendly shape (preserve current design)
      const mapped = (data || []).map(j => ({
        id: j.id,
        title: j.title,
        company: (j.company && j.company.name) || (j.company_id ? `Company ${j.company_id}` : ''),
        location: j.location || '',
        salary: j.salary || '',
        type: j.modality || '',
        description: j.description || '',
        tags: j.requirements ? [j.requirements] : [],
        labels: [],
        featured: false,
        raw: j
      }))
      setJobs(mapped)
    } catch (err) {
      setError(err.message || 'Error fetching jobs')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadJobs()
  }, [loadJobs])

  async function handleDelete(id) {
    const ok = window.confirm('Are you sure you want to delete this job? This action cannot be undone.')
    if (!ok) return
    try {
      await jobsService.deleteJob(id)
      setJobs(prev => prev.filter(j => j.id !== id))
    } catch (err) {
      const msg = err && err.message ? err.message : 'Error deleting job'
      window.alert(msg)
    }
  }

  return (
    <div className="jobs-page">
      <div className="container">
        <header className="jobs-header">
          <h1 className="jobs-title">Find Your Next Opportunity</h1>
          <p className="jobs-sub">Discover AI-powered job recommendations tailored to your skills and experience.</p>
        </header>

        <section className="jobs-search">
          <div className="search-card">
            <div className="search-row">
              <input className="search-field" placeholder="Job title, keyword or company" />
              <input className="search-field" placeholder="Location" />
              <select className="search-field">
                <option>Any employment type</option>
                <option>Full Time</option>
                <option>Part Time</option>
                <option>Remote</option>
              </select>
              <button className="btn-primary">Search</button>
            </div>
          </div>
        </section>

        <div className="jobs-layout">
          <aside className="jobs-sidebar">
            <div className="filters-card">
              <h4>Filters</h4>
              <div className="filter-group">
                <label><input type="checkbox"/> Remote</label>
                <label><input type="checkbox"/> Hybrid</label>
                <label><input type="checkbox"/> On-site</label>
              </div>

              <div className="filter-group">
                <h5>Salary Range</h5>
                <input className="search-field" placeholder="€40K - €80K" />
              </div>

              <div className="filter-group">
                <h5>Technologies</h5>
                <div className="chip-list">
                  <button className="chip">React</button>
                  <button className="chip">Python</button>
                  <button className="chip">SQL</button>
                </div>
              </div>

              <div className="filter-group">
                <h5>Experience</h5>
                <select className="search-field">
                  <option>Any</option>
                  <option>Junior</option>
                  <option>Mid</option>
                  <option>Senior</option>
                </select>
              </div>
            </div>
          </aside>

          <section className="jobs-content">
              <div className="jobs-meta-row">
                <div className="jobs-availability">{jobs.length} jobs available</div>
                <div style={{marginLeft:'auto'}}>
                  <button className="btn-primary" onClick={() => navigate('/jobs/new')}>Post a job</button>
                </div>
              </div>

              <h4 className="featured-title">Featured Jobs</h4>

              <div className="jobs-list">
                {loading && <div className="muted">Loading jobs…</div>}
                {error && <div className="error">{error}</div>}
                {!loading && !error && jobs.length === 0 && <div className="muted">No jobs found.</div>}
                {jobs.map(j=> (
                  <div key={j.id} style={{marginBottom:12}}>
                    <JobCard job={j} />
                    <div style={{marginTop:6}}>
                      <Link to={`/jobs/${j.id}`} className="auth-link">View</Link>
                      <span style={{marginLeft:12}}>
                        <Link to={`/jobs/${j.id}/edit`} className="auth-link">Edit</Link>
                      </span>
                      <button style={{marginLeft:12}} className="btn-ghost" onClick={()=>handleDelete(j.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>

            </section>
        </div>
      </div>
    </div>
  )
}

