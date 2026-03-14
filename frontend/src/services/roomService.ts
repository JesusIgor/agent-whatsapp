import { api } from '@/lib/api'
import type {
  Room,
  RoomCreate,
  RoomUpdate,
  RoomAvailability,
} from '@/types'

export const roomService = {
  async listRooms(params?: {
    petshop_id?: number
    room_type?: 'hotel' | 'creche' | 'training'
    is_active?: boolean
  }): Promise<Room[]> {
    const response = await api.get<Room[]>('/boarding/rooms', { params })
    return response.data
  },
  async getRoom(roomId: string): Promise<Room> {
    const response = await api.get<Room>(`/boarding/rooms/${roomId}`)
    return response.data
  },
  async createRoom(roomData: RoomCreate): Promise<Room> {
    const response = await api.post<Room>('/boarding/rooms', roomData)
    return response.data
  },
  async updateRoom(roomId: string, updates: RoomUpdate): Promise<Room> {
    const response = await api.put<Room>(
      `/boarding/rooms/${roomId}`,
      updates
    )
    return response.data
  },
  async deleteRoom(roomId: string): Promise<void> {
    await api.delete(`/boarding/rooms/${roomId}`)
  },
  async checkAvailability(
    roomId: string,
    params: {
      check_in_date: string
      check_out_date: string
    }
  ): Promise<RoomAvailability> {
    const response = await api.get<RoomAvailability>(
      `/boarding/rooms/${roomId}/availability`,
      { params }
    )
    return response.data
  },
  async listAvailability(params: {
    petshop_id: number
    check_in_date: string
    check_out_date?: string
    room_type?: 'hotel' | 'creche' | 'training'
  }): Promise<RoomAvailability[]> {
    const response = await api.get<RoomAvailability[]>(
      '/boarding/rooms/availability',
      { params }
    )
    return response.data
  },
}
