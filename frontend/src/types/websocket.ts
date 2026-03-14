export type WebSocketConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error'

export interface WebSocketMessage<T = unknown> {
  type: WebSocketMessageType
  timestamp: string
  data?: T
}

export type WebSocketMessageType =
  | 'connection'
  | 'ping'
  | 'pong'
  | 'subscribe'
  | 'unsubscribe'
  | 'status'
  | 'new_conversation'
  | 'new_message'
  | 'new_appointment'
  | 'appointment_updated'
  | 'new_learning_case'
  | 'handoff_requested'
  | 'system_notification'
  | 'error'

export interface NewConversationEvent {
  conversation_id: string
  client_id: string
  client_name: string
  client_phone: string
  last_message: string
  created_at: string
}

export interface NewMessageEvent {
  conversation_id: string
  message_id: string
  content: string
  sender: 'client' | 'ai' | 'human'
  timestamp: string
  client_name?: string
}

export interface NewAppointmentEvent {
  appointment_id: string
  client_id: string
  client_name: string
  pet_name: string
  service_type: string
  scheduled_date: string
  scheduled_time: string
  status: string
}

export interface AppointmentUpdatedEvent {
  appointment_id: string
  status: string
  previous_status?: string
  updated_at: string
}

export interface HandoffRequestedEvent {
  conversation_id: string
  client_id: string
  client_name: string
  reason: string
  priority: 'low' | 'medium' | 'high'
  timestamp: string
}

export interface SystemNotificationEvent {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  timestamp: string
}

export interface WebSocketStatus {
  connections: number
  users: number
  uptime: number
}
