import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import * as jobsService from '../services/jobsService'

export default function JobDetail(){
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    async function load(){
      setLoading(true)
      setError(null)
      try{
        const data = await jobsService.getJob(id)
        if(mounted) setJob(data)
      }catch(err){
        if(err && err.status === 404){
          setError('Job not found')
        } else {
          setError(err.message || 'Error loading job')
        }
      }finally{
        if(mounted) setLoading(false)
      }
    }
    void load()
    return ()=> { mounted = false }
  }, [id])

  if(loading) return <div className="muted">Loading job…</div>
  if(error) return (
    <div>
      <div className="error">{error}</div>
      <div style={{marginTop:12}}>
        <button className="btn-ghost" onClick={()=>navigate('/jobs')}>Back to jobs</button>
      </div>
    </div>
  )

  return (
    <div className="container">
      <div style={{marginTop:12}}>
        <Link to="/jobs" className="auth-link">← Back to Jobs</Link>
      </div>
      <h2 style={{marginTop:12}}>{job.title}</h2>
      <div className="muted">{job.company ? job.company.name : `Company ${job.company_id}`}</div>
      <div style={{marginTop:12}}>
        <strong>Location:</strong> {job.location || '—'}
      </div>
      <div style={{marginTop:6}}>
        <strong>Salary:</strong> {job.salary || '—'}
      </div>
      <div style={{marginTop:12}}>
        <h4>Description</h4>
        <p>{job.description}</p>
      </div>
      <div style={{marginTop:12}}>
        <h4>Requirements</h4>
        <p>{job.requirements || '—'}</p>
      </div>
      <div style={{marginTop:12}}>
        <Link to={`/jobs/${job.id}/edit`} className="auth-link">Edit job</Link>
      </div>
    </div>
  )
}
