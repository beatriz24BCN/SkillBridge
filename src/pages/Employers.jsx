import React from 'react'
import './Employers.css'

export default function Employers(){
  return (
    <div className="employers-page">
      <div className="container">
        <section className="employers-hero">
          <div className="employers-hero-left">
            <div className="employers-badge">AI Hiring Platform for Modern Teams</div>
            <h1 className="employers-title">Hire the best talent faster with AI.</h1>
            <p className="employers-sub">
              SkillBridge helps your team source, screen and hire qualified candidates in days, not weeks,
              with AI-powered recommendations and verified profiles.
            </p>
            <div className="employers-actions">
              <button className="btn-primary" type="button">Post a Job</button>
              <button className="btn-ghost" type="button">Book a Demo</button>
            </div>
          </div>

          <div className="employers-hero-right" aria-hidden>
            <article className="metric-card metric-main">
              <div className="metric-head">
                <span className="metric-label">Candidate Match</span>
                <span className="metric-chip">AI Live</span>
              </div>
              <div className="metric-value">96%</div>
              <div className="metric-meta">Top profiles ranked by relevance and intent.</div>
            </article>

            <article className="metric-card metric-small">
              <span className="metric-label">Time to Hire</span>
              <div className="metric-value">-68%</div>
            </article>

            <article className="metric-card metric-small">
              <span className="metric-label">Qualified Candidates</span>
              <div className="metric-value">+420</div>
            </article>

            <article className="metric-card metric-small metric-status">
              <span className="metric-label">AI Screening</span>
              <div className="metric-value">Active</div>
            </article>
          </div>
        </section>

        <section className="employers-benefits">
          <header className="section-head">
            <h2>Built for faster and smarter hiring</h2>
          </header>
          <div className="benefits-grid">
            <article className="benefit-card">
              <div className="benefit-icon" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                  <path d="M12 8V12L15 14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>AI Candidate Matching</h3>
              <p>Rank candidates automatically based on skills, intent and hiring goals.</p>
            </article>

            <article className="benefit-card">
              <div className="benefit-icon" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M7 4H17L20 7V20H7V4Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 4V7H20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 12L12 14L16 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Automated Screening</h3>
              <p>Filter and shortlist top applicants with intelligent pre-screening signals.</p>
            </article>

            <article className="benefit-card">
              <div className="benefit-icon" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M4 19H20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                  <path d="M7 16V11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                  <path d="M12 16V8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                  <path d="M17 16V6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Smart Analytics</h3>
              <p>Track funnel performance and optimize every stage of your hiring pipeline.</p>
            </article>

            <article className="benefit-card">
              <div className="benefit-icon" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                  <path d="M13 6L19 12L13 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Faster Hiring</h3>
              <p>Move from posting to interviews quickly with clear AI-guided priorities.</p>
            </article>
          </div>
        </section>

        <section className="employers-flow">
          <header className="section-head">
            <h2>How it works</h2>
          </header>
          <div className="timeline">
            <article className="timeline-step">
              <div className="step-num">1</div>
              <h3>Post your job</h3>
              <p>Create your role profile in minutes and set your hiring criteria.</p>
            </article>
            <article className="timeline-step">
              <div className="step-num">2</div>
              <h3>AI matches candidates</h3>
              <p>Our engine ranks best-fit candidates with transparent scoring.</p>
            </article>
            <article className="timeline-step">
              <div className="step-num">3</div>
              <h3>Interview top talent</h3>
              <p>Focus only on qualified people and accelerate interview cycles.</p>
            </article>
            <article className="timeline-step">
              <div className="step-num">4</div>
              <h3>Hire faster</h3>
              <p>Reduce delays and close positions with higher confidence.</p>
            </article>
          </div>
        </section>

        <section className="employers-stats">
          <article className="employers-stat-card">
            <div className="stat-value">95%</div>
            <div className="stat-label">Hiring accuracy</div>
          </article>
          <article className="employers-stat-card">
            <div className="stat-value">72%</div>
            <div className="stat-label">Time saved</div>
          </article>
          <article className="employers-stat-card">
            <div className="stat-value">50K+</div>
            <div className="stat-label">Candidates</div>
          </article>
          <article className="employers-stat-card">
            <div className="stat-value">1.2K+</div>
            <div className="stat-label">Companies</div>
          </article>
        </section>

        <section className="featured-employers">
          <div className="featured-employers-left">
            <h2>Why companies choose SkillBridge</h2>
            <ul className="check-list">
              <li>AI-powered recruitment</li>
              <li>Verified candidates</li>
              <li>Advanced analytics</li>
              <li>Faster hiring process</li>
              <li>Dedicated support</li>
            </ul>
          </div>
          <div className="featured-employers-right" aria-hidden>
            <div className="mini-dashboard">
              <div className="mini-row">
                <span>Pipeline Health</span>
                <strong>Excellent</strong>
              </div>
              <div className="mini-bars">
                <div className="bar bar-1" />
                <div className="bar bar-2" />
                <div className="bar bar-3" />
                <div className="bar bar-4" />
              </div>
              <div className="mini-grid">
                <div className="mini-cell">
                  <span>Shortlist Rate</span>
                  <strong>41%</strong>
                </div>
                <div className="mini-cell">
                  <span>Interview Pass</span>
                  <strong>63%</strong>
                </div>
                <div className="mini-cell">
                  <span>Offer Accept</span>
                  <strong>84%</strong>
                </div>
                <div className="mini-cell">
                  <span>Avg Time</span>
                  <strong>9 days</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="employers-final-cta">
          <h2>Ready to hire your next employee?</h2>
          <p>Launch your next role with AI-powered hiring workflows and discover top talent faster.</p>
          <button className="btn-primary" type="button">Start Hiring Today</button>
        </section>
      </div>
    </div>
  )
}
