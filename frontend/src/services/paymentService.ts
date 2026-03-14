import { api } from '@/lib/api'
import type {
  PaymentDetails,
  PaymentStats,
  PaymentListResponse,
  PaymentPreference,
  PaymentPreferenceData,
  ManualPaymentCreate,
  PaymentFilters,
} from '@/types/payment'

export const paymentService = {

  async list(filters?: PaymentFilters): Promise<PaymentListResponse> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.payment_method) params.append('payment_method', filters.payment_method)
    if (filters?.date_from) params.append('date_from', filters.date_from)
    if (filters?.date_to) params.append('date_to', filters.date_to)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.page_size) params.append('page_size', filters.page_size.toString())

    const response = await api.get<PaymentListResponse>(`/payments?${params}`)
    return response.data
  },

  async getById(id: string): Promise<PaymentDetails> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<PaymentDetails>(`/payments/${id}`)
    return response.data
  },

  async getStats(): Promise<PaymentStats> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<PaymentStats>('/payments/stats')
    return response.data
  },

  async getStatusByAppointment(appointmentId: string): Promise<PaymentDetails> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<PaymentDetails>(`/payments/status/${appointmentId}`)
    return response.data
  },

  async createPreference(data: PaymentPreferenceData): Promise<PaymentPreference> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.post<PaymentPreference>('/payments/preference', data)
    return response.data
  },

  async createManual(data: ManualPaymentCreate): Promise<PaymentDetails> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.post<PaymentDetails>('/payments/manual', data)
    return response.data
  },

  async refund(paymentId: string, reason?: string): Promise<PaymentDetails> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.post<PaymentDetails>(`/payments/${paymentId}/refund`, { reason })
    return response.data
  },

  async updateStatus(paymentId: string, status: string): Promise<PaymentDetails> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.patch<PaymentDetails>(`/payments/${paymentId}`, { status })
    return response.data
  },
}
