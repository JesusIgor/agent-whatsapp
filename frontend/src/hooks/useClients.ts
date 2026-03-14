import { useState, useCallback, useEffect } from 'react'
import { clientService } from '@/services'
import type { Client, ClientCreate, ClientUpdate, ClientDetails } from '@/types'

interface UseClientsOptions {
  autoFetch?: boolean
  initialFilters?: {
    search?: string
    is_active?: boolean
    stage?: string
  }
}

export function useClients(options: UseClientsOptions = {}) {
  const { autoFetch = false, initialFilters } = options

  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(autoFetch)
  const [error, setError] = useState<string | null>(null)

  const fetchClients = useCallback(
    async (filters?: typeof initialFilters) => {
      try {
        setLoading(true)
        setError(null)
        const data = await clientService.listClients(filters)
        setClients(data)
        return data
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.detail || 'Erro ao buscar clientes'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const searchClients = useCallback(async (query: string, limit = 10) => {
    try {
      setLoading(true)
      setError(null)
      const data = await clientService.searchClients(query, limit)
      return data
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || 'Erro ao buscar clientes'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getClientDetails = useCallback(async (clientId: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await clientService.getClientDetails(clientId)
      return data
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || 'Erro ao buscar detalhes do cliente'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createClient = useCallback(async (clientData: ClientCreate) => {
    try {
      setLoading(true)
      setError(null)
      const newClient = await clientService.createClient(clientData)
      setClients((prev) => [newClient, ...prev])
      return newClient
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || 'Erro ao criar cliente'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateClient = useCallback(
    async (clientId: string, updates: ClientUpdate) => {
      try {
        setLoading(true)
        setError(null)
        const updatedClient = await clientService.updateClient(
          clientId,
          updates
        )
        setClients((prev) =>
          prev.map((c) => (c.id === clientId ? updatedClient : c))
        )
        return updatedClient
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.detail || 'Erro ao atualizar cliente'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    if (autoFetch) {
      fetchClients(initialFilters)
    }
  }, [])

  return {
    clients,
    loading,
    error,
    fetchClients,
    searchClients,
    getClientDetails,
    createClient,
    updateClient,
  }
}

export function useClient(clientId: string | null) {
  const [client, setClient] = useState<ClientDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchClient = useCallback(async () => {
    if (!clientId) return

    try {
      setLoading(true)
      setError(null)
      const data = await clientService.getClientDetails(clientId)
      setClient(data)
      return data
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || 'Erro ao buscar cliente'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [clientId])

  return {
    client,
    loading,
    error,
    fetchClient,
  }
}
