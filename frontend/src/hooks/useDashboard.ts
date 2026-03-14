import { useState, useCallback } from 'react'
import { dashboardService } from '@/services'
import type {
  DashboardStats,
  RevenueMetrics,
  ConversionMetrics,
  ClientFunnelMetrics,
  AppointmentTrends,
  DashboardPeriod,
} from '@/types'

interface UseDashboardReturn {
  stats: DashboardStats | null
  revenue: RevenueMetrics | null
  conversion: ConversionMetrics | null
  funnel: ClientFunnelMetrics | null
  trends: AppointmentTrends | null
  loading: boolean
  error: string | null
  fetchStats: (params?: DashboardPeriod) => Promise<DashboardStats>
  fetchRevenue: (params?: DashboardPeriod) => Promise<RevenueMetrics>
  fetchConversion: (params?: DashboardPeriod) => Promise<ConversionMetrics>
  fetchFunnel: (params?: DashboardPeriod) => Promise<ClientFunnelMetrics>
  fetchTrends: (params?: DashboardPeriod) => Promise<AppointmentTrends>
  fetchAll: (params?: DashboardPeriod) => Promise<void>
}

export function useDashboard(): UseDashboardReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [revenue, setRevenue] = useState<RevenueMetrics | null>(null)
  const [conversion, setConversion] = useState<ConversionMetrics | null>(null)
  const [funnel, setFunnel] = useState<ClientFunnelMetrics | null>(null)
  const [trends, setTrends] = useState<AppointmentTrends | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async (params?: DashboardPeriod) => {
    try {
      setLoading(true)
      setError(null)
      const data = await dashboardService.getStats(params)
      setStats(data)
      return data
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao carregar estatísticas')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchRevenue = useCallback(async (params?: DashboardPeriod) => {
    try {
      setLoading(true)
      setError(null)
      const data = await dashboardService.getRevenue(params)
      setRevenue(data)
      return data
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao carregar receita')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchConversion = useCallback(async (params?: DashboardPeriod) => {
    try {
      setLoading(true)
      setError(null)
      const data = await dashboardService.getConversion(params)
      setConversion(data)
      return data
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao carregar conversão')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchFunnel = useCallback(async (params?: DashboardPeriod) => {
    try {
      setLoading(true)
      setError(null)
      const data = await dashboardService.getClientFunnel(params)
      setFunnel(data)
      return data
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao carregar funil')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchTrends = useCallback(async (params?: DashboardPeriod) => {
    try {
      setLoading(true)
      setError(null)
      const data = await dashboardService.getAppointmentTrends(params)
      setTrends(data)
      return data
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao carregar tendências')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAll = useCallback(
    async (params?: DashboardPeriod) => {
      try {
        setLoading(true)
        setError(null)
        await Promise.all([
          fetchStats(params),
          fetchRevenue(params),
          fetchConversion(params),
          fetchFunnel(params),
          fetchTrends(params),
        ])
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Erro ao carregar dashboard')
        throw err
      } finally {
        setLoading(false)
      }
    },
    [fetchStats, fetchRevenue, fetchConversion, fetchFunnel, fetchTrends]
  )

  return {
    stats,
    revenue,
    conversion,
    funnel,
    trends,
    loading,
    error,
    fetchStats,
    fetchRevenue,
    fetchConversion,
    fetchFunnel,
    fetchTrends,
    fetchAll,
  }
}
