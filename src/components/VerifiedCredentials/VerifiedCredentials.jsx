import React from 'react'
import VerifiedCredentialCard from './VerifiedCredentialCard'
import './VerifiedCredentials.css'

const MOCK = [
  { title: 'Full Stack Developer', issuer: '4Geeks Academy', issueDate: 'Mar 2024', credentialId: '4G-FT-2024-0921', verificationStatus: 'verified', verificationHash: '0x8f4a92bc7e12a9d6f3c...', network: 'Polygon Mainnet', transactionId: '0x91abf72c0cde4...', verificationTimestamp: '13 Jul 2026 - 14:35 UTC' },
  { title: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', issueDate: 'Jun 2023', credentialId: 'AWS-CP-33421', verificationStatus: 'verified', verificationHash: '0xa3d9c12f4b7e...', network: 'Ethereum Mainnet', transactionId: '0xb7c9a21f4e3a...', verificationTimestamp: '11 Jun 2024 - 09:12 UTC' },
  { title: 'Google Cybersecurity Certificate', issuer: 'Google', issueDate: 'Dec 2022', credentialId: 'GSEC-99823', verificationStatus: 'verified', verificationHash: '0x7b2f9e8c1a6d...', network: 'Polygon Mainnet', transactionId: '0xc3d2f71a9b8e...', verificationTimestamp: '02 Jan 2025 - 16:50 UTC' }
]

export default function VerifiedCredentials(){
  return (
    <section className="vc-section container" aria-label="Verified Credentials">
      <h3 className="vc-heading">Verified Credentials</h3>
      <p className="vc-sub">Showcasing blockchain-verified certifications and courses (mock data).</p>
      <div className="vc-list">
        {MOCK.map((c, i) => (
          <VerifiedCredentialCard key={i} credential={c} />
        ))}
      </div>
    </section>
  )
}
