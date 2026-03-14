import { useState, useCallback } from 'react'
import { petService, PetCreate, PetUpdate } from '@/services/petService'
import type { Pet } from '@/types'

interface UsePetsReturn {
  pets: Pet[]
  loading: boolean
  error: string | null
  fetchPets: (params?: {
    petshop_id?: number
    client_id?: string
    species?: string
    limit?: number
    offset?: number
  }) => Promise<Pet[]>
  getPet: (id: string) => Promise<Pet>
  createPet: (data: PetCreate) => Promise<Pet>
  updatePet: (id: string, updates: PetUpdate) => Promise<Pet>
  deletePet: (id: string) => Promise<void>
  getClientPets: (clientId: string, petshopId?: number) => Promise<Pet[]>
}

export function usePets(): UsePetsReturn {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPets = useCallback(
    async (params?: {
      petshop_id?: number
      client_id?: string
      species?: string
      limit?: number
      offset?: number
    }) => {
      try {
        setLoading(true)
        setError(null)
        const data = await petService.listPets(params)
        setPets(data)
        return data
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Erro ao carregar pets')
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const getPet = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      return await petService.getPet(id)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao carregar pet')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createPet = useCallback(async (data: PetCreate) => {
    try {
      setLoading(true)
      setError(null)
      const newPet = await petService.createPet(data)
      setPets((prev) => [...prev, newPet])
      return newPet
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao criar pet')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePet = useCallback(async (id: string, updates: PetUpdate) => {
    try {
      setLoading(true)
      setError(null)
      const updated = await petService.updatePet(id, updates)
      setPets((prev) => prev.map((p) => (p.id === id ? updated : p)))
      return updated
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao atualizar pet')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deletePet = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await petService.deletePet(id)
      setPets((prev) => prev.filter((p) => p.id !== id))
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao remover pet')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getClientPets = useCallback(
    async (clientId: string, petshopId?: number) => {
      try {
        setLoading(true)
        setError(null)
        const data = await petService.getClientPets(clientId, petshopId)
        setPets(data)
        return data
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Erro ao carregar pets do cliente')
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return {
    pets,
    loading,
    error,
    fetchPets,
    getPet,
    createPet,
    updatePet,
    deletePet,
    getClientPets,
  }
}
