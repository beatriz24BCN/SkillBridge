import React from 'react'
import CompanyCard from '../components/CompanyCard/CompanyCard'
import './Companies.css'

const mockCompanies = [
  {id:1,name:'Google',logo:'G',industry:'Technology',headquarters:'Mountain View',openings:48,size:'100k+',aiScore:95,badges:['Hiring Now','AI Verified'],description:'Search, ads, cloud and AI products building the future.',tech:['React','Python','Go']},
  {id:2,name:'Microsoft',logo:'M',industry:'Technology',headquarters:'Redmond',openings:52,size:'180k+',aiScore:92,badges:['Top Employer'],description:'Productivity tools, cloud and developer platforms.',tech:['C#','TypeScript','Azure']},
  {id:3,name:'Spotify',logo:'S',industry:'Media',headquarters:'Stockholm',openings:12,size:'9k+',aiScore:88,badges:['Remote Friendly'],description:'Music streaming and audio discovery at scale.',tech:['Python','Kubernetes','Go']},
  {id:4,name:'Stripe',logo:'St',industry:'Fintech',headquarters:'San Francisco',openings:26,size:'7k+',aiScore:94,badges:['Fast Growing','AI Verified'],description:'Payments infrastructure for the internet.',tech:['Ruby','TypeScript','Go']},
  {id:5,name:'Notion',logo:'N',industry:'Productivity',headquarters:'San Francisco',openings:8,size:'500+',aiScore:86,badges:['Top Employer'],description:'All-in-one workspace for teams.',tech:['React','Electron','Node']},
  {id:6,name:'Airbnb',logo:'A',industry:'Travel',headquarters:'San Francisco',openings:30,size:'8k+',aiScore:90,badges:['Hiring Now','Remote Friendly'],description:'Live and travel experiences worldwide.',tech:['React','Ruby','AWS']},
  {id:7,name:'Shopify',logo:'Sh',industry:'E-commerce',headquarters:'Ottawa',openings:22,size:'8k+',aiScore:89,badges:['Fast Growing'],description:'Commerce platform for businesses of all sizes.',tech:['Ruby','React','Kubernetes']},
  {id:8,name:'GitHub',logo:'GH',industry:'Developer Tools',headquarters:'Remote',openings:18,size:'2k+',aiScore:91,badges:['Remote Friendly','Top Employer'],description:'Hosts code and builds developer workflows.',tech:['TypeScript','React','GraphQL']},
  {id:9,name:'OpenAI',logo:'O',industry:'AI Research',headquarters:'San Francisco',openings:40,size:'1k+',aiScore:98,badges:['AI Verified','Fast Growing'],description:'Advancing digital intelligence for humanity.',tech:['Python','PyTorch','CUDA']}
]

export default function Companies(){
  return (
    <div className="companies-page">
      <div className="container">
        <header className="companies-header">
          <div className="companies-badge">🏢 Trusted by Leading Companies</div>
          <h1 className="companies-title">Discover Amazing Companies</h1>
          <p className="companies-sub">Explore innovative companies hiring top talent through AI-powered recruitment.</p>
        </header>

        <section className="companies-search">
          <div className="search-card">
            <div className="search-row">
              <input className="search-field" placeholder="Company name" />
              <select className="search-field"><option>Any industry</option><option>Technology</option><option>Fintech</option></select>
              <input className="search-field" placeholder="Location" />
              <button className="btn-primary">Search</button>
            </div>
          </div>
        </section>

        <section className="companies-stats-row">
          <div className="stat-card"> <div className="stat-num">340+</div><div className="stat-label">Hiring Companies</div></div>
          <div className="stat-card"> <div className="stat-num">8,500+</div><div className="stat-label">Open Positions</div></div>
          <div className="stat-card"> <div className="stat-num">92%</div><div className="stat-label">Average AI Match</div></div>
          <div className="stat-card"> <div className="stat-num">25</div><div className="stat-label">Countries</div></div>
        </section>

        <div className="companies-layout">
          <aside className="companies-sidebar">
            <div className="filters-card">
              <h4>Filters</h4>
              <div className="filter-group">
                <h5>Industry</h5>
                <select className="search-field"><option>All</option><option>Technology</option><option>Fintech</option></select>
              </div>

              <div className="filter-group">
                <h5>Company Size</h5>
                <select className="search-field"><option>Any</option><option>1-50</option><option>51-500</option><option>500+</option></select>
              </div>

              <div className="filter-group">
                <h5>Remote Friendly</h5>
                <label><input type="checkbox"/> Remote Friendly</label>
                <label><input type="checkbox"/> Hiring Now</label>
              </div>

              <div className="filter-group">
                <h5>Country</h5>
                <select className="search-field"><option>Any</option><option>United States</option><option>Spain</option></select>
              </div>

              <div className="filter-group">
                <h5>Technology</h5>
                <div className="chip-list">
                  <button className="chip">React</button>
                  <button className="chip">Python</button>
                  <button className="chip">Kubernetes</button>
                </div>
              </div>
            </div>
          </aside>

          <section className="companies-content">
            <div className="featured-company">
              <div className="featured-left">
                <div className="featured-logo">G</div>
                <div>
                  <h3 className="featured-title">Google</h3>
                  <div className="featured-meta">Technology • Mountain View</div>
                  <div className="featured-badges"><span className="pill-badge">Hiring Now</span><span className="pill-badge">AI Verified</span></div>
                </div>
              </div>
              <div className="featured-right">
                <div className="featured-score">95% Candidate Satisfaction</div>
                <div className="featured-stats">★★★★★ <span className="dot">•</span> Hiring 48 positions</div>
                <p className="featured-desc">Global technology leader focusing on search, cloud and AI-driven products.</p>
                <div className="featured-actions"><button className="btn-ghost">View Company</button><button className="btn-primary">Open Jobs</button></div>
              </div>
            </div>

            <div className="companies-grid">
              {mockCompanies.map(c=> (
                <CompanyCard company={c} key={c.id} />
              ))}
            </div>

            <div className="ai-panel premium-ai">
              <div className="ai-panel-inner three-col">
                <div className="ai-left">
                  <div className="ai-icon">🤖</div>
                  <div className="ai-text">
                    <h3 className="ai-title">AI Company Recommendation</h3>
                    <p className="ai-sub">Based on your React, Flask and Python experience, these companies offer the highest compatibility with your profile.</p>
                  </div>
                </div>

                <div className="ai-center">
                  <div className="ai-match-badge">
                    <div className="ai-match-num">95%</div>
                    <div className="ai-match-label">Profile Match</div>
                  </div>
                </div>

                <div className="ai-right">
                  <button className="btn-primary btn-ai-cta">View AI Recommendations</button>
                </div>
              </div>
            </div>

            <div className="bottom-cta">
              <h2>Ready to discover your next company?</h2>
              <p>Thousands of AI-selected companies are waiting for you.</p>
              <button className="btn-load-more">Explore More Companies →</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

