import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'
import { useAuth } from '../../context/AuthContext'

export default function Signup(){
  const navigate = useNavigate()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function validate(){
    const e = {}
    if (!name) e.name = 'Full name is required'
    else if (name.trim().split(/\s+/).length < 2) e.name = 'Enter your first and last name'
    if (!email) e.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email'
    if (!password) e.password = 'Password is required'
    else if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) e.password = 'Use at least 8 characters with letters and numbers'
    if (password !== confirm) e.confirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev){
    ev.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setErrors({})
    const parts = name.trim().split(/\s+/)
    const first_name = parts.shift()
    const last_name = parts.join(' ')
    try {
      await register({ email, password, first_name, last_name })
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setErrors({ form: error.message || 'Unable to create account' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-root">
      <div className="auth-card">
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">Start building your professional profile and discover better job matches.</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="auth-label">Full name
            <input className="auth-input" type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name" />
            {errors.name && <div className="auth-error">{errors.name}</div>}
          </label>

          <label className="auth-label">Email
            <input className="auth-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" />
            {errors.email && <div className="auth-error">{errors.email}</div>}
          </label>

          <label className="auth-label">Password
            <input className="auth-input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Create a password" />
            {errors.password && <div className="auth-error">{errors.password}</div>}
          </label>

          <label className="auth-label">Confirm password
            <input className="auth-input" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Repeat your password" />
            {errors.confirm && <div className="auth-error">{errors.confirm}</div>}
          </label>

          <div className="auth-row-center">
            <button type="submit" className="btn-primary auth-cta" disabled={submitting}>{submitting ? 'Creating account…' : 'Create account'}</button>
          </div>
        </form>
        {errors.form && <div className="auth-error" role="alert">{errors.form}</div>}

        <div className="auth-footer">
          <span>Already have an account? </span>
          <Link to="/login" className="auth-link">Log in</Link>
        </div>
      </div>
    </div>
  )
}
