import { api } from '@/lib/api'
import type {
  AnalyticsDashboard,
  AnalyticsOverview,
  AnalyticsFilter,
  RevenueByPeriod,
  RevenueByService,
  ClientAnalytics,
  AppointmentAnalytics,
  ConversationAnalytics,
  ExportRequest,
  ExportResponse,
} from '@/types/analytics'

export const analyticsService = {

  async getDashboard(filter?: AnalyticsFilter): Promise<AnalyticsDashboard> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<AnalyticsDashboard>('/analytics/dashboard', {
      params: filter,
    })
    return response.data
  },

  async getOverview(filter?: AnalyticsFilter): Promise<AnalyticsOverview> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<AnalyticsOverview>('/analytics/overview', {
      params: filter,
    })
    return response.data
  },

  async getRevenueTrend(filter?: AnalyticsFilter): Promise<RevenueByPeriod[]> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<RevenueByPeriod[]>('/analytics/revenue/trend', {
      params: filter,
    })
    return response.data
  },

  async getRevenueByService(filter?: AnalyticsFilter): Promise<RevenueByService[]> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<RevenueByService[]>('/analytics/revenue/by-service', {
      params: filter,
    })
    return response.data
  },

  async getClientAnalytics(filter?: AnalyticsFilter): Promise<ClientAnalytics> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<ClientAnalytics>('/analytics/clients', {
      params: filter,
    })
    return response.data
  },

  async getAppointmentAnalytics(filter?: AnalyticsFilter): Promise<AppointmentAnalytics> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<AppointmentAnalytics>('/analytics/appointments', {
      params: filter,
    })
    return response.data
  },

  async getConversationAnalytics(filter?: AnalyticsFilter): Promise<ConversationAnalytics> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<ConversationAnalytics>('/analytics/conversations', {
      params: filter,
    })
    return response.data
  },

  async exportReport(request: ExportRequest): Promise<ExportResponse> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.post<ExportResponse>('/analytics/export', request)
    return response.data
  },

  async getComparison(
    currentPeriod: AnalyticsFilter,
    previousPeriod: AnalyticsFilter
  ): Promise<{
    current: AnalyticsOverview
    previous: AnalyticsOverview
    changes: Record<string, number>
  }> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.post('/analytics/comparison', {
      current: currentPeriod,
      previous: previousPeriod,
    })
    return response.data
  },

  async getRealtime(): Promise<{
    active_sessions: number
    messages_last_hour: number
    appointments_today: number
    revenue_today: number
  }> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get('/analytics/realtime')
    return response.data
  },
}
