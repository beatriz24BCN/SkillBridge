import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { resetPassword } from '../../services/authService'
import './Auth.css'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await resetPassword(token, password)
      setDone(true)
    } catch (resetError) {
      setError(resetError.message || 'Unable to reset password')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-root">
      <div className="auth-card">
        <h1 className="auth-title">Choose a new password</h1>
        {done ? (
          <div className="card note" role="status">Your password was updated. <Link to="/login">Log in</Link>.</div>
        ) : !token ? (
          <div className="auth-error">The recovery link is missing its token.</div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-label">New password<input className="auth-input" type="password" value={password} onChange={event => setPassword(event.target.value)} required /></label>
            <label className="auth-label">Confirm password<input className="auth-input" type="password" value={confirm} onChange={event => setConfirm(event.target.value)} required /></label>
            <button type="submit" className="btn-primary auth-cta" disabled={submitting}>{submitting ? 'Updating…' : 'Update password'}</button>
          </form>
        )}
        {error && <div className="auth-error" role="alert">{error}</div>}
      </div>
    </div>
  )
}
