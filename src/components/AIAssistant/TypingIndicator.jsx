import React from 'react'

export default function TypingIndicator({ status = '' }) {
  return (
    <div className="ai-typing">
      <div className="dots">
        <span />
        <span />
        <span />
      </div>
      <div className="ai-typing-text">{status || 'AI is thinking...'}</div>
    </div>
  )
}
