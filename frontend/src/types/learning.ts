

export type LearningCaseType = 'price_question' | 'service_question' | 'schedule_question' | 'complaint' | 'custom'

export type LearningAnomalyType = 'BIPE_PRICE' | 'BIPE_SERVICE' | 'BIPE_SCHEDULE' | 'BIPE_OTHER'

export type ResolutionStatus = 'pending' | 'learned' | 'dismissed' | 'expired'

export interface LearningCase {
  id: string
  case_type: LearningCaseType
  anomaly_type?: LearningAnomalyType
  trigger_message: string
  trigger_keywords: string[]
  context_snapshot: Record<string, unknown>
  question_asked: string
  client_phone: string
  client_name?: string
  pet_name?: string
  pet_info?: Record<string, unknown>
  owner_response?: string
  resolution_action?: string
  resolution_status: ResolutionStatus
  used_count: number
  effectiveness_score: number
  success_count: number
  failure_count: number
  created_at: string
  updated_at: string
  last_used_at?: string
}

export interface LearningCaseCreate {
  case_type: LearningCaseType
  anomaly_type?: LearningAnomalyType
  trigger_message: string
  context_snapshot: Record<string, unknown>
  question_asked: string
  client_phone: string
  client_name?: string
  pet_name?: string
  pet_info?: Record<string, unknown>
}

export interface LearningCaseComplete {
  owner_response: string
  resolution_action: string
}

export interface SimilarCaseSearch {
  message: string
  context?: Record<string, unknown>
  anomaly_type?: LearningAnomalyType
  min_effectiveness?: number
}

export interface SimilarCaseResult {
  case: LearningCase
  similarity_score: number
}

export interface LearningStats {
  total_cases: number
  pending_cases: number
  learned_cases: number
  total_uses: number
  avg_effectiveness: number
}

export interface LearningCaseFilter {
  case_type?: LearningCaseType
  anomaly_type?: LearningAnomalyType
  resolution_status?: ResolutionStatus
  client_phone?: string
  min_effectiveness?: number
  date_from?: string
  date_to?: string
  order_by?: string
  order_direction?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

export interface MarkFeedbackRequest {
  case_id: string
  feedback: 'success' | 'failure'
}
