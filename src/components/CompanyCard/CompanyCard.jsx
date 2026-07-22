import React from 'react'
import './CompanyCard.css'

export default function CompanyCard({ company }){
  return (
    <article className="company-card">
      <div className="card-badges">
        <div className="ai-badge">AI {company.aiScore}%</div>
        {(company.badges||[]).includes('Hiring Now') && <div className="hiring-badge">Hiring Now</div>}
      </div>

      <div className="company-card-inner">
        <div className="company-card-top">
          <div className="company-logo">{company.logo || company.name.charAt(0)}</div>
          <div className="company-head">
            <h3 className="company-name">{company.name}</h3>
            <div className="company-meta">{company.industry} • {company.headquarters}</div>
          </div>
        </div>

        <div className="company-body">
          <div className="company-stats-row">
            <div className="stat"><strong>{company.openings}</strong><span>Open jobs</span></div>
            <div className="stat"><strong>{company.size}</strong><span>Company size</span></div>
          </div>

          <p className="company-desc">{company.description}</p>
          <div className="tech-list">
            {(company.tech||[]).map(t=> <span key={t} className="tech-chip">{t}</span>)}
          </div>
        </div>
      </div>

      <div className="company-footer">
        <div className="footer-left">
          <div className="size-label">{company.size}</div>
        </div>
        <div className="footer-actions">
          <button className="btn-ghost">View Company</button>
          <button className="btn-primary small">Open Jobs</button>
        </div>
      </div>
    </article>
  )
}
