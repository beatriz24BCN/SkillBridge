import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const authMocks = vi.hoisted(() => ({
  getToken: vi.fn(),
  getCurrentUser: vi.fn(),
  clearToken: vi.fn(),
  setToken: vi.fn(),
  login: vi.fn(),
  register: vi.fn(),
  updateCurrentUser: vi.fn(),
}))

vi.mock('../services/authService', () => authMocks)

import { AuthProvider, useAuth } from './AuthContext'

function SessionView() {
  const { user, loading, isAuthenticated, logout } = useAuth()
  return (
    <div>
      <span>{loading ? 'loading' : 'ready'}</span>
      <span>{isAuthenticated ? user.email : 'anonymous'}</span>
      <button type="button" onClick={logout}>Logout</button>
    </div>
  )
}

function renderProvider() {
  return render(
    <MemoryRouter>
      <AuthProvider><SessionView /></AuthProvider>
    </MemoryRouter>,
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    authMocks.getToken.mockReset()
    authMocks.getCurrentUser.mockReset()
    authMocks.clearToken.mockReset()
  })

  it('restores a persisted JWT session', async () => {
    authMocks.getToken.mockReturnValue('stored-token')
    authMocks.getCurrentUser.mockResolvedValue({ user: { id: 1, email: 'restored@example.test' } })

    renderProvider()
    expect(screen.getByText('loading')).toBeInTheDocument()
    expect(await screen.findByText('restored@example.test')).toBeInTheDocument()
  })

  it('clears expired sessions', async () => {
    const error = Object.assign(new Error('Expired'), { status: 401 })
    authMocks.getToken.mockReturnValue('expired-token')
    authMocks.getCurrentUser.mockRejectedValue(error)

    renderProvider()
    expect(await screen.findByText('anonymous')).toBeInTheDocument()
    await waitFor(() => expect(authMocks.clearToken).toHaveBeenCalledOnce())
  })

  it('logs out locally and clears the active user', async () => {
    authMocks.getToken.mockReturnValue('stored-token')
    authMocks.getCurrentUser.mockResolvedValue({ user: { id: 1, email: 'active@example.test' } })
    renderProvider()
    expect(await screen.findByText('active@example.test')).toBeInTheDocument()
    screen.getByRole('button', { name: 'Logout' }).click()
    expect(await screen.findByText('anonymous')).toBeInTheDocument()
    expect(authMocks.clearToken).toHaveBeenCalledOnce()
  })
})
