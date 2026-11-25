import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(authService.getToken()))

  useEffect(() => {
    let active = true

    if (!authService.getToken()) {
      setLoading(false)
      return () => { active = false }
    }

    authService.getCurrentUser()
      .then(data => {
        if (active) setUser(data?.user || null)
      })
      .catch(error => {
        if (error.status === 401 || error.status === 404) {
          authService.clearToken()
          if (active) setUser(null)
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [])

  async function login(credentials) {
    const data = await authService.login(credentials)
    authService.setToken(data.access_token)
    setUser(data.user)
    return data.user
  }

  async function register(payload) {
    const data = await authService.register(payload)
    authService.setToken(data.access_token)
    setUser(data.user)
    return data.user
  }

  function logout() {
    authService.clearToken()
    setUser(null)
  }

  async function updateUser(payload) {
    const data = await authService.updateCurrentUser(payload)
    setUser(data.user)
    return data.user
  }

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    updateUser,
  }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
