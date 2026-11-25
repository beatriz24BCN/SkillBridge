import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

vi.mock('../context/AuthContext', () => ({ useAuth: () => ({
  isAuthenticated: true,
  logout: vi.fn(),
}) }))
const savedJobs = vi.hoisted(() => ({ getSavedJobs: vi.fn() }))
vi.mock('../services/savedJobsService', () => ({
  ...savedJobs,
  saveJob: vi.fn(),
  removeSavedJob: vi.fn(),
}))

import SavedJobs from './SavedJobs'

describe('SavedJobs', () => {
  it('loads persisted saved jobs instead of mock data', async () => {
    savedJobs.getSavedJobs.mockResolvedValue([{
      id: 9,
      job_id: 3,
      job: {
        id: 3,
        title: 'Persisted Job',
        description: 'From PostgreSQL',
        company: { id: 2, name: 'Real Company' },
        requirements: 'React',
        tags: [],
        labels: [],
      },
    }])
    render(<MemoryRouter><SavedJobs /></MemoryRouter>)
    expect(await screen.findByText('Persisted Job')).toBeInTheDocument()
    await waitFor(() => expect(savedJobs.getSavedJobs).toHaveBeenCalledOnce())
  })
})
