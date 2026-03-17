import { useEffect, useMemo, useState } from 'react'
import { appointmentService } from '@/services'
import { dateToISO } from '@/lib/masks'
import type { AvailableSlot } from '@/types'

function isValidIsoDate(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date)
}

export function useAvailableScheduleSlots(
  dateInput: string,
  enabled = true
) {
  const [slots, setSlots] = useState<AvailableSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dateIso = useMemo(() => {
    const parsed = dateToISO(dateInput)
    return isValidIsoDate(parsed) ? parsed : ''
  }, [dateInput])

  useEffect(() => {
    if (!enabled || !dateIso) {
      setSlots([])
      setLoading(false)
      setError(null)
      return
    }

    let cancelled = false

    const fetchSlots = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await appointmentService.getAvailableSlots({
          date: dateIso,
        })

        if (!cancelled) {
          setSlots(response.available_slots)
        }
      } catch (err: any) {
        if (!cancelled) {
          setSlots([])
          setError(
            err.response?.data?.error ||
              err.response?.data?.detail ||
              'Erro ao carregar horários disponíveis.'
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchSlots()

    return () => {
      cancelled = true
    }
  }, [dateIso, enabled])

  return {
    dateIso,
    slots,
    loading,
    error,
  }
}