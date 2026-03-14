import { api } from '@/lib/api'
import type {
  Professional,
  ProfessionalCreate,
  ProfessionalUpdate,
  ProfessionalAvailability,
} from '@/types'

export const professionalService = {
  async listProfessionals(params?: {
    petshop_id?: number
    specialty?: string
    is_active?: boolean
  }): Promise<Professional[]> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<Professional[]>('/professionals', {
      params,
    })
    return response.data
  },
  async getProfessional(professionalId: string): Promise<Professional> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<Professional>(
      `/professionals/${professionalId}`
    )
    return response.data
  },
  async createProfessional(
    professionalData: ProfessionalCreate
  ): Promise<Professional> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.post<Professional>(
      '/professionals',
      professionalData
    )
    return response.data
  },
  async updateProfessional(
    professionalId: string,
    updates: ProfessionalUpdate
  ): Promise<Professional> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.put<Professional>(
      `/professionals/${professionalId}`,
      updates
    )
    return response.data
  },
  async deleteProfessional(professionalId: string): Promise<void> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    await api.delete(`/professionals/${professionalId}`)
  },
  async getAvailability(
    professionalId: string,
    params?: {
      start_date?: string
      end_date?: string
      days_ahead?: number
    }
  ): Promise<ProfessionalAvailability> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<ProfessionalAvailability>(
      `/professionals/${professionalId}/availability`,
      { params }
    )
    return response.data
  },
}
