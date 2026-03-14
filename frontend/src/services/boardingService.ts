import { api } from '@/lib/api'
import type {
  BoardingStay,
  BoardingCheckIn,
  BoardingCheckOut,
  DailyLog,
  DailyLogCreate,
  DailyLogUpdate,
  BoardingStats,
} from '@/types'

export const boardingService = {

  async checkIn(
    petshopId: number,
    checkInData: BoardingCheckIn
  ): Promise<BoardingStay> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.post<BoardingStay>(
      '/boarding/check-in',
      checkInData,
      {
        params: { petshop_id: petshopId },
      }
    )
    return response.data
  },

  async checkOut(
    stayId: string,
    petshopId: number,
    checkOutData: BoardingCheckOut
  ): Promise<BoardingStay> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.put<BoardingStay>(
      `/boarding/${stayId}/check-out`,
      checkOutData,
      {
        params: { petshop_id: petshopId },
      }
    )
    return response.data
  },

  async getActiveBoardings(
    petshopId: number,
    serviceType?: 'hotel' | 'creche'
  ): Promise<BoardingStay[]> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<BoardingStay[]>(
      '/boarding/active',
      {
        params: {
          petshop_id: petshopId,
          ...(serviceType && { service_type: serviceType }),
        },
      }
    )
    return response.data
  },

  async getBoarding(
    stayId: string,
    petshopId: number
  ): Promise<BoardingStay> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<BoardingStay>(
      `/boarding/${stayId}`,
      {
        params: { petshop_id: petshopId },
      }
    )
    return response.data
  },

  async getBoardingsByDateRange(
    petshopId: number,
    startDate: string,
    endDate: string,
    serviceType?: 'hotel' | 'creche'
  ): Promise<BoardingStay[]> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<BoardingStay[]>('/boarding/', {
      params: {
        petshop_id: petshopId,
        start_date: startDate,
        end_date: endDate,
        ...(serviceType && { service_type: serviceType }),
      },
    })
    return response.data
  },

  async createDailyLog(
    stayId: string,
    petshopId: number,
    logData: DailyLogCreate
  ): Promise<DailyLog> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.post<DailyLog>(
      `/boarding/${stayId}/daily-logs`,
      logData,
      {
        params: { petshop_id: petshopId },
      }
    )
    return response.data
  },

  async getDailyLogs(
    stayId: string,
    petshopId: number
  ): Promise<DailyLog[]> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<DailyLog[]>(
      `/boarding/${stayId}/daily-logs`,
      {
        params: { petshop_id: petshopId },
      }
    )
    return response.data
  },

  async updateDailyLog(
    logId: string,
    petshopId: number,
    logData: DailyLogUpdate
  ): Promise<DailyLog> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.put<DailyLog>(
      `/boarding/daily-logs/${logId}`,
      logData,
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
  ): Promise<BoardingStats> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<BoardingStats>('/boarding/stats', {
      params: {
        petshop_id: petshopId,
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate }),
      },
    })
    return response.data
  },
}
