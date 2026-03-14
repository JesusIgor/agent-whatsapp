export interface Service {
  id: string
  petshop_id: number
  professional_id?: string
  specialty: string
  service_type: string
  price: number
  duration_minutes: number
  description?: string
  applicable_species?: string[]
  applicable_sizes?: string[]
  is_active: boolean
  booking_enabled: boolean
  created_at: string
}

export interface ServiceCreate {
  petshop_id: number
  professional_id?: string
  specialty: string
  service_type: string
  price: number
  duration_minutes: number
  description?: string
  applicable_species?: string[]
  applicable_sizes?: string[]
  is_active?: boolean
}

export interface ServiceUpdate {
  specialty?: string
  service_type?: string
  price?: number
  duration_minutes?: number
  description?: string
  applicable_species?: string[]
  applicable_sizes?: string[]
  is_active?: boolean
  booking_enabled?: boolean
}

export interface ServiceFilters {
  petshop_id?: number
  specialty?: string
  service_type?: string
  professional_id?: string
  is_active?: boolean
  booking_enabled?: boolean
}
