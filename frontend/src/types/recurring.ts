

export type RecurrenceFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly'

export type RecurrenceDay = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU'

export interface RecurringAppointment {
  id: string
  client_id: string
  service_ids: string[]
  recurrence_rule: string
  start_date: string
  end_date?: string
  occurrence_count?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface RecurringAppointmentCreate {
  client_id: string
  service_ids: string[]
  recurrence_rule: string
  start_date: string
  end_date?: string
  occurrence_count?: number
}

export interface RecurringAppointmentUpdate {
  recurrence_rule?: string
  start_date?: string
  end_date?: string
  occurrence_count?: number
  update_future_only?: boolean
}

export interface RecurrenceConfig {
  frequency: RecurrenceFrequency
  days?: RecurrenceDay[]
  interval?: number
  count?: number
  until?: string
}

export interface AppointmentInstance {
  id: string
  parent_id: string
  scheduled_at: string
  status: string
  client_name?: string
  service_name?: string
}

export interface AppointmentInstancesResponse {
  parent_id: string
  total_count: number
  instances: AppointmentInstance[]
  page: number
  page_size: number
}

export function buildRRule(config: RecurrenceConfig): string {
  const parts: string[] = []

  const freqMap: Record<RecurrenceFrequency, string> = {
    daily: 'DAILY',
    weekly: 'WEEKLY',
    biweekly: 'WEEKLY',
    monthly: 'MONTHLY',
  }
  parts.push(`FREQ=${freqMap[config.frequency]}`)

  if (config.frequency === 'biweekly') {
    parts.push('INTERVAL=2')
  } else if (config.interval && config.interval > 1) {
    parts.push(`INTERVAL=${config.interval}`)
  }

  if (config.days && config.days.length > 0) {
    parts.push(`BYDAY=${config.days.join(',')}`)
  }

  if (config.count) {
    parts.push(`COUNT=${config.count}`)
  } else if (config.until) {
    parts.push(`UNTIL=${config.until.replace(/[-:]/g, '').split('T')[0]}`)
  }

  return parts.join(';')
}

export function parseRRule(rrule: string): Partial<RecurrenceConfig> {
  const config: Partial<RecurrenceConfig> = {}
  const parts = rrule.split(';')

  for (const part of parts) {
    const [key, value] = part.split('=')

    switch (key) {
      case 'FREQ':
        if (value === 'DAILY') config.frequency = 'daily'
        else if (value === 'WEEKLY') config.frequency = 'weekly'
        else if (value === 'MONTHLY') config.frequency = 'monthly'
        break
      case 'INTERVAL':
        config.interval = parseInt(value, 10)
        if (config.frequency === 'weekly' && config.interval === 2) {
          config.frequency = 'biweekly'
        }
        break
      case 'BYDAY':
        config.days = value.split(',') as RecurrenceDay[]
        break
      case 'COUNT':
        config.count = parseInt(value, 10)
        break
      case 'UNTIL':
        config.until = value
        break
    }
  }

  return config
}
