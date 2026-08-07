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
    <>
      {QUICK_PROMPTS.map(prompt => (
        <button key={prompt} className="quick-prompt" onClick={() => onSelect(prompt)} disabled={disabled}>
          {prompt}
        </button>
      ))}
    </>
  )
}
