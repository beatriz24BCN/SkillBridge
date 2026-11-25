import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import * as companiesService from '../services/companiesService'
import * as jobsService from '../services/jobsService'

export default function CompanyDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [company, setCompany] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([companiesService.getCompany(id), jobsService.getJobs()])
      .then(([companyData, jobsData]) => {
        if (!active) return
        setCompany(companyData)
        setJobs((jobsData || []).filter(job => job.company_id === companyData.id))
      })
      .catch(loadError => {
        if (active) setError(loadError.message || 'Unable to load company')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [id])

  if (loading) return <div className="container muted">Loading company…</div>
  if (error) return <div className="container error">{error}</div>
  if (!company) return <div className="container muted">Company not found.</div>

  return (
    <div className="container">
      <Link to="/companies" className="auth-link">← Back to companies</Link>
      <header style={{ marginTop: 18 }}>
        <h1>{company.name}</h1>
        <div className="muted">{company.location || 'Location not provided'}</div>
      </header>
      <p>{company.description || 'No company description yet.'}</p>
      <div className="profile-grid">
        <div><strong>Email</strong><div className="muted">{company.email || '—'}</div></div>
        <div><strong>Website</strong><div className="muted">{company.website || '—'}</div></div>
        <div><strong>Phone</strong><div className="muted">{company.phone || '—'}</div></div>
        <div><strong>Open jobs</strong><div className="muted">{jobs.length}</div></div>
      </div>
      {user?.id === company.owner_id && (
        <div style={{ marginTop: 18 }}>
          <Link to={`/companies/${company.id}/edit`} className="btn-primary" style={{ padding: '9px 14px' }}>Edit company</Link>
          <Link to="/jobs/new" className="btn-ghost" style={{ marginLeft: 12 }}>Post a job</Link>
        </div>
      )}
      <section className="section">
        <h3>Open jobs</h3>
        {jobs.length === 0 && <div className="muted">No jobs published yet.</div>}
        {jobs.map(job => (
          <div key={job.id} className="card note">
            <Link to={`/jobs/${job.id}`} className="auth-link">{job.title}</Link>
            <div className="muted">{job.location || 'Location not provided'} · {job.modality || job.contract_type || 'Employment type not provided'}</div>
          </div>
        ))}
      </section>
    </div>
  )
}
