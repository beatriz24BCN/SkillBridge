import React from 'react'
import JobCard from '../components/JobCard/JobCard'
import './Jobs.css'

const mockJobs = [
  { id:1, title:'Frontend Developer', company:'BlueWave', location:'Barcelona', salary:'€55K', type:'Full Time', match:96, description:'Build beautiful interfaces with React and design systems.', tags:['React','TypeScript','CSS','AI'], labels:['New','Remote'], featured:true, logo:'BW' },
  { id:2, title:'Backend Developer', company:'DataForge', location:'Remote', salary:'€60K', type:'Remote', match:94, description:'Design scalable APIs and services in Python and Flask.', tags:['Python','Flask','SQL'], labels:['Remote'], logo:'DF' },
  { id:3, title:'Full Stack Developer', company:'Nexus Labs', location:'Madrid', salary:'€58K', type:'Full Time', match:95, description:'End-to-end web apps with React and Node.', tags:['React','Node','SQL'], labels:[], logo:'NL' },
  { id:4, title:'Machine Learning Engineer', company:'AioTech', location:'Remote', salary:'€72K', type:'Remote', match:92, description:'Production ML and model serving.', tags:['Python','AI','TensorFlow'], labels:['Urgent'], logo:'AT' },
  { id:5, title:'Data Engineer', company:'Streamline', location:'Barcelona', salary:'€65K', type:'Hybrid', match:90, description:'ETL pipelines and data warehouses.', tags:['SQL','Python','ETL'], labels:[], logo:'SL' },
  { id:6, title:'Product Engineer', company:'Orbit', location:'Lisbon', salary:'€62K', type:'Full Time', match:89, description:'Ship product features and improve metrics.', tags:['React','Product','A/B'], labels:['Featured'], logo:'OR' },
  { id:7, title:'DevOps Engineer', company:'CloudNine', location:'Remote', salary:'€68K', type:'Remote', match:88, description:'CI/CD, infra as code and reliability.', tags:['AWS','Docker','Kubernetes'], labels:[], logo:'CN' },
  { id:8, title:'Software Engineer', company:'PixelCraft', location:'Barcelona', salary:'€57K', type:'Full Time', match:91, description:'Feature work across web platform.', tags:['JavaScript','React','QA'], labels:['New'], logo:'PC' }
]

export default function Jobs(){
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
                <div className="jobs-availability">1,248 jobs available • Updated 5 minutes ago</div>
              </div>
              <h4 className="featured-title">Featured Jobs</h4>
              <div className="jobs-list">
                {mockJobs.map(j=> (
                  <JobCard job={j} key={j.id} />
                ))}
              </div>

              <div className="load-more-section">
                <div className="load-more-divider" />
                <div className="load-more-cta">
                  <div className="load-more-text">
                    <div className="load-more-title">Still looking for the perfect opportunity?</div>
                    <div className="load-more-sub">More AI-powered job opportunities are waiting for you.</div>
                  </div>
                  <div className="load-more-action">
                    <button className="btn-load-more">Load More Jobs →</button>
                    <div className="load-more-caption">Showing {mockJobs.length} of 1,248 available jobs.</div>
                  </div>
                </div>
              </div>
            </section>
        </div>
      </div>
    </div>
  )
}

