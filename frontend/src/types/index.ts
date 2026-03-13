export interface User {
  id: number
  name: string
  email: string
  role: string | null
  companyId: number
  companyName: string
  clientPhone: string | null
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export interface AgentResponse {
  reply: string
  agent_used: string
}
