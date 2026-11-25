import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import * as jobsService from '../services/jobsService'
import * as companiesService from '../services/companiesService'
import { useAuth } from '../context/AuthContext'

export default function JobForm(){
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const { user } = useAuth()
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ title:'', description:'', requirements:'', location:'', salary:'', modality:'', contract_type:'', company_id:'' })

  useEffect(() => {
    if (!isEdit) return
    let mounted = true
    setLoading(true)
    jobsService.getJob(id).then(data => {
      if(!mounted) return
      setForm({
        title: data.title || '',
        description: data.description || '',
        requirements: data.requirements || '',
        location: data.location || '',
        salary: data.salary || '',
        modality: data.modality || '',
        contract_type: data.contract_type || '',
        company_id: data.company_id || ''
      })
    }).catch(err => {
      setError(err.message || 'Error loading job')
    }).finally(()=>{ if(mounted) setLoading(false) })
    return ()=> { mounted = false }
  }, [id, isEdit])

  useEffect(() => {
    let mounted = true
    companiesService.getCompanies()
      .then(data => {
        if (mounted) setCompanies((data || []).filter(company => company.owner_id === user.id))
      })
      .catch(err => {
        if (mounted) setError(err.message || 'Error loading companies')
      })
    return () => { mounted = false }
  }, [user.id])

  function onChange(e){
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  function validate(){
    const errs = {}
    if(!form.title || String(form.title).trim() === '') errs.title = 'Title is required'
    if(!form.description || String(form.description).trim() === '') errs.description = 'Description is required'
    if(!form.company_id) errs.company_id = 'Company is required'
    return errs
  }

  async function handleSubmit(ev){
    ev.preventDefault()
    const errs = validate()
    if(Object.keys(errs).length) { setError(Object.values(errs).join('. ')); return }
    setSaving(true)
    setError(null)
    try{
      if(isEdit){
        await jobsService.updateJob(id, { ...form, company_id: Number(form.company_id) })
      } else {
        await jobsService.createJob({ ...form, company_id: Number(form.company_id) })
      }
      navigate('/jobs')
    }catch(err){
      setError(err.message || 'Save failed')
    }finally{
      setSaving(false)
    }
  }

  if(loading) return <div className="muted">Loading…</div>

  return (
    <div className="container">
      <h2>{isEdit ? 'Edit Job' : 'New Job'}</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label>Title
          <input name="title" value={form.title} onChange={onChange} />
        </label>
        <label>Description
          <textarea name="description" value={form.description} onChange={onChange} />
        </label>
        <label>Requirements
          <textarea name="requirements" value={form.requirements} onChange={onChange} />
        </label>
        <label>Location
          <input name="location" value={form.location} onChange={onChange} />
        </label>
        <label>Salary
          <input name="salary" value={form.salary} onChange={onChange} />
        </label>
        <label>Modality
          <input name="modality" value={form.modality} onChange={onChange} />
        </label>
        <label>Contract type
          <input name="contract_type" value={form.contract_type} onChange={onChange} />
        </label>
        <label>Company
          <select name="company_id" value={form.company_id} onChange={onChange}>
            <option value="">Select a company</option>
            {companies.map(company => <option key={company.id} value={company.id}>{company.name}</option>)}
          </select>
        </label>
        {companies.length === 0 && (
          <div className="muted">Create a company profile before publishing a job. <button type="button" className="auth-link" onClick={() => navigate('/companies/new')}>Create company</button></div>
        )}

        <div style={{marginTop:12}}>
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          <button type="button" className="btn-ghost" onClick={() => navigate('/jobs')} style={{marginLeft:12}}>Cancel</button>
        </div>
      </form>
    </div>
  )
}
