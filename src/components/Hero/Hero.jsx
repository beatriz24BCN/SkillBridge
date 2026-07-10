import React from 'react'
import './Hero.css'

export default function Hero(){
  return (
    <section className="hero">
      <div className="hero-inner container">
        <div className="hero-col hero-left">
          <div className="badge">✨ AI Powered Recruitment Platform</div>
          <h1 className="hero-title">Find your dream job with confidence.</h1>
          <p className="hero-sub">Connect with top companies and discover opportunities powered by artificial intelligence.</p>

          <form className="search">
            <input className="search-field" placeholder="Job title, e.g. Frontend Developer" />
            <input className="search-field" placeholder="Location, e.g. Barcelona" />
            <button className="btn-primary" type="button">Search</button>
          </form>

          <div className="stats">
            <div className="stat-card">
              <div className="stat-value">25K+</div>
              <div className="stat-label">Jobs</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">3K+</div>
              <div className="stat-label">Companies</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">120K+</div>
              <div className="stat-label">Candidates</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">95%</div>
              <div className="stat-label">AI Match</div>
            </div>
          </div>
        </div>

        <div className="hero-col hero-right">
          <div className="card card-1">
            <div className="card-row">
              <div className="card-title">Frontend Developer</div>
              <div className="card-badge">AI Match 96%</div>
            </div>
            <div className="card-meta">Remote • Barcelona</div>
            <div className="card-salary">€55K</div>
          </div>

          <div className="card card-2">
            <div className="card-title">Interview Scheduled</div>
            <div className="card-meta">Tomorrow • 10:00 AM</div>
          </div>

          <div className="card card-3">
            <div className="card-title">AI Recommendation</div>
            <div className="card-meta">5 new opportunities found.</div>
          </div>

          <div className="card card-4">
            <div className="card-title">Top Company</div>
            <div className="card-meta">Senior Frontend Engineer</div>
          </div>
        </div>
      </div>
    </section>
  )
}
