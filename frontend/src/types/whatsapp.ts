export type WhatsAppConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'qr_ready' | 'error'

export interface WhatsAppStatus {
  status: WhatsAppConnectionStatus
  phone?: string
  qr_code?: string
  pairing_code?: string
  last_connected?: string
  error_message?: string
}

export interface WhatsAppQRCode {
  qr: string
  expires_at: string
}

export interface WhatsAppPairingCode {
  code: string
  expires_at: string
}

export interface WhatsAppWebhookMessage {
  id: string
  from: string
  to: string
  timestamp: string
  type: 'text' | 'image' | 'audio' | 'video' | 'document' | 'sticker' | 'reaction'
  content: WhatsAppMessageContent
  quoted_message?: WhatsAppQuotedMessage
  is_group: boolean
  group_id?: string
}

export interface WhatsAppMessageContent {
  text?: string
  caption?: string
  media_url?: string
  media_type?: string
  filename?: string
  emoji?: string
}

export interface WhatsAppQuotedMessage {
  id: string
  from: string
  content: string
}

export interface WhatsAppSendMessageRequest {
  to: string
  message: string
  media_url?: string
  media_type?: 'image' | 'audio' | 'video' | 'document'
}

export interface WhatsAppSendMessageResponse {
  success: boolean
  message_id?: string
  error?: string
}

export interface WhatsAppReaction {
  message_id: string
  emoji: string
  from: string
  timestamp: string
}

export interface WhatsAppPresence {
  jid: string
  presence: 'available' | 'composing' | 'recording' | 'paused' | 'unavailable'
}

export interface WhatsAppHealthCheck {
  status: 'healthy' | 'unhealthy'
  connection: WhatsAppConnectionStatus
  uptime: number
  last_message_at?: string
}
