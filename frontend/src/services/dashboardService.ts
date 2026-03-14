import { api } from '@/lib/api'
import type {
  DashboardStats,
  RevenueMetrics,
  ConversionMetrics,
  ClientFunnelMetrics,
  AppointmentTrends,
  DashboardPeriod,
} from '@/types'

export const dashboardService = {
  async getStats(params?: DashboardPeriod): Promise<DashboardStats> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<DashboardStats>('/dashboard/stats', {
      params,
    })
    return response.data
  },
  async getRevenue(params?: DashboardPeriod): Promise<RevenueMetrics> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<RevenueMetrics>('/dashboard/revenue', {
      params,
    })
    return response.data
  },
  async getConversion(params?: DashboardPeriod): Promise<ConversionMetrics> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<ConversionMetrics>(
      '/dashboard/conversion',
      { params }
    )
    return response.data
  },
  async getClientFunnel(params?: DashboardPeriod): Promise<ClientFunnelMetrics> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<ClientFunnelMetrics>(
      '/dashboard/client-funnel',
      { params }
    )
    return response.data
  },
  async getAppointmentTrends(
    params?: DashboardPeriod
  ): Promise<AppointmentTrends> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<AppointmentTrends>(
      '/dashboard/appointment-trends',
      { params }
    )
    return response.data
  },
  async getRevenueChart(params?: {
    period?: 'week' | 'month' | 'quarter' | 'year'
    group_by?: 'day' | 'week' | 'month'
  }): Promise<
    Array<{
      date: string
      revenue: number
      appointments: number
    }>
  > {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get('/dashboard/revenue-chart', { params })
    return response.data
  },
  async getCategoriesChart(params?: DashboardPeriod): Promise<
    Array<{
      category: string
      value: number
      percentage: number
    }>
  > {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get('/dashboard/categories-chart', {
      params,
    })
    return response.data
  },
  async getVisitsChart(params?: {
    period?: 'week' | 'month'
    group_by?: 'day' | 'hour'
  }): Promise<
    Array<{
      date: string
      visits: number
      new_clients: number
      returning_clients: number
    }>
  > {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get('/dashboard/visits-chart', { params })
    return response.data
  },
  async getSalesChart(params?: DashboardPeriod): Promise<
    Array<{
      service: string
      sales: number
      revenue: number
    }>
  > {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get('/dashboard/sales-chart', { params })
    return response.data
  },
}
