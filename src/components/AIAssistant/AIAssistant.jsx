import React, { useEffect, useRef, useState } from 'react'
import './AIAssistant.css'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'
import QuickPrompts from './QuickPrompts'
import Welcome from './Welcome'
import TypingIndicator from './TypingIndicator'
import { getAIResponse } from './getAIResponse'

function nowHHmm(date = new Date()) {
  return new Intl.DateTimeFormat('default', { hour: '2-digit', minute: '2-digit', hour12: false }).format(date)
}

const DEFAULT_WIDTH = 450
const DEFAULT_HEIGHT = 700

export default function AIAssistant({ open = false, onClose = () => {} }) {
  const [minimized, setMinimized] = useState(false)
  const [size, setSize] = useState(() => {
    const w = Math.min(DEFAULT_WIDTH, Math.max(320, window.innerWidth - 48))
    const h = Math.min(DEFAULT_HEIGHT, Math.max(360, window.innerHeight - 96))
    return { width: w, height: h }
  })

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const [statusText, setStatusText] = useState('')

  function scrollToBottom() {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }

  useEffect(() => {
    function onResize() {
      setSize({
        width: Math.min(DEFAULT_WIDTH, Math.max(320, window.innerWidth - 48)),
        height: Math.min(DEFAULT_HEIGHT, Math.max(360, window.innerHeight - 96))
      })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, minimized, isThinking])

  function createMessage(sender, text, suffix = sender === 'user' ? 'u' : 'a') {
    return {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}-${suffix}`,
      sender,
      text,
      time: nowHHmm(new Date())
    }
  }

  async function sendMessage(messageText) {
    const text = messageText.trim()
    if (!text) return

    const userMsg = createMessage('user', text)
    setMessages(prev => [...prev, userMsg])
    setInput('')

    setIsThinking(true)
    try {
      // start AI response and status sequence in parallel
      const aiPromise = getAIResponse(text)

      const statuses = ['Thinking...', 'Analyzing...', 'Responding...']
      for (let s of statuses) {
        setStatusText(s)
        // show each status briefly
        // allow the aiPromise to resolve concurrently
        // but keep statuses visible for a short rhythm
        // total ~900ms (300 each)
        // await small delay
        // eslint-disable-next-line no-await-in-loop
        await new Promise(r => setTimeout(r, 300))
      }

      const aiRich = await aiPromise
      const aiMsg = { ...createMessage('ai', ''), rich: aiRich }
      setMessages(prev => [...prev, aiMsg])
    } catch (error) {
      const fallback = createMessage('ai', 'I had trouble generating a response. Please try again in a moment.')
      setMessages(prev => [...prev, fallback])
    } finally {
      setIsThinking(false)
      setStatusText('')
    }
  }

  function handleSend() {
    if (isThinking) return
    void sendMessage(input)
  }

  function handleQuickPrompt(prompt) {
    if (isThinking) return
    // rellenar el input con la sugerencia para que el usuario pueda editar/enviar
    setInput(prompt)
    // focus en el textarea para que el usuario pueda empezar a escribir inmediatamente
    setTimeout(() => {
      if (inputRef.current && typeof inputRef.current.focus === 'function') inputRef.current.focus()
    }, 50)
  }

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
              <div className="ai-controls">
                <div className="ai-status"><span className="dot"/> <span className="status-text">AI Assistant Online</span></div>
                <button className="ctrl" onClick={() => setMinimized(true)} aria-label="Minimize">─</button>
                <button className="ctrl" onClick={() => setMinimized(false)} aria-label="Restore">▢</button>
                <button className="ctrl close" onClick={() => onClose()} aria-label="Close">✕</button>
              </div>
            </div>
          </div>

          <div className="ai-window">
            <div className="ai-body">
              {messages.length === 0 ? (
                <div className="ai-welcome-wrap">
                  <Welcome onAction={actionId => {
                    // map action to quick prompt text
                    const map = {
                      interview: 'Practice a React interview',
                      cv: 'Improve my CV',
                      match: 'Find jobs for me',
                      linkedin: 'Improve my CV'
                    }
                    const text = map[actionId] || 'Practice a React interview'
                    setInput(text)
                    if (inputRef.current && typeof inputRef.current.focus === 'function') inputRef.current.focus()
                  }} />
                  <div style={{ marginTop: 8 }}>
                    <QuickPrompts onSelect={handleQuickPrompt} disabled={isThinking} />
                  </div>
                </div>
              ) : null}

              <div className="ai-chat">
                <ChatMessages messages={messages} />
                {isThinking && <TypingIndicator status={statusText} />}
                <div ref={bottomRef} />
              </div>

              <ChatInput
                value={input}
                onChange={setInput}
                ref={inputRef}
                onSend={handleSend}
                disabled={isThinking}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
