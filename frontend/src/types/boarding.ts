export interface BoardingCheckIn {
  client_id: string
  pet_id: string
  service_type: 'hotel' | 'creche'
  notes?: string
}

export interface BoardingCheckOut {
  additional_charges?: Record<string, number>
}

export interface BoardingStay {
  id: string
  petshop_id: number
  client_id: string
  pet_id: string
  service_type: string
  check_in_at: string
  check_out_at?: string
  num_days?: number
  base_price: number
  additional_charges: Record<string, number>
  total_price?: number
  status: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface DailyLog {
  id: string
  petshop_id: number
  stay_id: string
  log_date: string
  staff_name: string
  activities?: string
  meals: Array<{
    hora: string
    tipo: string
    comeu: boolean
  }>
  medications: Array<{
    hora: string
    medicamento: string
    dose: string
  }>
  health_observations?: string
  photos_urls: string[]
  created_at: string
  updated_at: string
}

export interface DailyLogCreate {
  log_date: string
  staff_name: string
  activities?: string
  meals?: Array<Record<string, any>>
  medications?: Array<Record<string, any>>
  health_observations?: string
  photos_urls?: string[]
}

export interface DailyLogUpdate {
  staff_name?: string
  activities?: string
  meals?: Array<Record<string, any>>
  medications?: Array<Record<string, any>>
  health_observations?: string
  photos_urls?: string[]
}

export interface BoardingStats {
  total_active: number
  total_hotel: number
  total_creche: number
  total_revenue_month: number
  average_stay_duration: number
}
