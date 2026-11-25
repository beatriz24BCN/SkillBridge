import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const auth = vi.hoisted(() => ({ value: { isAuthenticated: false, loading: false } }))
vi.mock('../context/AuthContext', () => ({ useAuth: () => auth.value }))

import ProtectedRoute from './ProtectedRoute'

describe('ProtectedRoute', () => {
  beforeEach(() => {
    auth.value = { isAuthenticated: false, loading: false }
  })

  it('redirects anonymous users to login', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<div>Login page</div>} />
          <Route path="/dashboard" element={<ProtectedRoute><div>Private page</div></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Login page')).toBeInTheDocument()
  })

  it('renders a loading session before redirecting', () => {
    auth.value = { isAuthenticated: false, loading: true }
    render(
      <MemoryRouter>
        <ProtectedRoute><div>Private page</div></ProtectedRoute>
      </MemoryRouter>,
    )
    expect(screen.getByText('Loading session…')).toBeInTheDocument()
  })
})
