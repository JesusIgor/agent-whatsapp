export const API_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'

// Chamada direta ao Baileys para evitar dependência de proxy.
export const BAILEYS_URL =
  import.meta.env.VITE_BAILEYS_URL ?? 'http://localhost:3000'

export const APP_NAME =
  import.meta.env.VITE_APP_NAME ?? 'Auzap'
