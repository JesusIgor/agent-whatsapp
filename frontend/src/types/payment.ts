

export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'refunded' | 'in_process'

export type PaymentMethod = 'pix' | 'credit_card' | 'debit_card' | 'cash' | 'bank_transfer' | 'check'

export interface PaymentDetails {
  id: string
  appointment_id?: string

  amount: number
  currency: string
  status: PaymentStatus
  status_detail?: string
  payment_method?: PaymentMethod
  payment_type?: string

  preference_id?: string
  payment_id?: string

  payer_email?: string
  payer_name?: string

  client_name?: string
  professional_name?: string
  specialty?: string
  scheduled_at?: string

  pet_name?: string

  created_at: string
  updated_at: string
  approved_at?: string
  rejected_at?: string
}

export interface PaymentStats {
  total_revenue: number
  total_pending: number
  total_rejected: number
  average_ticket: number
  total_payments: number
  approved_count: number
  pending_count: number
  rejected_count: number
  payment_methods: Record<string, number>
  monthly_revenue?: Record<string, number>
}

export interface PaymentListResponse {
  payments: PaymentDetails[]
  total: number
  page: number
  page_size: number
}

export interface PaymentPreference {
  preference_id: string
  init_point: string
  sandbox_init_point: string
}

export interface PaymentPreferenceData {
  appointment_id: string
  amount: number
  description: string
  payer_email: string
}

export interface ManualPaymentCreate {
  client_name: string
  client_email: string
  client_phone?: string
  amount: number
  description: string
  payment_method: PaymentMethod
  status: PaymentStatus
  notes?: string
}

export interface PaymentFilters {
  status?: PaymentStatus
  payment_method?: PaymentMethod
  date_from?: string
  date_to?: string
  page?: number
  page_size?: number
}
