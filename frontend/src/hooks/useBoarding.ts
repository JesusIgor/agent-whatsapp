import { useState, useCallback } from 'react'
import { boardingService } from '@/services'
import type {
  BoardingStay,
  BoardingCheckIn,
  BoardingCheckOut,
  DailyLog,
  DailyLogCreate,
  DailyLogUpdate,
} from '@/types'

export function useBoarding(petshopId: number) {
  const [stays, setStays] = useState<BoardingStay[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchActiveBoardings = useCallback(
    async (serviceType?: 'hotel' | 'creche') => {
      try {
        setLoading(true)
        setError(null)
        const data = await boardingService.getActiveBoardings(
          petshopId,
          serviceType
        )
        setStays(data)
        return data
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.detail || 'Erro ao buscar estadias'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [petshopId]
  )

  const checkIn = useCallback(
    async (checkInData: BoardingCheckIn) => {
      try {
        setLoading(true)
        setError(null)
        const newStay = await boardingService.checkIn(petshopId, checkInData)
        setStays((prev) => [newStay, ...prev])
        return newStay
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

  const checkOut = useCallback(
    async (stayId: string, checkOutData: BoardingCheckOut) => {
      try {
        setLoading(true)
        setError(null)
        const updatedStay = await boardingService.checkOut(
          stayId,
          petshopId,
          checkOutData
        )
        setStays((prev) =>
          prev.map((s) => (s.id === stayId ? updatedStay : s))
        )
        return updatedStay
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.detail || 'Erro ao fazer check-out'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [petshopId]
  )

  return {
    stays,
    loading,
    error,
    fetchActiveBoardings,
    checkIn,
    checkOut,
  }
}

export function useBoardingStay(stayId: string | null, petshopId: number) {
  const [stay, setStay] = useState<BoardingStay | null>(null)
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStay = useCallback(async () => {
    if (!stayId) return

    try {
      setLoading(true)
      setError(null)
      const data = await boardingService.getBoarding(stayId, petshopId)
      setStay(data)
      return data
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || 'Erro ao buscar estadia'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [stayId, petshopId])

  const fetchDailyLogs = useCallback(async () => {
    if (!stayId) return

    try {
      setLoading(true)
      setError(null)
      const data = await boardingService.getDailyLogs(stayId, petshopId)
      setDailyLogs(data)
      return data
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || 'Erro ao buscar registros diários'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [stayId, petshopId])

  const createDailyLog = useCallback(
    async (logData: DailyLogCreate) => {
      if (!stayId) return

      try {
        setLoading(true)
        setError(null)
        const newLog = await boardingService.createDailyLog(
          stayId,
          petshopId,
          logData
        )
        setDailyLogs((prev) => [newLog, ...prev])
        return newLog
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.detail || 'Erro ao criar registro diário'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [stayId, petshopId]
  )

  const updateDailyLog = useCallback(
    async (logId: string, logData: DailyLogUpdate) => {
      try {
        setLoading(true)
        setError(null)
        const updatedLog = await boardingService.updateDailyLog(
          logId,
          petshopId,
          logData
        )
        setDailyLogs((prev) =>
          prev.map((l) => (l.id === logId ? updatedLog : l))
        )
        return updatedLog
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.detail || 'Erro ao atualizar registro diário'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [petshopId]
  )

  return {
    stay,
    dailyLogs,
    loading,
    error,
    fetchStay,
    fetchDailyLogs,
    createDailyLog,
    updateDailyLog,
  }
}
