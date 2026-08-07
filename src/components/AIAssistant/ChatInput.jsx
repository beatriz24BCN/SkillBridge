import React, { forwardRef } from 'react'

const ChatInput = forwardRef(function ChatInput({ value, onChange, onSend, disabled = false }, ref) {
  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      onSend()
    }
  }

  return (
    <div className="ai-input-wrap">
      <textarea
        ref={ref}
        className="ai-input"
        placeholder="Ask me about jobs, your CV, or interviews..."
        value={value}
        onChange={event => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <button className="ai-send" onClick={onSend} aria-label="Send" disabled={disabled}>➤</button>
    </div>
  )
})

export default ChatInput
