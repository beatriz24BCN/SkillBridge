import React from 'react'
import { Link } from 'react-router-dom'
import './About.css'

export default function About(){
  return (
    <div className="about-page">
      <div className="container">
        <section className="about-hero">
          <div className="about-hero-left">
            <div className="badge">✨ Building the future of hiring</div>
            <h1 className="about-title">Connecting talent and companies with AI.</h1>
            <p className="about-sub">SkillBridge blends modern AI with human-centered hiring to help companies and candidates move faster, fairer and smarter.</p>

            <div className="about-actions">
              <Link to="/jobs" className="btn-primary">Explore Jobs</Link>
              <Link to="/employers" className="btn-ghost">For Employers</Link>
            </div>
          </div>
          <div className="about-hero-right" aria-hidden>
            <div className="floating-grid">
              <article className="hero-card hc-small">
                <div className="hc-title">Verified Profiles</div>
                <div className="hc-meta">Trusted credentials</div>
              </article>

              <article className="hero-card hc-small">
                <div className="hc-title">Global Companies</div>
                <div className="hc-meta">Hiring worldwide</div>
              </article>

              <article className="hero-card hc-small">
                <div className="hc-title">Smart Hiring</div>
                <div className="hc-meta">Analytics & insights</div>
              </article>
            </div>
          </div>
        </section>

        {/* Feature band: promote AI Matching as a full-width product panel that bridges hero → mission */}
        <div className="feature-band">
          <div className="container">
            <article className="feature-card">
              <div className="feature-left">
                <div className="hc-title">AI Matching</div>
                <div className="hc-meta">Fast, explainable recommendations</div>
              </div>
              <div className="feature-right">
                <div className="hc-badge">96%</div>
              </div>
            </article>
          </div>
        </div>

        <section className="mission">
          <div className="mission-left">
            <h2>Our Mission</h2>
            <p>
              We combine AI, deep talent signals and design to create hiring experiences that
              are faster, fairer and smarter. SkillBridge empowers companies and professionals
              to find the right opportunities with transparency and speed.
            </p>

            {/* Mission: embed a visual mini-dashboard to make the copy feel product-led */}
            <div className="mission-dashboard">
              <div className="mini-dashboard">
                <div className="row">
                  <div>
                    <div className="label">Match Score</div>
                    <div className="big">96%</div>
                  </div>
                  <div>
                    <div className="label">Companies</div>
                    <div className="big">3K+</div>
                  </div>
                </div>
                <div className="bars">
                  <div className="bar b1" />
                  <div className="bar b2" />
                  <div className="bar b3" />
                  <div className="bar b4" />
                </div>
              </div>
            </div>
          </div>

          <aside className="mission-stats">
            <div className="stat large tall">95%<div className="label">Candidate Satisfaction</div></div>
            <div className="stat">120K+<div className="label">Candidates</div></div>
            <div className="stat">25K+<div className="label">Jobs</div></div>
            <div className="stat">3K+<div className="label">Companies</div></div>
          </aside>
        </section>

        <section className="values">
          <h2>Our Values</h2>
          <div className="values-grid">
            <article className="value-card">
              <div className="value-icon">🤖</div>
              <h3>Innovation</h3>
              <p>AI-first recruitment that keeps humans in control.</p>
            </article>
            <article className="value-card">
              <div className="value-icon">🔍</div>
              <h3>Transparency</h3>
              <p>Fair and explainable matching for candidates and companies.</p>
            </article>
            <article className="value-card">
              <div className="value-icon">🌍</div>
              <h3>Community</h3>
              <p>Connecting people and teams across borders and industries.</p>
            </article>
            <article className="value-card">
              <div className="value-icon">🏆</div>
              <h3>Quality</h3>
              <p>Delivering professional outcomes and better hiring experiences.</p>
            </article>
          </div>
        </section>

        <section className="how-it-works">
          <h2>How SkillBridge Works</h2>
          <div className="timeline">
            <div className="step">
              <div className="num">1</div>
              <h4>Create profile</h4>
            </div>
            <div className="step">
              <div className="num">2</div>
              <h4>AI analyzes skills</h4>
            </div>
            <div className="step">
              <div className="num">3</div>
              <h4>Receive smart matches</h4>
            </div>
            <div className="step">
              <div className="num">4</div>
              <h4>Get hired</h4>
            </div>
          </div>
        </section>

        <section className="why-choose">
          <div className="choose-composed">
            <div className="choose-left">
              <h2>Why choose us</h2>
              <ul className="checks">
                <li>AI-powered recommendations</li>
                <li>Verified companies</li>
                <li>Secure platform</li>
                <li>Global opportunities</li>
                <li>Fast applications</li>
              </ul>
            </div>

            <div className="choose-right">
              <div className="mini-dashboard">
                <div className="row">
                  <div>
                    <div className="label">Match Score</div>
                    <div className="big">96%</div>
                  </div>
                  <div>
                    <div className="label">Companies</div>
                    <div className="big">3K+</div>
                  </div>
                </div>
                <div className="bars">
                  <div className="bar b1" />
                  <div className="bar b2" />
                  <div className="bar b3" />
                  <div className="bar b4" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="impact">
          <h2>Our Impact</h2>
          <div className="impact-grid">
            <div className="impact-card"><div className="num">120K+</div><div className="label">Candidates</div></div>
            <div className="impact-card"><div className="num">25K+</div><div className="label">Jobs</div></div>
            <div className="impact-card"><div className="num">3K+</div><div className="label">Companies</div></div>
            <div className="impact-card"><div className="num">95%</div><div className="label">AI Match</div></div>
          </div>
        </section>

        <section className="about-cta">
          <div className="cta-inner">
            <h2>Ready to build your future?</h2>
            <p>Join thousands of professionals and companies already using SkillBridge.</p>
            <div className="cta-actions">
              <Link to="/signup" className="btn-primary">Get Started</Link>
              <Link to="/contact" className="btn-ghost">Contact Us</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

