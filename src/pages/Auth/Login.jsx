import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'

export default function Login(){
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!email) e.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email'
    if (!password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

    function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return
    // Placeholder: no backend yet
    console.log('Login submit', { email, password })
    // Simulate success navigation
    navigate('/dashboard')
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
            <button type="submit" className="btn-primary auth-cta">Log in</button>
            <a className="auth-forgot" href="#">Forgot password?</a>
          </div>
        </form>

        <div className="auth-footer">
          <span>Don't have an account? </span>
          <Link to="/signup" className="auth-link">Sign up</Link>
        </div>
      </div>
    </div>
  )
}
