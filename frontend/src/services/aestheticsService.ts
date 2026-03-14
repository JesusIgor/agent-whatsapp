import { api } from '@/lib/api'
import type {
  AestheticService,
  AestheticBookingRequest,
  CheckInRequest,
  CompleteServiceRequest,
  AestheticStats,
  PriceCalculationRequest,
  PriceCalculationResponse,
} from '@/types'

export const aestheticsService = {

  async createBooking(
    petshopId: number,
    bookingData: AestheticBookingRequest
  ): Promise<AestheticService> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.post<AestheticService>(
      '/aesthetics/book',
      bookingData,
      {
        params: { petshop_id: petshopId },
      }
    )
    return response.data
  },

  async getScheduledServices(
    petshopId: number,
    targetDate?: string
  ): Promise<AestheticService[]> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<AestheticService[]>(
      '/aesthetics/scheduled',
      {
        params: {
          petshop_id: petshopId,
          ...(targetDate && { target_date: targetDate }),
        },
      }
    )
    return response.data
  },

  async getInProgressServices(
    petshopId: number
  ): Promise<AestheticService[]> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<AestheticService[]>(
      '/aesthetics/in-progress',
      {
        params: { petshop_id: petshopId },
      }
    )
    return response.data
  },

  async getCompletedServices(
    petshopId: number,
    startDate?: string,
    endDate?: string
  ): Promise<AestheticService[]> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<AestheticService[]>(
      '/aesthetics/completed',
      {
        params: {
          petshop_id: petshopId,
          ...(startDate && { start_date: startDate }),
          ...(endDate && { end_date: endDate }),
        },
      }
    )
    return response.data
  },

  async checkIn(
    bookingId: string,
    petshopId: number,
    checkInData: CheckInRequest
  ): Promise<AestheticService> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.put<AestheticService>(
      `/aesthetics/${bookingId}/check-in`,
      checkInData,
      {
        params: { petshop_id: petshopId },
      }
    )
    return response.data
  },

  async startService(
    bookingId: string,
    petshopId: number
  ): Promise<AestheticService> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.put<AestheticService>(
      `/aesthetics/${bookingId}/start`,
      {},
      {
        params: { petshop_id: petshopId },
      }
    )
    return response.data
  },

  async completeService(
    bookingId: string,
    petshopId: number,
    completeData: CompleteServiceRequest
  ): Promise<AestheticService> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.put<AestheticService>(
      `/aesthetics/${bookingId}/complete`,
      completeData,
      {
        params: { petshop_id: petshopId },
      }
    )
    return response.data
  },

  async cancelBooking(
    bookingId: string,
    petshopId: number,
    reason?: string
  ): Promise<AestheticService> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.put<AestheticService>(
      `/aesthetics/${bookingId}/cancel`,
      { reason },
      {
        params: { petshop_id: petshopId },
      }
    )
    return response.data
  },

  async getStats(
    petshopId: number,
    startDate?: string,
    endDate?: string
  ): Promise<AestheticStats> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<AestheticStats>('/aesthetics/stats', {
      params: {
        petshop_id: petshopId,
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate }),
      },
    })
    return response.data
  },

  async calculatePrice(
    priceData: PriceCalculationRequest
  ): Promise<PriceCalculationResponse> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.post<PriceCalculationResponse>(
      '/aesthetics/calculate-price',
      priceData
    )
    return response.data
  },
}
