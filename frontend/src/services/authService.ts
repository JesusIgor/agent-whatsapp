import { api } from '@/lib/api'
import type { User, UserCreate, UserLogin, Token } from '@/types'

function setCookie(name: string, value: string, days: number = 7) {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}

export const authService = {
  async login(credentials: UserLogin): Promise<Token> {
    const response = await api.post<Token>('/auth/login', credentials)

    if (typeof window !== 'undefined' && response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token)
      setCookie('access_token', response.data.access_token, 7) 
    }

    return response.data
  },

  async register(userData: UserCreate): Promise<User> {
    const response = await api.post<User>('/auth/register', userData)
    return response.data
  },

  async refreshToken(): Promise<Token> {
    const response = await api.post<Token>('/auth/refresh', {})

    if (typeof window !== 'undefined' && response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token)
      setCookie('access_token', response.data.access_token, 7)
    }

    return response.data
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me')
    return response.data
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      deleteCookie('access_token')
    }
  },

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem('access_token')
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('access_token')
  },
}
