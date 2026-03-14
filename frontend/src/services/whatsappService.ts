import { api } from '@/lib/api'
import type {
  WhatsAppStatus,
  WhatsAppQRCode,
  WhatsAppPairingCode,
  WhatsAppSendMessageRequest,
  WhatsAppSendMessageResponse,
  WhatsAppHealthCheck,
} from '@/types'

export const whatsappService = {
  async getStatus(): Promise<WhatsAppStatus> {
    const response = await api.get<WhatsAppStatus>('/whatsapp/status')
    return response.data
  },

  async getQRCode(): Promise<WhatsAppQRCode> {
    const response = await api.get<WhatsAppQRCode>('/whatsapp/qr')
    return response.data
  },

  async getPairingCode(phoneNumber: string): Promise<WhatsAppPairingCode> {
    const response = await api.post<WhatsAppPairingCode>('/whatsapp/pairing-code', {
      phone_number: phoneNumber,
    })
    return response.data
  },

  async connectWithCode(code: string): Promise<{ success: boolean }> {
    const response = await api.post('/whatsapp/connect-with-code', { code })
    return response.data
  },

  async sendMessage(data: WhatsAppSendMessageRequest): Promise<WhatsAppSendMessageResponse> {
    const response = await api.post<WhatsAppSendMessageResponse>(
      '/whatsapp/send-message',
      data
    )
    return response.data
  },

  async setPresence(
    presence: 'available' | 'composing' | 'recording' | 'paused'
  ): Promise<{ success: boolean }> {
    const response = await api.post('/whatsapp/set-presence', { presence })
    return response.data
  },

  async logout(): Promise<{ success: boolean }> {
    const response = await api.post('/whatsapp/logout')
    return response.data
  },

  async reconnect(): Promise<{ success: boolean }> {
    const response = await api.post('/whatsapp/reconnect')
    return response.data
  },

  async healthCheck(): Promise<WhatsAppHealthCheck> {
    const response = await api.get<WhatsAppHealthCheck>('/whatsapp/health')
    return response.data
  },
}
