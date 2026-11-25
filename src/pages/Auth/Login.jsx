import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Auth.css'

export default function Login(){
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function validate() {
    const e = {}
    if (!email) e.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email'
    if (!password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setErrors({})
    try {
      await login({ email, password })
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
    } catch (error) {
      setErrors({ form: error.message || 'Unable to log in' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-root">
      <div className="auth-card">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Log in to access your SkillBridge account and continue where you left off.</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="auth-label">Email
            <input className="auth-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" />
            {errors.email && <div className="auth-error">{errors.email}</div>}
          </label>

          <label className="auth-label">Password
            <input className="auth-input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password" />
            {errors.password && <div className="auth-error">{errors.password}</div>}
          </label>

          <div className="auth-row-between">
            <button type="submit" className="btn-primary auth-cta" disabled={submitting}>{submitting ? 'Logging in…' : 'Log in'}</button>
            <Link className="auth-forgot" to="/forgot-password">Forgot password?</Link>
          </div>
        </form>
        {errors.form && <div className="auth-error" role="alert">{errors.form}</div>}

        <div className="auth-footer">
          <span>Don't have an account? </span>
          <Link to="/signup" className="auth-link">Sign up</Link>
        </div>
      </div>
    </div>
  )
}
