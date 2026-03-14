export interface Professional {
  id: string
  petshop_id: number
  name: string
  email?: string
  phone?: string
  specialty: string
  price?: number
  duration_minutes?: number
  description?: string
  days_available?: Record<string, boolean>
  hours_available?: {
    start: string
    end: string
  }
  requires_secretary?: boolean
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface ProfessionalCreate {
  petshop_id: number
  name: string
  email?: string
  phone?: string
  specialty: string
  price?: number
  duration_minutes?: number
  description?: string
  days_available?: Record<string, boolean>
  hours_available?: {
    start: string
    end: string
  }
  requires_secretary?: boolean
}

export interface ProfessionalUpdate {
  name?: string
  email?: string
  phone?: string
  specialty?: string
  price?: number
  duration_minutes?: number
  description?: string
  days_available?: Record<string, boolean>
  hours_available?: {
    start: string
    end: string
  }
  requires_secretary?: boolean
  is_active?: boolean
}

export interface ProfessionalAvailability {
  professional_id: string
  professional_name: string
  specialty: string
  available_slots: Array<{
    date: string
    slots: string[]
  }>
}
