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

export async function getAIResponse(message) {
  // Simulate network + processing latency while keeping an async API shape.
  await delay(1000)
  return selectResponse(message)
}
