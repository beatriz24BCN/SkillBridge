import React from 'react'

const QUICK_PROMPTS = [
  'Practice a React interview',
  'Improve my CV',
  'Explain JWT',
  'Prepare me for a Frontend interview',
  'Analyze this job description'
]

export default function QuickPrompts({ onSelect, disabled = false }) {
  return (
    <div className="quick-prompts-wrap">
      {QUICK_PROMPTS.map(prompt => (
        <button
          key={prompt}
          className="quick-prompt-chip"
          onClick={() => onSelect(prompt)}
          disabled={disabled}
          aria-label={prompt}
        >
          <span className="chip-icon">⚡</span>
          <span className="chip-text">{prompt}</span>
        </button>
      ))}
    </div>
  )
}
