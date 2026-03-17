/**
 * Petshop types and interfaces
 */

export interface PetshopCustomCapacityHours {
  hourly?: {
    [weekday: string]: {
      [hour: string]: number
    }
  }
}

export interface CreatePetshopDTO {
  company_id: number
  address?: string
  cep?: string
  phone: string
  latitude?: number
  longitude?: number
  owner_phone?: string
  emergency_contact?: string
  assistant_name?: string
  default_capacity_per_hour?: number
  business_hours?: {
    [key: string]: {
      open?: string
      close?: string
      closed?: boolean
    }
  }
  custom_capacity_hours?: PetshopCustomCapacityHours
}

export interface UpdatePetshopDTO {
  address?: string
  cep?: string
  phone?: string
  latitude?: number
  longitude?: number
  owner_phone?: string
  emergency_contact?: string
  assistant_name?: string
  default_capacity_per_hour?: number
  business_hours?: {
    [key: string]: {
      open?: string
      close?: string
      closed?: boolean
    }
  }
  custom_capacity_hours?: PetshopCustomCapacityHours
  is_active?: boolean
}

export interface PetshopListQuery {
  skip?: number
  limit?: number
  is_active?: string
}
