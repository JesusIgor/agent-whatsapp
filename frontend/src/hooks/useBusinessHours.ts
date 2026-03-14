import { useState, useCallback } from 'react'

export interface DaySchedule {
  enabled: boolean
  start: string
  end: string
}

export interface BusinessHours {
  monday: DaySchedule
  tuesday: DaySchedule
  wednesday: DaySchedule
  thursday: DaySchedule
  friday: DaySchedule
  saturday: DaySchedule
  sunday: DaySchedule
}

export interface CustomCapacity {
  date: string
  capacity: number
}

export interface HourlyCapacity {
  day: keyof BusinessHours
  hour: string
  capacity: number
}

const DEFAULT_SCHEDULE: DaySchedule = {
  enabled: true,
  start: '09:00',
  end: '18:00',
}

const INITIAL_HOURS: BusinessHours = {
  monday: DEFAULT_SCHEDULE,
  tuesday: DEFAULT_SCHEDULE,
  wednesday: DEFAULT_SCHEDULE,
  thursday: DEFAULT_SCHEDULE,
  friday: DEFAULT_SCHEDULE,
  saturday: { enabled: false, start: '09:00', end: '18:00' },
  sunday: { enabled: false, start: '09:00', end: '18:00' },
}

export function useBusinessHours() {
  const [businessHours, setBusinessHours] = useState<BusinessHours>(INITIAL_HOURS)
  const [defaultCapacity, setDefaultCapacity] = useState(8)
  const [customCapacities, setCustomCapacities] = useState<CustomCapacity[]>([])
  const [hourlyCapacities, setHourlyCapacities] = useState<HourlyCapacity[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const updateDaySchedule = useCallback((day: keyof BusinessHours, schedule: Partial<DaySchedule>) => {
    setBusinessHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], ...schedule },
    }))
  }, [])

  const toggleDay = useCallback((day: keyof BusinessHours) => {
    setBusinessHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled },
    }))
  }, [])

  const updateDefaultCapacity = useCallback((capacity: number) => {
    setDefaultCapacity(capacity)
  }, [])

  const addCustomCapacity = useCallback((date: string, capacity: number) => {
    setCustomCapacities((prev) => {
      const existing = prev.find((c) => c.date === date)
      if (existing) {
        return prev.map((c) => (c.date === date ? { ...c, capacity } : c))
      }
      return [...prev, { date, capacity }]
    })
  }, [])

  const removeCustomCapacity = useCallback((date: string) => {
    setCustomCapacities((prev) => prev.filter((c) => c.date !== date))
  }, [])

  const addHourlyCapacity = useCallback((day: keyof BusinessHours, hour: string, capacity: number) => {
    setHourlyCapacities((prev) => {
      const existing = prev.find((h) => h.day === day && h.hour === hour)
      if (existing) {
        return prev.map((h) => (h.day === day && h.hour === hour ? { ...h, capacity } : h))
      }
      return [...prev, { day, hour, capacity }]
    })
  }, [])

  const removeHourlyCapacity = useCallback((day: keyof BusinessHours, hour: string) => {
    setHourlyCapacities((prev) => prev.filter((h) => !(h.day === day && h.hour === hour)))
  }, [])

  const saveBusinessHours = useCallback(async () => {
    setSaving(true)
    try {
      // TODO: Implementar chamada à API
      // await businessHoursService.update(petshopId, {
      //   business_hours: businessHours,
      //   default_capacity: defaultCapacity,
      //   custom_capacities: customCapacities,
      //   hourly_capacities: hourlyCapacities,
      // })

      // Simulação de salvamento
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return { success: true }
    } catch (error) {
      console.error('Erro ao salvar horários:', error)
      return { success: false, error }
    } finally {
      setSaving(false)
    }
  }, [businessHours, defaultCapacity, customCapacities, hourlyCapacities])

  const loadBusinessHours = useCallback(async (petshopId: number) => {
    setLoading(true)
    try {
      // TODO: Implementar chamada à API
      // const data = await businessHoursService.get(petshopId)
      // setBusinessHours(data.business_hours)
      // setDefaultCapacity(data.default_capacity)
      // setCustomCapacities(data.custom_capacities)

      // Simulação de carregamento
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (error) {
      console.error('Erro ao carregar horários:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    businessHours,
    defaultCapacity,
    customCapacities,
    hourlyCapacities,
    loading,
    saving,
    updateDaySchedule,
    toggleDay,
    updateDefaultCapacity,
    addCustomCapacity,
    removeCustomCapacity,
    addHourlyCapacity,
    removeHourlyCapacity,
    saveBusinessHours,
    loadBusinessHours,
  }
}
