export interface Room {
  id: string
  petshop_id: number
  name: string
  room_type: 'hotel' | 'creche' | 'training'
  capacity: number
  features?: Record<string, boolean>
  price_per_day: number
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface RoomCreate {
  petshop_id: number
  name: string
  room_type: 'hotel' | 'creche' | 'training'
  capacity: number
  features?: Record<string, boolean>
  price_per_day: number
}

export interface RoomUpdate {
  name?: string
  room_type?: 'hotel' | 'creche' | 'training'
  capacity?: number
  features?: Record<string, boolean>
  price_per_day?: number
  is_active?: boolean
}

export interface RoomAvailability {
  room_id: string
  room_name: string
  room_type: string
  capacity: number
  current_occupancy: number
  available_spots: number
  is_available: boolean
  next_available_date?: string
}
