import React, { useEffect, useState } from 'react'
import './ProfileCompletionCard.css'

const DEFAULT = {
  title: 'Profile Completion',
  percent: 80,
  completed: ['CV Uploaded', 'Skills Added', 'Experience Added'],
  missing: ['Portfolio Missing', 'Profile Picture Missing'],
  aiText: 'Complete your profile to increase your job match score by up to 15%.',
  aiPotential: 95,
}

export default function ProfileCompletionCard({ data = DEFAULT }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // trigger CSS width animation by changing the inline width after mount
    const t = setTimeout(() => setProgress(data.percent), 120)
    return () => clearTimeout(t)
  }, [data.percent])

  return (
    <aside className="profile-card">
      <div className="profile-card-header">
        <div className="profile-card-title-wrap">
          <div className="profile-avatar" aria-hidden>
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0" stopColor="#60A5FA" />
                  <stop offset="1" stopColor="#2563EB" />
                </linearGradient>
              </defs>
              <circle cx="24" cy="24" r="22" fill="url(#g1)" opacity="0.12" />
              <path d="M24 22a6 6 0 100-12 6 6 0 000 12z" fill="#2563EB" opacity="0.95" />
              <path d="M12 36c1.5-4 6-7 12-7s10.5 3 12 7" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
            </svg>
          </div>
          <div>
            <div className="profile-card-title">{data.title}</div>
            <div className="profile-card-subtitle">Complete your profile to unlock better AI matches.</div>
          </div>
        </div>

        <div className="ai-badge">🎯 AI Match Potential: <strong>{data.aiPotential}%</strong></div>
      </div>

      <div className="progress-wrap">
        <div className="progress-bar-bg" aria-hidden>
          <div className="progress-bar" style={{ width: `${progress}%` }} />
          <div className="progress-glow" style={{ width: `${progress}%` }} />
        </div>
        <div className="progress-percent">{progress}%</div>
      </div>

      <div className="lists">
        <div className="list completed">
          <div className="list-title">Completed</div>
          <ul>
            {data.completed.map((item, idx) => (
              <li key={idx}>
                <span className="emoji emoji-success" role="img" aria-label="completed">✅</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="list missing">
          <div className="list-title">Missing</div>
          <ul>
            {data.missing.map((item, idx) => (
              <li key={idx}>
                <span className={`emoji emoji-missing`} role="img" aria-label="missing">{item.toLowerCase().includes('profile') ? '📷' : '⚠️'}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="ai-recommendation">
        <div className="ai-label">AI Recommendation:</div>
        <div className="ai-text">{data.aiText}</div>
      </div>

      <div className="ai-insight">
        <div className="ai-insight-header">
          <svg className="ai-insight-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2l1.8 4.6L18 8l-4 2.8L14 16l-2-1.2L10 16l.2-5.2L6 8l4.2-.8L12 2z" fill="#6366F1" />
          </svg>
          <div className="ai-insight-title">AI Insight</div>
        </div>
        <div className="ai-insight-text">Your profile currently ranks higher than 72% of candidates in Barcelona.</div>
        <div className="ai-insight-text" style={{marginTop:8}}>Complete your portfolio to unlock premium AI recommendations and increase interview opportunities by up to 15%.</div>
      </div>

      <div className="profile-actions">
        <button className="btn-complete">Complete Profile →</button>
      </div>
    </aside>
  )
}
