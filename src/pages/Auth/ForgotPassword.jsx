import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { requestPasswordReset } from '../../services/authService'
import './Auth.css'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await requestPasswordReset(email)
      setSent(true)
    } catch (requestError) {
      setError(requestError.message || 'Unable to request password recovery')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-root">
      <div className="auth-card">
        <h1 className="auth-title">Reset your password</h1>
        <p className="auth-sub">Enter your email to request password recovery instructions.</p>
        {sent ? (
          <div className="card note" role="status">If the email is registered, password reset instructions will be sent.</div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-label">Email
              <input className="auth-input" type="email" value={email} onChange={event => setEmail(event.target.value)} required />
            </label>
            <button type="submit" className="btn-primary auth-cta" disabled={submitting}>{submitting ? 'Requesting…' : 'Send reset instructions'}</button>
          </form>
        )}
        {error && <div className="auth-error" role="alert">{error}</div>}
        <div className="auth-footer"><Link to="/login" className="auth-link">Back to login</Link></div>
      </div>
    </div>
  )
}
