import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const auth = vi.hoisted(() => ({ value: { isAuthenticated: true } }))
const services = vi.hoisted(() => ({
  createApplication: vi.fn(),
  saveJob: vi.fn(),
  removeSavedJob: vi.fn(),
}))

vi.mock('../context/AuthContext', () => ({ useAuth: () => auth.value }))
vi.mock('../services/applicationsService', () => ({ createApplication: services.createApplication }))
vi.mock('../services/savedJobsService', () => ({
  saveJob: services.saveJob,
  removeSavedJob: services.removeSavedJob,
}))

import JobCard from './JobCard/JobCard'

const job = {
  id: 4,
  title: 'Frontend Engineer',
  description: 'Build interfaces',
  company: 'Example Company',
  location: 'Remote',
  tags: [],
  labels: [],
}

function renderCard(props = {}) {
  return render(
    <MemoryRouter>
      <JobCard job={job} {...props} />
    </MemoryRouter>,
  )
}

describe('JobCard actions', () => {
  beforeEach(() => {
    auth.value = { isAuthenticated: true }
    services.createApplication.mockReset()
    services.saveJob.mockReset()
    services.removeSavedJob.mockReset()
  })

  it('submits an application through the backend service', async () => {
    services.createApplication.mockResolvedValue({ id: 1 })
    renderCard()
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
    await waitFor(() => expect(services.createApplication).toHaveBeenCalledWith({ job_id: job.id }))
    expect(await screen.findByRole('button', { name: 'Applied' })).toBeDisabled()
  })

  it('saves and removes a job through the backend service', async () => {
    services.saveJob.mockResolvedValue({ id: 2 })
    services.removeSavedJob.mockResolvedValue({ message: 'Saved job removed' })
    renderCard()

    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    await waitFor(() => expect(services.saveJob).toHaveBeenCalledWith(job.id))
    fireEvent.click(await screen.findByRole('button', { name: 'Saved' }))
    await waitFor(() => expect(services.removeSavedJob).toHaveBeenCalledWith(job.id))
  })
})
