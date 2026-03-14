import { api } from '@/lib/api'
import type {
  LearningCase,
  LearningCaseCreate,
  LearningCaseComplete,
  LearningCaseFilter,
  LearningStats,
  SimilarCaseSearch,
  SimilarCaseResult,
  MarkFeedbackRequest,
} from '@/types/learning'

export const learningService = {

  async list(filters?: LearningCaseFilter): Promise<LearningCase[]> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<LearningCase[]>('/learning/cases', {
      params: filters,
    })
    return response.data
  },

  async getById(id: string): Promise<LearningCase> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<LearningCase>(`/learning/cases/${id}`)
    return response.data
  },

  async getPending(): Promise<LearningCase[]> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<LearningCase[]>('/learning/cases/pending')
    return response.data
  },

  async create(data: LearningCaseCreate): Promise<LearningCase> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.post<LearningCase>('/learning/cases', data)
    return response.data
  },

  async complete(id: string, data: LearningCaseComplete): Promise<LearningCase> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.post<LearningCase>(`/learning/cases/${id}/complete`, data)
    return response.data
  },

  async dismiss(id: string): Promise<LearningCase> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.post<LearningCase>(`/learning/cases/${id}/dismiss`)
    return response.data
  },

  async searchSimilar(data: SimilarCaseSearch): Promise<SimilarCaseResult[]> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.post<SimilarCaseResult[]>('/learning/search', data)
    return response.data
  },

  async markFeedback(data: MarkFeedbackRequest): Promise<void> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    await api.post('/learning/feedback', data)
  },

  async getStats(): Promise<LearningStats> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<LearningStats>('/learning/stats')
    return response.data
  },

  async delete(id: string): Promise<void> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    await api.delete(`/learning/cases/${id}`)
  },

  async bulkUpdate(caseIds: string[], updates: Partial<LearningCase>): Promise<void> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    await api.post('/learning/bulk-update', {
      case_ids: caseIds,
      updates,
    })
  },

  async retrain(): Promise<{ message: string }> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.post<{ message: string }>('/learning/retrain')
    return response.data
  },
}
