export type AestheticServiceType =
  | 'banho'
  | 'tosa'
  | 'banho_tosa'
  | 'hidratacao'
  | 'spa'
  | 'tosa_higienica'

export type CoatCondition = 'normal' | 'tangled' | 'very_tangled' | 'matted'
export type SkinCondition = 'healthy' | 'dry' | 'irritated' | 'wounds'
export type Behavior = 'calm' | 'anxious' | 'aggressive'

export interface AestheticBookingRequest {
  client_id: string
  pet_id: string
  scheduled_at: string
  service_type: AestheticServiceType
  additional_services?: string[]
  notes?: string
}

export interface CheckInRequest {
  coat_condition: CoatCondition
  skin_condition: SkinCondition
  behavior: Behavior
  parasites: boolean
  special_needs?: string
  notes?: string
}

export interface CompleteServiceRequest {
  post_notes?: string
  photos_after?: string[]
}

export interface PricingBreakdown {
  base_price: number
  size_multiplier: number
  coat_condition_fee: number
  behavior_fee: number
  additional_services_total: number
  discount: number
  total: number
}

export interface PreAssessment {
  coat_condition: CoatCondition
  skin_condition: SkinCondition
  behavior: Behavior
  parasites: boolean
  special_needs?: string
  notes?: string
}

export interface AestheticService {
  id: string
  petshop_id: number
  client_id: string
  pet_id: string
  check_in_at: string
  service_type: AestheticServiceType
  additional_services: string[]
  status: string
  base_price: number
  pricing_details?: PricingBreakdown
  pre_assessment?: PreAssessment
  post_notes?: string
  photos_before: string[]
  photos_after: string[]
  check_out_at?: string
  created_at: string
  updated_at: string
  notes?: string
}

export interface AestheticStats {
  today: {
    scheduled: number
    in_progress: number
    completed: number
    revenue: number
  }
  month: {
    total_services: number
    revenue: number
    average_price: number
  }
  top_services: Array<{
    service_type: AestheticServiceType
    count: number
    revenue: number
  }>
}

export interface PriceCalculationRequest {
  service_type: AestheticServiceType
  pet_size?: string
  coat_condition?: CoatCondition
  behavior?: Behavior
  additional_services?: string[]
}

export interface PriceCalculationResponse {
  breakdown: PricingBreakdown
  total: number
}
