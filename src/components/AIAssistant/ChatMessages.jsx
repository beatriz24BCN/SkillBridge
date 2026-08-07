import React from 'react'

function renderRich(ai) {
  if (!ai) return null
  const { title, bullets, advice } = ai
  return (
    <div className="ai-rich">
      {title && <div className="ai-rich-title">{title}</div>}
      {bullets && bullets.length > 0 && (
        <ul className="ai-rich-list">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
      {advice && <div className="ai-rich-advice">{advice}</div>}
    </div>
  )
}

export default function ChatMessages({ messages }) {
  return (
    <>
      {messages.map(msg => (
        <div key={msg.id} className={`ai-msg ${msg.sender}`}>
          <div className="ai-msg-bubble">
            <div className={`ai-msg-avatar ${msg.sender}`} aria-hidden>
              {msg.sender === 'ai' ? '🤖' : '👤'}
            </div>
            <div className="ai-msg-content">
              {msg.sender === 'ai' && msg.rich ? (
                renderRich(msg.rich)
              ) : (
                <div className="ai-msg-text">{msg.text}</div>
              )}
              <div className="ai-time">{msg.time}</div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
