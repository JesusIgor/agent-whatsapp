import api from './api'
import type { Message, AgentResponse } from '../types'

export async function sendMessage(message: string, clientPhone: string): Promise<AgentResponse> {
  const { data } = await api.post<AgentResponse>('/agent/run', { message, clientPhone })
  return data
}

export async function getHistory(clientPhone: string): Promise<Message[]> {
  const { data } = await api.get<Message[]>('/agent/history', {
    params: { phone: clientPhone },
  })
  return data
}
