import React from 'react'

export default function Welcome({ onAction }) {
  const cards = [
    { id: 'interview', title: 'Interview Prep', desc: 'Practice common questions and system design.' },
    { id: 'cv', title: 'CV Review', desc: 'Get succinct CV improvements and highlights.' },
    { id: 'match', title: 'Job Match', desc: 'Find best-fit roles and draft applications.' },
    { id: 'linkedin', title: 'LinkedIn', desc: 'Optimize your profile to attract recruiters.' }
  ]

  return (
    <div className="ai-welcome">
      <div className="ai-welcome-greeting">Hi Beatriz <span className="wave">👋</span></div>
      <div className="ai-welcome-sub">Ready to prepare your next interview?</div>
      <div className="ai-welcome-cards">
        {cards.map(c => (
          <button key={c.id} className="ai-card" onClick={() => onAction(c.id)}>
            <div className="ai-card-title">{c.title}</div>
            <div className="ai-card-desc">{c.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
