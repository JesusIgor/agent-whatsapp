import { useState, useCallback } from 'react'
import { aestheticsService } from '@/services'
import type {
  AestheticService,
  AestheticBookingRequest,
  CheckInRequest,
  CompleteServiceRequest,
  AestheticStats,
} from '@/types'

export function useAesthetics(petshopId: number) {
  const [services, setServices] = useState<AestheticService[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchScheduledServices = useCallback(
    async (targetDate?: string) => {
      try {
        setLoading(true)
        setError(null)
        const data = await aestheticsService.getScheduledServices(
          petshopId,
          targetDate
        )
        setServices(data)
        return data
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.detail || 'Erro ao buscar serviços agendados'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [petshopId]
  )

  const fetchInProgressServices = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await aestheticsService.getInProgressServices(petshopId)
      setServices(data)
      return data
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || 'Erro ao buscar serviços em andamento'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [petshopId])

  const fetchCompletedServices = useCallback(
    async (startDate?: string, endDate?: string) => {
      try {
        setLoading(true)
        setError(null)
        const data = await aestheticsService.getCompletedServices(
          petshopId,
          startDate,
          endDate
        )
        setServices(data)
        return data
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.detail || 'Erro ao buscar serviços concluídos'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [petshopId]
  )

  const createBooking = useCallback(
    async (bookingData: AestheticBookingRequest) => {
      try {
        setLoading(true)
        setError(null)
        const newBooking = await aestheticsService.createBooking(
          petshopId,
          bookingData
        )
        setServices((prev) => [newBooking, ...prev])
        return newBooking
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.detail || 'Erro ao criar agendamento'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [petshopId]
  )

  const checkIn = useCallback(
    async (bookingId: string, checkInData: CheckInRequest) => {
      try {
        setLoading(true)
        setError(null)
        const updatedService = await aestheticsService.checkIn(
          bookingId,
          petshopId,
          checkInData
        )
        setServices((prev) =>
          prev.map((s) => (s.id === bookingId ? updatedService : s))
        )
        return updatedService
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.detail || 'Erro ao fazer check-in'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [petshopId]
  )

  const startService = useCallback(
    async (bookingId: string) => {
      try {
        setLoading(true)
        setError(null)
        const updatedService = await aestheticsService.startService(
          bookingId,
          petshopId
        )
        setServices((prev) =>
          prev.map((s) => (s.id === bookingId ? updatedService : s))
        )
        return updatedService
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.detail || 'Erro ao iniciar serviço'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [petshopId]
  )

  const completeService = useCallback(
    async (bookingId: string, completeData: CompleteServiceRequest) => {
      try {
        setLoading(true)
        setError(null)
        const updatedService = await aestheticsService.completeService(
          bookingId,
          petshopId,
          completeData
        )
        setServices((prev) =>
          prev.map((s) => (s.id === bookingId ? updatedService : s))
        )
        return updatedService
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.detail || 'Erro ao completar serviço'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [petshopId]
  )

  const cancelBooking = useCallback(
    async (bookingId: string, reason?: string) => {
      try {
        setLoading(true)
        setError(null)
        const updatedService = await aestheticsService.cancelBooking(
          bookingId,
          petshopId,
          reason
        )
        setServices((prev) =>
          prev.map((s) => (s.id === bookingId ? updatedService : s))
        )
        return updatedService
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.detail || 'Erro ao cancelar agendamento'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [petshopId]
  )

  return {
    services,
    loading,
    error,
    fetchScheduledServices,
    fetchInProgressServices,
    fetchCompletedServices,
    createBooking,
    checkIn,
    startService,
    completeService,
    cancelBooking,
  }
}

export function useAestheticsStats(petshopId: number) {
  const [stats, setStats] = useState<AestheticStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(
    async (startDate?: string, endDate?: string) => {
      try {
        setLoading(true)
        setError(null)
        const data = await aestheticsService.getStats(
          petshopId,
          startDate,
          endDate
        )
        setStats(data)
        return data
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.detail || 'Erro ao buscar estatísticas'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [petshopId]
  )

  return {
    stats,
    loading,
    error,
    fetchStats,
  }
}
