export interface ChatBusinessDashboardStats {
  appointments_today: number
  appointments_week: number
  active_clients: number
  messages_today: number
  conversion_rate: number
}

export interface ChatBusinessPaymentStats {
  [key: string]: unknown
}

export interface ChatBusinessContext {
  dashboard_stats: ChatBusinessDashboardStats
  payment_stats: ChatBusinessPaymentStats
}

export interface ChatBusinessHistoryMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatBusinessRequest {
  message: string
  context: ChatBusinessContext
  history: ChatBusinessHistoryMessage[]
}

export interface ChatBusinessQuickAction {
  label: string
  action: string
}

export interface ChatBusinessDataCard {
  title: string
  value: string | number
  description?: string
}

export interface ChatBusinessResponse {
  response: string
  timestamp: string
  quick_actions: ChatBusinessQuickAction[] | null
  suggestions: string[] | null
  data_cards: ChatBusinessDataCard[] | null
  pending_confirmation: unknown | null
}
