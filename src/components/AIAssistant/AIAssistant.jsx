import React, { useEffect, useRef, useState } from 'react'
// react-rnd temporarily disabled due to Vite compatibility (process undefined)
import './AIAssistant.css'

function nowHHmm(date = new Date()) {
  return new Intl.DateTimeFormat('default', { hour: '2-digit', minute: '2-digit', hour12: false }).format(date)
}

const DEFAULT_WIDTH = 450
const DEFAULT_HEIGHT = 700

export default function AIAssistant({ open = false, onClose = () => {} }) {
  console.log('AIAssistant rendered', { open })
  const [minimized, setMinimized] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [size, setSize] = useState({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT })
  const panelRef = useRef(null)

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [savedJobs, setSavedJobs] = useState(new Set())

  useEffect(() => {
    console.log('AIAssistant mounted', { open, minimized, pos })
  }, [open, minimized])

  // compute initial position from right/bottom when opened
  useEffect(() => {
    if (!open) return
    const x = Math.max(40, window.innerWidth - size.width - 40)
    const y = Math.max(40, window.innerHeight - size.height - 40)
    setPos({ x, y })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // auto-scroll
  const chatRef = useRef(null)
  useEffect(() => { scrollToBottom() }, [messages, minimized])
  function scrollToBottom() {
    const el = chatRef.current
    if (el) el.scrollTop = el.scrollHeight
  }

  // drag/resize are handled by react-rnd (Rnd component)

  // keep compatibility with previous handlers (no-op when using Rnd)
  function startDrag(e) { if (e && e.preventDefault) e.preventDefault() }
  function startResize(e) { if (e && e.preventDefault) e.preventDefault() }

  function handleSend() {
    const text = input.trim()
    if (!text) return
    const t = new Date()
    const userMsg = { id: Date.now() + '-u', sender: 'user', text, time: nowHHmm(t) }
    setMessages(m => [...m, userMsg])
    setInput('')
    // generate mock response
    setTimeout(() => generateMockResponse(text), 600 + Math.floor(Math.random() * 300))
  }

  function pushAIMessage(obj) {
    const t = new Date()
    const msg = { id: Date.now() + '-a', sender: 'ai', time: nowHHmm(t), ...obj }
    setMessages(m => [...m, msg])
  }

  function generateMockResponse(trigger) {
    const q = trigger.toLowerCase()
    if (q.includes('find jobs') || q.includes('jobs')) {
      pushAIMessage({ text: 'Here are some matches I found for you:', kind: 'jobs', jobs: [
        { id: 'j1', title: 'Frontend Developer', location: 'Barcelona (Remote)', salary: '€55K', match: '96%' },
        { id: 'j2', title: 'UI Engineer', location: 'Madrid (Hybrid)', salary: '€60K', match: '93%' },
        { id: 'j3', title: 'Frontend Engineer', location: 'Remote', salary: '€58K', match: '90%' }
      ] })
      return
    }
    if (q.includes('cv') || q.includes('resume')) {
      pushAIMessage({ text: 'Suggestions:\n- Improve summary to focus on measurable impact.\n- Add a Projects section with links and results.\n- Expand skills with specific libraries and tools.\n- Include job-specific keywords.' })
      return
    }
    if (q.includes('interview')) {
      pushAIMessage({ text: 'Interview topics to practice:\n- React fundamentals and hooks\n- Core JavaScript and ES6+\n- Designing/consuming REST APIs\n- Communication and teamwork scenarios' })
      return
    }
    if (q.includes('recommend') || q.includes('skills')) {
      pushAIMessage({ text: 'Recommended skills to learn:\n- TypeScript\n- Node.js\n- Testing (Jest / Testing Library)\n- Docker\n- AWS (Basics)' })
      return
    }
    // default echo
    pushAIMessage({ text: "I'm here to help — try a quick action or ask me about jobs, your CV or interviews." })
  }

  function handleQuickAction(action) {
    // simulate user click message
    const text = action
    const t = new Date()
    const userMsg = { id: Date.now() + '-q', sender: 'user', text, time: nowHHmm(t) }
    setMessages(m => [...m, userMsg])
    setTimeout(() => generateMockResponse(action), 300)
  }

  function toggleSaveJob(jobId) {
    setSavedJobs(prev => {
      const s = new Set(prev)
      if (s.has(jobId)) s.delete(jobId)
      else s.add(jobId)
      return s
    })
  }

  // rendering
  const shouldShow = open || minimized
  if (!shouldShow) return null

  return (
    <div className={`ai-assistant-root ${open ? 'open' : ''} ${minimized ? 'minimized' : ''}`}>
      {/* floating robot when minimized */}
      {minimized && (
        <button className="ai-robot-btn" onClick={() => setMinimized(false)} aria-label="Restore AI Assistant">
          🤖
        </button>
      )}

      {/* panel (temporary simple panel to test visibility, react-rnd disabled) */}
      {!minimized && (
        <div
          className="ai-panel"
          ref={panelRef}
          style={{ position: 'fixed', right: 40, bottom: 40, width: size.width, height: size.height, zIndex: 9999 }}
        >
          <div className="ai-header">
            <div className="ai-header-left">
              <div className="ai-avatar" aria-hidden />
              <div className="ai-titles">
                <div className="ai-title">Bridge AI Assistant</div>
                <div className="ai-sub">Your intelligent career companion</div>
              </div>
            </div>
            <div className="ai-header-right">
              <div className="ai-status"><span className="dot"/> AI Assistant Online</div>
              <div className="ai-controls">
                <button className="ctrl" onClick={() => setMinimized(true)} aria-label="Minimize">─</button>
                <button className="ctrl" onClick={() => setMinimized(false)} aria-label="Restore">▢</button>
                <button className="ctrl close" onClick={() => onClose()} aria-label="Close">✕</button>
              </div>
            </div>
          </div>

          <div className="ai-window">
            <div className="ai-body">
              <div className="ai-quick-actions">
                <button onClick={() => handleQuickAction('Find jobs for me')}>Find jobs for me</button>
                <button onClick={() => handleQuickAction('Improve my CV')}>Improve my CV</button>
                <button onClick={() => handleQuickAction('Prepare my interview')}>Prepare my interview</button>
                <button onClick={() => handleQuickAction('Recommend skills to learn')}>Recommend skills to learn</button>
              </div>

              <div className="ai-chat" ref={chatRef}>
                {messages.map(msg => (
                  <div key={msg.id} className={`ai-msg ${msg.sender}`}>
                    <div className="ai-msg-text">{msg.text}</div>
                    {msg.kind === 'jobs' && msg.jobs && (
                      <div className="job-list">
                        {msg.jobs.map(job => (
                          <div className="job-card" key={job.id}>
                            <div className="job-main">
                              <div className="job-title">{job.title}</div>
                              <div className="job-location">{job.location} • {job.salary}</div>
                              <div className="job-meta">Match: {job.match}</div>
                            </div>
                            <div className="job-actions">
                              <button
                                className={`job-save ${savedJobs.has(job.id) ? 'saved' : ''}`}
                                onClick={() => toggleSaveJob(job.id)}
                              >
                                {savedJobs.has(job.id) ? 'Saved' : 'Save Job'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="ai-time">{msg.time}</div>
                  </div>
                ))}
              </div>

              <div className="ai-input-wrap">
                <textarea
                  className="ai-input"
                  placeholder="Ask me about jobs, your CV, or interviews..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                />
                <button className="ai-send" onClick={handleSend} aria-label="Send">➤</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
