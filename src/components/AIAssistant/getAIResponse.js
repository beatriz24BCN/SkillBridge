function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function makeRichResponse(title, bullets, advice) {
  return {
    title,
    bullets,
    advice
  }
}

function selectResponse(message) {
  const text = message.toLowerCase()

  if (text.includes('react') && text.includes('interview')) {
    return makeRichResponse(
      'React Interview Drill',
      [
        'Explain the lifecycle of useEffect and dependency arrays.',
        'Compare controlled vs uncontrolled components with examples.',
        'Describe memoization: React.memo, useMemo, useCallback.'
      ],
      'Practice building a small component that lifts state up; aim for clear explanations and one practical example.'
    )
  }

  if (text.includes('cv') || text.includes('resume') || text.includes('improve my cv')) {
    return makeRichResponse(
      'CV Improvement Checklist',
      [
        'Start each experience bullet with an action verb.',
        'Add measurable outcomes (%, time saved, revenue, conversions).',
        'Keep tech stack specific (React, Vite, Jest, CI/CD).'
      ],
      'Highlight 2–3 projects with measurable impact and links. Keep the summary concise and role-focused.'
    )
  }

  if (text.includes('analyze') || text.includes('job description')) {
    return makeRichResponse(
      'Job Description Analyzer',
      [
        'Identify must-have skills and years of experience.',
        'Extract business objectives from responsibilities.',
        'Pick keywords to mirror in your CV and cover letter.'
      ],
      'Share the JD and I will map sections to your CV and suggested talking points.'
    )
  }

  if (text.includes('job') || text.includes('find jobs') || text.includes('job match')) {
    return makeRichResponse(
      'Job Match Tips',
      [
        'Apply to recent postings (last 72h).',
        'Match 60–80% of requirements and explain gaps in a short note.',
        'Prioritize companies with clear product focus.'
      ],
      'I can surface matches and draft a short tailored message for each application.'
    )
  }

  if (text.includes('jwt')) {
    return {
      title: 'JWT explained simply',
      subtitle: 'Compact token-based authentication for distributed apps',
      bullets: [
        'Header — metadata about signing algorithm.',
        'Payload — claims about the user (not encrypted by default).',
        'Signature — verifies the token was issued by a trusted party.'
      ],
      advice: 'In interviews, contrast JWT with session-based auth (JWT: stateless, scalable; Sessions: server state, easier to revoke).',
      badges: ['Auth', 'Security', 'Web']
    }
  }

  // Default rich guidance
  return makeRichResponse(
    'How can I help today?',
    [
      '🎯 Interview preparation — React, JavaScript, behavioral.',
      '📄 CV advice and improvements.',
      '💼 Job search strategy and tailored applications.'
    ],
    'Choose a quick action or ask me anything about your career.'
  )
}

function genSessionId() {
  // simple random id for session; persisted in sessionStorage for the chat session
  try {
    const existing = sessionStorage.getItem('ai_session_id')
    if (existing) return existing
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    sessionStorage.setItem('ai_session_id', id)
    return id
  } catch (e) {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`
  }
}

function findToken() {
  try {
    const keys = ['token', 'authToken', 'access_token', 'jwt', 'jwt_token', 'sb_token']
    for (const k of keys) {
      const v = localStorage.getItem(k)
      if (v) return v
    }
    return null
  } catch (e) {
    return null
  }
}

export async function getAIResponse(message) {
  // Primary: call backend endpoint
  const apiBase = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
    ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
    : ''

  const sessionId = genSessionId()
  const token = findToken()

  try {
    const res = await fetch(`${apiBase}/api/ai/chat`, {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: `Bearer ${token}` } : {}),
      body: JSON.stringify({ message, sessionId })
    })
    if (!res.ok) {
      // Map known HTTP errors to friendly messages (no sensitive info)
      if (res.status === 401) {
        return { title: null, subtitle: "Your session has expired. Please log in again.", bullets: [], advice: '' }
      }
      if (res.status === 400) {
        return { title: null, subtitle: "Please enter a valid message.", bullets: [], advice: '' }
      }
      // 500 or others
      return { title: null, subtitle: "Sorry, I couldn't process your request right now. Please try again.", bullets: [], advice: '' }
    }

    const data = await res.json()
    // Map backend response to the frontend rich shape. Place the plain text into subtitle.
    const text = (data && (data.text || data.reply || data.message)) || ''
    return { title: null, subtitle: text, bullets: [], advice: '', _meta: data }
  } catch (err) {
    // Network or other failure: do NOT fallback to frontend mock. Return a friendly connection error.
    return { title: null, subtitle: "Sorry, I couldn't connect to the assistant right now. Please try again.", bullets: [], advice: '' }
  }
}
