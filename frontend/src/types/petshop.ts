export interface PetshopCreate {
  name: string
  address: string
  cep: string
  phone: string
  latitude?: number
  longitude?: number
  owner_phone: string
  emergency_contact: string
  blocked_numbers?: string
  assistant_name?: string
  features?: string[]
  is_active?: boolean
}

export interface Petshop {
  id: number
  name: string
  address: string
  cep: string
  phone: string
  latitude: number
  longitude: number
  owner_phone: string
  emergency_contact: string
  blocked_numbers: string
  assistant_name: string
  features: string[]
  is_active: boolean
  hotel_capacity?: number
  hotel_daily_rate?: number
  creche_daily_rate?: number
  created_at: string
  updated_at: string
}

export interface PetshopUpdate {
  name?: string
  address?: string
  cep?: string
  phone?: string
  owner_phone?: string
  emergency_contact?: string
  blocked_numbers?: string
  assistant_name?: string
  features?: string[]
  is_active?: boolean
  hotel_capacity?: number
  hotel_daily_rate?: number
  creche_daily_rate?: number
}
