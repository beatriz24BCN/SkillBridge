import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './JobCard.css'
import { useAuth } from '../../context/AuthContext'
import { createApplication } from '../../services/applicationsService'
import { removeSavedJob, saveJob } from '../../services/savedJobsService'

export default function JobCard({ job, hideApply = false, initiallySaved = false, onUnsaved }){
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [applyError, setApplyError] = useState('')
  const [saved, setSaved] = useState(initiallySaved)
  const [saving, setSaving] = useState(false)
  const companyName = typeof job.company === 'string'
    ? job.company
    : job.company?.name || job.raw?.company?.name || (job.company_id ? `Company ${job.company_id}` : '')
  const tags = job.tags || (job.requirements ? [job.requirements] : [])

  async function handleApply(){
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } })
      return
    }
    setApplying(true)
    setApplyError('')
    try {
      await createApplication({ job_id: job.id })
      setApplied(true)
    } catch (error) {
      if (error.status === 409) {
        setApplied(true)
      } else {
        setApplyError(error.message || 'Unable to apply')
      }
    } finally {
      setApplying(false)
    }
  }

  async function toggleSaved(){
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } })
      return
    }
    setSaving(true)
    setApplyError('')
    try {
      if (saved) {
        await removeSavedJob(job.id)
        setSaved(false)
        onUnsaved?.(job.id)
      } else {
        await saveJob(job.id)
        setSaved(true)
      }
    } catch (error) {
      setApplyError(error.message || 'Unable to update saved job')
    } finally {
      setSaving(false)
    }
  }

  return (
    <article className={`job-card ${job.featured? 'featured':''}`}>
      {job.featured && <div className="featured-badge">Featured</div>}
      <div className="job-card-row">
          <div className="card-avatar">{companyName.charAt(0) || job.logo}</div>

          <div className="card-content">
          <h3 className="job-title">{job.title}</h3>
          <div className="job-company">{companyName} • <span className="job-location">{job.location}</span></div>
        </div>

          <div className="card-right">
          <div className="job-salary">{job.salary}</div>
          <div className="ai-match-badge" aria-hidden>
            <div className="ai-match-num">{job.match ? `${job.match}%` : '--'}</div>
            <div className="ai-match-label">AI Match</div>
          </div>
        </div>
      </div>

      <div className="job-meta">
        <div className="meta-top">
          <span className="job-type">{job.type || job.modality}</span>
          <div className="label-group">
            {(job.labels||[]).map(l=> <span key={l} className={`label label-${l.toLowerCase()}`}>{l}</span>)}
          </div>
        </div>
        <p className="job-desc">{job.description}</p>
      </div>

      <div className="job-footer">
        <div className="job-tags">
          {tags.map((t)=> (
            <span key={t} className="job-tag">{t}</span>
          ))}
        </div>
        <button className="btn-ghost" type="button" onClick={toggleSaved} disabled={saving}>
          {saved ? 'Saved' : saving ? 'Saving…' : 'Save'}
        </button>
        {!hideApply && (
          <button className="btn-apply" type="button" onClick={handleApply} disabled={applying || applied}>
            {applied ? 'Applied' : applying ? 'Applying…' : 'Apply'}
          </button>
        )}
      </div>
      {applyError && <div className="error" role="alert">{applyError}</div>}
    </article>
  )
}
