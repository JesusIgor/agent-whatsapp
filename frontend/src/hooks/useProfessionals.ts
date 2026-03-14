import { useState, useCallback } from 'react'
import { professionalService } from '@/services'
import type {
  Professional,
  ProfessionalCreate,
  ProfessionalUpdate,
  ProfessionalAvailability,
} from '@/types'

interface UseProfessionalsReturn {
  professionals: Professional[]
  loading: boolean
  error: string | null
  fetchProfessionals: (params?: {
    petshop_id?: number
    specialty?: string
    is_active?: boolean
  }) => Promise<Professional[]>
  getProfessional: (id: string) => Promise<Professional>
  createProfessional: (data: ProfessionalCreate) => Promise<Professional>
  updateProfessional: (
    id: string,
    updates: ProfessionalUpdate
  ) => Promise<Professional>
  deleteProfessional: (id: string) => Promise<void>
  getAvailability: (
    id: string,
    params?: { start_date?: string; end_date?: string; days_ahead?: number }
  ) => Promise<ProfessionalAvailability>
}

export function useProfessionals(): UseProfessionalsReturn {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfessionals = useCallback(
    async (params?: {
      petshop_id?: number
      specialty?: string
      is_active?: boolean
    }) => {
      try {
        setLoading(true)
        setError(null)
        const data = await professionalService.listProfessionals(params)
        setProfessionals(data)
        return data
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Erro ao carregar profissionais')
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const getProfessional = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      return await professionalService.getProfessional(id)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao carregar profissional')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createProfessional = useCallback(async (data: ProfessionalCreate) => {
    try {
      setLoading(true)
      setError(null)
      const newProfessional = await professionalService.createProfessional(data)
      setProfessionals((prev) => [...prev, newProfessional])
      return newProfessional
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao criar profissional')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProfessional = useCallback(
    async (id: string, updates: ProfessionalUpdate) => {
      try {
        setLoading(true)
        setError(null)
        const updated = await professionalService.updateProfessional(id, updates)
        setProfessionals((prev) =>
          prev.map((p) => (p.id === id ? updated : p))
        )
        return updated
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Erro ao atualizar profissional')
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const deleteProfessional = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await professionalService.deleteProfessional(id)
      setProfessionals((prev) => prev.filter((p) => p.id !== id))
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao remover profissional')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getAvailability = useCallback(
    async (
      id: string,
      params?: { start_date?: string; end_date?: string; days_ahead?: number }
    ) => {
      try {
        setLoading(true)
        setError(null)
        return await professionalService.getAvailability(id, params)
      } catch (err: any) {
        setError(
          err.response?.data?.detail || 'Erro ao carregar disponibilidade'
        )
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return {
    professionals,
    loading,
    error,
    fetchProfessionals,
    getProfessional,
    createProfessional,
    updateProfessional,
    deleteProfessional,
    getAvailability,
  }
}
