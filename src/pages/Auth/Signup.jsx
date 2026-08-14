import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'

export default function Signup(){
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})

  function validate(){
    const e = {}
    if (!name) e.name = 'Full name is required'
    if (!email) e.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email'
    if (!password) e.password = 'Password is required'
    if (password !== confirm) e.confirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(ev){
    ev.preventDefault()
    if (!validate()) return
    console.log('Signup submit', { name, email })
    navigate('/dashboard')
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
            <button type="submit" className="btn-primary auth-cta">Create account</button>
          </div>
        </form>

        <div className="auth-footer">
          <span>Already have an account? </span>
          <Link to="/login" className="auth-link">Log in</Link>
        </div>
      </div>
    </div>
  )
}
