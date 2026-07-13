import React from 'react'
import './VerifiedCredentials.css'

export default function VerifiedCredentialCard({credential}){
  const { title, issuer, issueDate, credentialId, verificationStatus,
    verificationHash, network, transactionId, verificationTimestamp } = credential

  const shortHash = (s='') => {
    if(!s) return ''
    const t = s.replace(/^0x/, '')
    if(t.length <= 10) return s
    return '0x' + t.slice(0,4).toUpperCase() + '...' + t.slice(-4).toUpperCase()
  }

  const iconFor = (title, issuer) => {
    if(/4Geeks/i.test(issuer) || /Full Stack/i.test(title)){
      return (
        <svg className="vc-cert-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 8L8 16" stroke="#1D4ED8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 8h8v8" stroke="#1D4ED8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
    if(/Amazon|AWS/i.test(issuer) || /Cloud/i.test(title)){
      return (
        <svg className="vc-cert-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 17.5a4 4 0 0 0-4-4H8a4 4 0 1 0 0 8h12" stroke="#1D4ED8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
    // default: shield
    return (
      <svg className="vc-cert-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2l7 3v5c0 5-3.6 9.9-7 11-3.4-1.1-7-6-7-11V5l7-3z" stroke="#1D4ED8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M9.5 12.5l1.8 1.8L14.5 11" stroke="#1D4ED8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }

  const onView = () => {
    console.log('View verification for', credentialId)
    window.open('#', '_blank')
  }

  return (
    <div className="vc-card" tabIndex={0}>
      <div className="vc-left">
        {iconFor(title, issuer)}
      </div>

      <div className="vc-main">
        <div className="vc-title">{title}</div>
        <div className="vc-issuer">{issuer} <span className="vc-network-badge">{network}</span></div>
        <div className="vc-meta">Issued {issueDate} · ID: {credentialId}</div>

        {verificationHash && (
          <div className="vc-verify-grid">
            <div className="vc-verify-row"><strong>Verification Hash</strong><span className="vc-mono">{shortHash(verificationHash)}</span></div>
            <div className="vc-verify-row"><strong>Network</strong><span>{network}</span></div>
            <div className="vc-verify-row"><strong>Transaction</strong><span className="vc-mono">{shortHash(transactionId)}</span></div>
            <div className="vc-verify-row"><strong>Verified</strong><span>{verificationTimestamp}</span></div>
          </div>
        )}

        <div className="vc-actions">
          <button className="vc-btn" onClick={onView}>View Verification</button>
        </div>
      </div>

      <div className="vc-badge-wrap">
        {verificationStatus === 'verified' && (
          <div className="vc-badge vc-badge-large" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="vc-icon">
              <circle cx="12" cy="12" r="10" fill="#10B981" fillOpacity="0.12" stroke="#10B981" strokeWidth="0.6"/>
              <path d="M9.5 12.5l1.8 1.8L14.5 11" stroke="#064E3B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Blockchain Verified</span>
          </div>
        )}
      </div>
    </div>
  )
}
