import { api } from '@/lib/api'
import type {
  ChatBusinessRequest,
  ChatBusinessResponse,
  ChatBusinessContext,
  ChatBusinessHistoryMessage,
} from '@/types'

export const chatBusinessService = {
  async sendMessage(
    message: string,
    context: ChatBusinessContext,
    history: ChatBusinessHistoryMessage[]
  ): Promise<ChatBusinessResponse> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const payload: ChatBusinessRequest = {
      message,
      context,
      history,
    }

    const response = await api.post<ChatBusinessResponse>(
      '/chat/business',
      payload
    )
    return response.data
  },
}
