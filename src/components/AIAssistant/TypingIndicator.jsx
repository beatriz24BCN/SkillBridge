import React from 'react'

export default function TypingIndicator({ status = '' }) {
  return (
    <div className="ai-typing-wrap">
      <div className="ai-msg-bubble typing">
        <div className="ai-msg-avatar ai" aria-hidden>🤖</div>
        <div className="ai-typing">
          <div className="dots">
            <span />
            <span />
            <span />
          </div>
          <div className="ai-typing-text">{status || 'Bridge AI is thinking...'}</div>
        </div>
      </div>
    </div>
  )
}
