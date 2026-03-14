export interface DashboardStats {
  total_clients: number
  new_clients_today: number
  new_clients_week: number
  total_appointments: number
  appointments_today: number
  appointments_week: number
  total_revenue: number
  revenue_today: number
  revenue_week: number
  revenue_month: number
  conversion_rate: number
  average_ticket: number
}

export interface RevenueMetrics {
  period: string
  total_revenue: number
  by_service: Array<{
    service_type: string
    revenue: number
    count: number
  }>
  by_professional: Array<{
    professional_name: string
    revenue: number
    appointments: number
  }>
  daily_breakdown: Array<{
    date: string
    revenue: number
  }>
}

export interface ConversionMetrics {
  total_leads: number
  converted_leads: number
  conversion_rate: number
  by_stage: Array<{
    stage: string
    count: number
    percentage: number
  }>
  by_source: Array<{
    source: string
    leads: number
    conversions: number
    rate: number
  }>
}

export interface ClientFunnelMetrics {
  stages: Array<{
    stage: string
    count: number
    percentage: number
    change_from_previous: number
  }>
  total_in_funnel: number
  average_time_to_conversion: number
}

export interface AppointmentTrends {
  period: string
  trends: Array<{
    date: string
    scheduled: number
    confirmed: number
    completed: number
    cancelled: number
    no_show: number
  }>
  by_service: Array<{
    service_type: string
    count: number
    trend: 'up' | 'down' | 'stable'
    change_percentage: number
  }>
  peak_hours: Array<{
    hour: string
    appointments: number
  }>
  busiest_days: Array<{
    day: string
    appointments: number
  }>
}

export interface DashboardPeriod {
  start_date?: string
  end_date?: string
  period?: 'today' | 'week' | 'month' | 'quarter' | 'year'
}
