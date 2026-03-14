import { api } from '@/lib/api'
import type {
  RecurringAppointment,
  RecurringAppointmentCreate,
  RecurringAppointmentUpdate,
  AppointmentInstancesResponse,
} from '@/types/recurring'

export const recurringService = {

  async list(): Promise<RecurringAppointment[]> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<RecurringAppointment[]>('/recurring')
    return response.data
  },

  async getById(id: string): Promise<RecurringAppointment> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<RecurringAppointment>(`/recurring/${id}`)
    return response.data
  },

  async create(data: RecurringAppointmentCreate): Promise<RecurringAppointment> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.post<RecurringAppointment>('/recurring', data)
    return response.data
  },

  async update(id: string, data: RecurringAppointmentUpdate): Promise<RecurringAppointment> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.patch<RecurringAppointment>(`/recurring/${id}`, data)
    return response.data
  },

  async delete(id: string, deleteFutureOnly = false): Promise<void> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    await api.delete(`/recurring/${id}`, {
      params: { delete_future_only: deleteFutureOnly },
    })
  },

  async pause(id: string): Promise<RecurringAppointment> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.post<RecurringAppointment>(`/recurring/${id}/pause`)
    return response.data
  },

  async resume(id: string): Promise<RecurringAppointment> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.post<RecurringAppointment>(`/recurring/${id}/resume`)
    return response.data
  },

  async getInstances(id: string, page = 1, pageSize = 20): Promise<AppointmentInstancesResponse> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<AppointmentInstancesResponse>(`/recurring/${id}/instances`, {
      params: { page, page_size: pageSize },
    })
    return response.data
  },

  async skipInstance(parentId: string, instanceDate: string): Promise<void> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    await api.post(`/recurring/${parentId}/skip`, { date: instanceDate })
  },

  async regenerateInstances(id: string): Promise<AppointmentInstancesResponse> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.post<AppointmentInstancesResponse>(`/recurring/${id}/regenerate`)
    return response.data
  },
}
