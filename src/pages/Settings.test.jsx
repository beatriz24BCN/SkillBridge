import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

const auth = vi.hoisted(() => ({
  updateUser: vi.fn(),
  logout: vi.fn(),
  user: { preferences: {} },
}))
vi.mock('../context/AuthContext', () => ({ useAuth: () => auth }))

import Settings from './Settings'

describe('Settings', () => {
  it('persists updated account preferences', async () => {
    auth.updateUser.mockResolvedValue({})
    render(<MemoryRouter><Settings /></MemoryRouter>)
    fireEvent.click(screen.getByLabelText('Remote opportunities only'))
    fireEvent.change(screen.getByLabelText('Preferred location'), { target: { value: 'Barcelona' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save preferences' }))
    await waitFor(() => expect(auth.updateUser).toHaveBeenCalledWith({
      preferences: expect.objectContaining({
        remote_only: true,
        preferred_location: 'Barcelona',
      }),
    }))
    expect(await screen.findByText('Preferences saved')).toBeInTheDocument()
  })
})
