import { useState, useCallback } from 'react'
import { appointmentService } from '@/services'
import type {
  Appointment,
  AppointmentSchedule,
  AppointmentUpdate,
  RescheduleRequest,
  AISlotSuggestion,
} from '@/types'

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAppointments = useCallback(async (filters?: {
    status?: string
    phone?: string
    professional_id?: string
  }) => {
    try {
      setLoading(true)
      setError(null)
      const data = await appointmentService.listAppointments(filters)
      setAppointments(data)
      return data
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || 'Erro ao buscar agendamentos'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const scheduleAppointment = useCallback(
    async (schedule: AppointmentSchedule) => {
      try {
        setLoading(true)
        setError(null)
        const newAppointment = await appointmentService.scheduleAppointment(
          schedule
        )
        setAppointments((prev) => [newAppointment, ...prev])
        return newAppointment
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.detail || 'Erro ao agendar consulta'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const updateAppointment = useCallback(
    async (appointmentId: string, updates: AppointmentUpdate) => {
      try {
        setLoading(true)
        setError(null)
        const updatedAppointment =
          await appointmentService.updateAppointment(appointmentId, updates)
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === appointmentId ? updatedAppointment : a
          )
        )
        return updatedAppointment
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.detail || 'Erro ao atualizar agendamento'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const cancelAppointment = useCallback(async (appointmentId: string) => {
    try {
      setLoading(true)
      setError(null)
      await appointmentService.cancelAppointment(appointmentId)
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appointmentId ? { ...a, status: 'cancelled' } : a
        )
      )
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || 'Erro ao cancelar agendamento'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const rescheduleAppointment = useCallback(
    async (appointmentId: string, rescheduleData: RescheduleRequest) => {
      try {
        setLoading(true)
        setError(null)
        const updatedAppointment =
          await appointmentService.rescheduleAppointment(
            appointmentId,
            rescheduleData
          )
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === appointmentId ? updatedAppointment : a
          )
        )
        return updatedAppointment
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.detail || 'Erro ao reagendar consulta'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const getAISlotSuggestions = useCallback(
    async (params: {
      client_id: string
      service_ids: string[]
      preferred_date?: string
      preferred_time_range?: 'morning' | 'afternoon' | 'evening'
      petshop_id?: number
    }) => {
      try {
        setLoading(true)
        setError(null)
        const suggestions = await appointmentService.getAISlotSuggestions(
          params
        )
        return suggestions
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.detail ||
          'Erro ao buscar sugestões de horários'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    scheduleAppointment,
    updateAppointment,
    cancelAppointment,
    rescheduleAppointment,
    getAISlotSuggestions,
  }
}

export function useAppointment(appointmentId: string | null) {
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAppointment = useCallback(async () => {
    if (!appointmentId) return

    try {
      setLoading(true)
      setError(null)
      const data = await appointmentService.getAppointment(appointmentId)
      setAppointment(data)
      return data
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || 'Erro ao buscar agendamento'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [appointmentId])

  return {
    appointment,
    loading,
    error,
    fetchAppointment,
  }
}
