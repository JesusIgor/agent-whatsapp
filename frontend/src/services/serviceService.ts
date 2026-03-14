import { api } from '@/lib/api'
import type {
  Service,
  ServiceCreate,
  ServiceUpdate,
  ServiceFilters,
} from '@/types'

export const serviceService = {
  async listServices(filters?: ServiceFilters): Promise<Service[]> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<Service[]>('/services', {
      params: filters,
    })
    return response.data
  },
  async getService(serviceId: string): Promise<Service> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<Service>(`/services/${serviceId}`)
    return response.data
  },
  async createService(serviceData: ServiceCreate): Promise<Service> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.post<Service>('/services', serviceData)
    return response.data
  },
  async updateService(
    serviceId: string,
    updates: ServiceUpdate
  ): Promise<Service> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.put<Service>(
      `/services/${serviceId}`,
      updates
    )
    return response.data
  },
  async deleteService(serviceId: string): Promise<void> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    await api.delete(`/services/${serviceId}`)
  },
  async getServicesByProfessional(professionalId: string): Promise<Service[]> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<Service[]>('/services', {
      params: { professional_id: professionalId },
    })
    return response.data
  },
  async getBookableServices(params?: {
    petshop_id?: number
    specialty?: string
    pet_species?: string
    pet_size?: string
  }): Promise<Service[]> {
    // TODO: Backend — endpoint não implementado em api-node ainda. Implementar em backend/api-node/src/modules/
    const response = await api.get<Service[]>('/services/bookable', {
      params,
    })
    return response.data
  },
}
