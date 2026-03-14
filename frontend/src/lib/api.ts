import axios from 'axios'

// Sempre usa /api — o Vite proxy (dev) ou nginx (prod) encaminham para o backend.
// NUNCA usar URL absoluta com hostname Docker aqui (o browser não resolve "backend:3000").
const BASE_URL = '/api'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Injeta o token em cada requisição
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Se o servidor retornar 401, limpa o token salvo e redireciona para login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      document.cookie =
        'access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
