

export type AnalyticsPeriod = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom'

export type MetricType = 'revenue' | 'appointments' | 'clients' | 'messages' | 'conversion'

export interface AnalyticsOverview {
  period: AnalyticsPeriod
  start_date: string
  end_date: string
  metrics: {
    total_revenue: number
    revenue_change: number
    total_appointments: number
    appointments_change: number
    new_clients: number
    new_clients_change: number
    messages_sent: number
    messages_change: number
    conversion_rate: number
    conversion_change: number
    average_ticket: number
    ticket_change: number
  }
}

export interface RevenueByPeriod {
  period: string
  revenue: number
  appointments: number
  average_ticket: number
}

export interface RevenueByService {
  service_id: string
  service_name: string
  revenue: number
  count: number
  percentage: number
}

export interface RevenueByPaymentMethod {
  method: string
  revenue: number
  count: number
  percentage: number
}

export interface ClientAnalytics {
  total_clients: number
  active_clients: number
  new_clients_period: number
  returning_clients: number
  churn_rate: number
  average_visits: number
  top_clients: {
    client_id: string
    client_name: string
    total_spent: number
    visits: number
  }[]
}

export interface AppointmentAnalytics {
  total_appointments: number
  completed: number
  cancelled: number
  no_show: number
  completion_rate: number
  cancellation_rate: number
  peak_hours: {
    hour: number
    count: number
  }[]
  peak_days: {
    day: string
    count: number
  }[]
}

export interface ConversationAnalytics {
  total_messages: number
  ai_responses: number
  human_interventions: number
  average_response_time: number
  resolution_rate: number
  satisfaction_score: number
  top_topics: {
    topic: string
    count: number
    percentage: number
  }[]
}

export interface AnalyticsDashboard {
  overview: AnalyticsOverview
  revenue_trend: RevenueByPeriod[]
  revenue_by_service: RevenueByService[]
  revenue_by_payment: RevenueByPaymentMethod[]
  client_analytics: ClientAnalytics
  appointment_analytics: AppointmentAnalytics
  conversation_analytics: ConversationAnalytics
}

export interface AnalyticsFilter {
  period: AnalyticsPeriod
  start_date?: string
  end_date?: string
  service_ids?: string[]
  professional_ids?: string[]
}

export interface ExportRequest {
  type: 'pdf' | 'excel' | 'csv'
  period: AnalyticsPeriod
  start_date?: string
  end_date?: string
  sections: ('overview' | 'revenue' | 'clients' | 'appointments' | 'conversations')[]
}

export interface ExportResponse {
  download_url: string
  expires_at: string
  file_name: string
}
