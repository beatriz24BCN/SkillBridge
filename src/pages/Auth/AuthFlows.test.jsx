import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const authContext = vi.hoisted(() => ({
  login: vi.fn(),
  register: vi.fn(),
}))
const authService = vi.hoisted(() => ({
  requestPasswordReset: vi.fn(),
  resetPassword: vi.fn(),
}))

vi.mock('../../context/AuthContext', () => ({ useAuth: () => authContext }))
vi.mock('../../services/authService', () => authService)

import Login from './Login'
import Signup from './Signup'
import ForgotPassword from './ForgotPassword'
import ResetPassword from './ResetPassword'

describe('authentication pages', () => {
  beforeEach(() => {
    Object.values(authContext).forEach(mock => mock.mockReset())
    Object.values(authService).forEach(mock => mock.mockReset())
  })

  it('submits login credentials and handles backend errors', async () => {
    authContext.login.mockRejectedValue(new Error('Invalid credentials'))
    render(<MemoryRouter><Login /></MemoryRouter>)
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'candidate@example.test' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }))
    await waitFor(() => expect(authContext.login).toHaveBeenCalledWith({
      email: 'candidate@example.test',
      password: 'Password123',
    }))
    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument()
  })

  it('registers a real user instead of navigating on a placeholder', async () => {
    authContext.register.mockResolvedValue({ id: 1 })
    render(
      <MemoryRouter initialEntries={['/signup']}>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Routes>
      </MemoryRouter>,
    )
    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Alex Candidate' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'alex@example.test' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password123' } })
    fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'Password123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }))
    await waitFor(() => expect(authContext.register).toHaveBeenCalledWith({
      email: 'alex@example.test',
      password: 'Password123',
      first_name: 'Alex',
      last_name: 'Candidate',
    }))
    expect(await screen.findByText('Dashboard')).toBeInTheDocument()
  })

  it('requests recovery with a non-enumerating confirmation', async () => {
    authService.requestPasswordReset.mockResolvedValue({})
    render(<MemoryRouter><ForgotPassword /></MemoryRouter>)
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'candidate@example.test' } })
    fireEvent.click(screen.getByRole('button', { name: 'Send reset instructions' }))
    expect(await screen.findByText(/If the email is registered/)).toBeInTheDocument()
  })

  it('submits a reset token and new password', async () => {
    authService.resetPassword.mockResolvedValue({})
    render(
      <MemoryRouter initialEntries={['/reset-password?token=safe-test-token']}>
        <ResetPassword />
      </MemoryRouter>,
    )
    fireEvent.change(screen.getByLabelText('New password'), { target: { value: 'NewPassword123' } })
    fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'NewPassword123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Update password' }))
    await waitFor(() => expect(authService.resetPassword).toHaveBeenCalledWith('safe-test-token', 'NewPassword123'))
    expect(await screen.findByText(/Your password was updated/)).toBeInTheDocument()
  })
})
