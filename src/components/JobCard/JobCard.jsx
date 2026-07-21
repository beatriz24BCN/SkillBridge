import React from 'react'
import './JobCard.css'

export default function JobCard({ job }){
  return (
    <article className={`job-card ${job.featured? 'featured':''}`}>
      {job.featured && <div className="featured-badge">Featured</div>}
      <div className="job-card-row">
          <div className="card-avatar">{job.logo || job.company.charAt(0)}</div>

          <div className="card-content">
          <h3 className="job-title">{job.title}</h3>
          <div className="job-company">{job.company} • <span className="job-location">{job.location}</span></div>
        </div>

          <div className="card-right">
          <div className="job-salary">{job.salary}</div>
          <div className="ai-match-badge" aria-hidden>{job.match}%</div>
        </div>
      </div>

      <div className="job-meta">
        <div className="meta-top">
          <span className="job-type">{job.type}</span>
          <div className="label-group">
            {(job.labels||[]).map(l=> <span key={l} className={`label label-${l.toLowerCase()}`}>{l}</span>)}
          </div>
        </div>
        <p className="job-desc">{job.description}</p>
      </div>

      <div className="job-footer">
        <div className="job-tags">
          {job.tags.map((t)=> (
            <span key={t} className="job-tag">{t}</span>
          ))}
        </div>
        <button className="btn-apply">Apply</button>
      </div>
    </article>
  )
}
