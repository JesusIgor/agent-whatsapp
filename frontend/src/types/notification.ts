

export type NotificationType = 'message' | 'payment' | 'appointment' | 'system' | 'alert'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: string
  read: boolean
  conversationId?: string
  appointmentId?: string
  paymentId?: string
  data?: Record<string, unknown>
}

export interface NotificationPreferences {
  push_enabled: boolean
  email_enabled: boolean
  sms_enabled: boolean
  sound_enabled: boolean
  types: {
    message: boolean
    payment: boolean
    appointment: boolean
    system: boolean
  }
}

export interface NotificationStats {
  total: number
  unread: number
  today: number
}
