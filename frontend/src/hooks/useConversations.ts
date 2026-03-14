import { useState, useCallback } from 'react'
import { conversationService } from '@/services'
import type {
  Conversation,
  ConversationDetail,
  ConversationAnalysis,
  ChatMessage,
  SendMessageRequest,
  ConversationFilters,
} from '@/types'

interface UseConversationsReturn {
  conversations: Conversation[]
  currentConversation: ConversationDetail | null
  loading: boolean
  error: string | null
  fetchConversations: (filters?: ConversationFilters) => Promise<Conversation[]>
  getConversation: (
    id: string,
    params?: { limit?: number; offset?: number }
  ) => Promise<ConversationDetail>
  sendMessage: (
    conversationId: string,
    message: SendMessageRequest
  ) => Promise<ChatMessage>
  getAnalysis: (conversationId: string) => Promise<ConversationAnalysis>
  toggleAI: (
    clientId: string,
    pause: boolean,
    reason?: string
  ) => Promise<{ success: boolean; ai_paused: boolean }>
  searchMessages: (
    query: string,
    params?: { client_id?: string; limit?: number }
  ) => Promise<ChatMessage[]>
}

export function useConversations(): UseConversationsReturn {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] =
    useState<ConversationDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchConversations = useCallback(
    async (filters?: ConversationFilters) => {
      try {
        setLoading(true)
        setError(null)
        const data = await conversationService.listConversations(filters)
        setConversations(data)
        return data
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Erro ao carregar conversas')
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const getConversation = useCallback(
    async (id: string, params?: { limit?: number; offset?: number }) => {
      try {
        setLoading(true)
        setError(null)
        const data = await conversationService.getConversation(id, params)
        setCurrentConversation(data)
        return data
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Erro ao carregar conversa')
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const sendMessage = useCallback(
    async (conversationId: string, message: SendMessageRequest) => {
      try {
        setLoading(true)
        setError(null)
        const newMessage = await conversationService.sendMessage(
          conversationId,
          message
        )
        if (currentConversation?.conversation_id === conversationId) {
          setCurrentConversation((prev) =>
            prev
              ? {
                  ...prev,
                  messages: [...prev.messages, newMessage],
                  total_messages: prev.total_messages + 1,
                }
              : null
          )
        }
        return newMessage
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Erro ao enviar mensagem')
        throw err
      } finally {
        setLoading(false)
      }
    },
    [currentConversation]
  )

  const getAnalysis = useCallback(async (conversationId: string) => {
    try {
      setLoading(true)
      setError(null)
      return await conversationService.getAnalysis(conversationId)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao carregar análise')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const toggleAI = useCallback(
    async (clientId: string, pause: boolean, reason?: string) => {
      try {
        setLoading(true)
        setError(null)
        return await conversationService.toggleAI(clientId, pause, reason)
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Erro ao alterar status da IA')
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const searchMessages = useCallback(
    async (query: string, params?: { client_id?: string; limit?: number }) => {
      try {
        setLoading(true)
        setError(null)
        return await conversationService.searchMessages(query, params)
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Erro ao buscar mensagens')
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return {
    conversations,
    currentConversation,
    loading,
    error,
    fetchConversations,
    getConversation,
    sendMessage,
    getAnalysis,
    toggleAI,
    searchMessages,
  }
}
