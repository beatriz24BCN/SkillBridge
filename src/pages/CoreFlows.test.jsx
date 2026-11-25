import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const auth = vi.hoisted(() => ({
  user: {
    id: 5,
    email: 'candidate@example.test',
    first_name: 'Alex',
    last_name: 'Candidate',
    phone: '+34 600 000 000',
    location: 'Barcelona',
    skills: ['React'],
    experience: [],
  },
  logout: vi.fn(),
  updateUser: vi.fn(),
}))
const services = vi.hoisted(() => ({
  getJobs: vi.fn(),
  getJob: vi.fn(),
  createJob: vi.fn(),
  updateJob: vi.fn(),
  deleteJob: vi.fn(),
  getApplications: vi.fn(),
  getCompanies: vi.fn(),
}))

vi.mock('../context/AuthContext', () => ({ useAuth: () => auth }))
vi.mock('../services/jobsService', () => ({
  getJobs: services.getJobs,
  getJob: services.getJob,
  createJob: services.createJob,
  updateJob: services.updateJob,
  deleteJob: services.deleteJob,
}))
vi.mock('../services/applicationsService', () => ({
  getApplications: services.getApplications,
  createApplication: vi.fn(),
}))
vi.mock('../services/companiesService', () => ({
  getCompanies: services.getCompanies,
}))
vi.mock('../services/savedJobsService', () => ({
  saveJob: vi.fn(),
  removeSavedJob: vi.fn(),
}))

import Dashboard from './Dashboard'
import Jobs from './Jobs'
import Profile from './Profile'
import ProfileEdit from './ProfileEdit'
import JobForm from './JobForm'

const job = {
  id: 7,
  title: 'Backend Engineer',
  description: 'Persistent job',
  location: 'Barcelona',
  modality: 'Remote',
  requirements: 'Python',
  company_id: 2,
  company: { id: 2, name: 'Company API', owner_id: auth.user.id },
}

describe('core frontend flows', () => {
  beforeEach(() => {
    Object.values(services).forEach(mock => mock.mockReset())
    auth.updateUser.mockReset()
    services.getJobs.mockResolvedValue([job])
    services.getApplications.mockResolvedValue([{
      id: 11,
      status: 'pending',
      job_id: job.id,
      job,
    }])
  })

  it('shows dashboard jobs and applications from backend services', async () => {
    render(<MemoryRouter><Dashboard /></MemoryRouter>)
    expect((await screen.findAllByText('Backend Engineer')).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Company API').length).toBeGreaterThan(0)
    expect(screen.getAllByText('pending').length).toBeGreaterThan(0)
  })

  it('renders the persisted professional profile', () => {
    render(<MemoryRouter><Profile /></MemoryRouter>)
    expect(screen.getByText('+34 600 000 000')).toBeInTheDocument()
    expect(screen.getByText('Barcelona')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('updates profile data through AuthContext', async () => {
    auth.updateUser.mockResolvedValue({})
    render(
      <MemoryRouter initialEntries={['/profile/edit']}>
        <Routes>
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="/profile" element={<div>Profile page</div>} />
        </Routes>
      </MemoryRouter>,
    )
    fireEvent.change(screen.getByLabelText('Phone'), { target: { value: '+34 611 111 111' } })
    fireEvent.change(screen.getByLabelText('Skills and technologies'), { target: { value: 'React, Python' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))
    await waitFor(() => expect(auth.updateUser).toHaveBeenCalledWith(expect.objectContaining({
      phone: '+34 611 111 111',
      skills: ['React', 'Python'],
    })))
  })

  it('lists real jobs and exposes owner actions only', async () => {
    render(<MemoryRouter><Jobs /></MemoryRouter>)
    expect(await screen.findByText('Backend Engineer')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Edit' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })

  it('publishes a job for an owned company through the service', async () => {
    services.getCompanies.mockResolvedValue([{ id: 2, name: 'Company API', owner_id: auth.user.id }])
    services.createJob.mockResolvedValue({ id: 8 })
    render(
      <MemoryRouter initialEntries={['/jobs/new']}>
        <Routes>
          <Route path="/jobs/new" element={<JobForm />} />
          <Route path="/jobs" element={<div>Jobs page</div>} />
        </Routes>
      </MemoryRouter>,
    )
    await waitFor(() => expect(screen.getByRole('option', { name: 'Company API' })).toBeInTheDocument())
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Platform Engineer' } })
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Build reliable systems' } })
    fireEvent.change(screen.getByLabelText('Company'), { target: { value: '2' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    await waitFor(() => expect(services.createJob).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Platform Engineer',
      company_id: 2,
    })))
  })
})
