export type UiAppointmentStatus =
  | 'concluido'
  | 'confirmado'
  | 'pendente'
  | 'cancelado'

export function appointmentStatusFromApi(
  status?: string | null
): UiAppointmentStatus {
  const normalized = status?.toLowerCase().trim()

  switch (normalized) {
    case 'completed':
    case 'concluido':
    case 'done':
      return 'concluido'
    case 'confirmed':
    case 'confirmado':
    case 'in_progress':
      return 'confirmado'
    case 'cancelled':
    case 'canceled':
    case 'cancelado':
    case 'no_show':
      return 'cancelado'
    default:
      return 'pendente'
  }
}

export function appointmentStatusToApi(status: UiAppointmentStatus): string {
  switch (status) {
    case 'concluido':
      return 'completed'
    case 'confirmado':
      return 'confirmed'
    case 'cancelado':
      return 'cancelled'
    default:
      return 'pending'
  }
}