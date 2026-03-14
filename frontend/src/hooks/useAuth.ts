import { useState, useEffect, useCallback } from 'react'
import { authService } from '@/services'
import type { User, UserLogin, UserCreate } from '@/types'

interface UseAuthReturn {
  user: User | null
  loading: boolean
  error: string | null
  login: (credentials: UserLogin) => Promise<void>
  register: (userData: UserCreate) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  isAuthenticated: boolean
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const currentUser = await authService.getCurrentUser()
          setUser(currentUser)
        } catch (err) {
          authService.logout()
          setUser(null)
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = useCallback(async (credentials: UserLogin) => {
    try {
      setLoading(true)
      setError(null)
      const token = await authService.login(credentials)
      setUser(token.user)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao fazer login')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (userData: UserCreate) => {
    try {
      setLoading(true)
      setError(null)
      const newUser = await authService.register(userData)
      setUser(newUser)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao registrar')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    } catch (err) {
      authService.logout()
      setUser(null)
    }
  }, [])

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user && authService.isAuthenticated(),
  }
}
