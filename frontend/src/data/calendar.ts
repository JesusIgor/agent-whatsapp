import type { CalendarEvent } from '@/components/molecules/CalendarGrid'

export const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
] as const

export const WEEK_LABELS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'] as const

export const SPECIES_OPTIONS = [
  { value: 'cachorro', label: 'Cachorro' },
  { value: 'gato', label: 'Gato' },
  { value: 'passaro', label: 'Pássaro' },
  { value: 'roedor', label: 'Roedor' },
  { value: 'outro', label: 'Outro' },
]

export const SERVICE_OPTIONS = [
  { value: 'Vacinação', label: 'Vacinação' },
  { value: 'Consulta', label: 'Consulta' },
  { value: 'Banho', label: 'Banho' },
  { value: 'Tosa', label: 'Tosa' },
  { value: 'Banho e Tosa', label: 'Banho e Tosa' },
  { value: 'Check-up', label: 'Check-up' },
  { value: 'Cirurgia', label: 'Cirurgia' },
  { value: 'Exames', label: 'Exames' },
]

export const STATUS_OPTIONS = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'concluido', label: 'Concluído' },
]

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    petName: 'Mel',
    petInitials: 'ML',
    type: 'Vacinação',
    time: '10:00',
    date: '2026-01-01',
    status: 'confirmado',
  },
  {
    id: '2',
    petName: 'Thor',
    petInitials: 'TH',
    type: 'Vacinação',
    time: '10:00',
    date: '2026-01-01',
    status: 'confirmado',
  },
  {
    id: '3',
    petName: 'Thor',
    petInitials: 'TH',
    type: 'Vacinação',
    time: '09:00',
    date: '2026-01-12',
    status: 'concluido',
  },
  {
    id: '4',
    petName: 'Mel',
    petInitials: 'ML',
    type: 'Vacinação',
    time: '10:00',
    date: '2026-01-12',
    status: 'concluido',
  },
  {
    id: '5',
    petName: 'Bolt',
    petInitials: 'BT',
    type: 'Consulta',
    time: '14:00',
    date: '2026-01-15',
    status: 'pendente',
  },
  {
    id: '6',
    petName: 'Luna',
    petInitials: 'LN',
    type: 'Banho e Tosa',
    time: '09:30',
    date: '2026-01-20',
    status: 'confirmado',
  },
]
