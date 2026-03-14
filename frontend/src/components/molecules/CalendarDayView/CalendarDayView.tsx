import { cn } from '@/lib/cn'

type AppointmentStatus = 'concluido' | 'confirmado' | 'pendente'

export interface DayAppointment {
  id: string
  initials: string
  name: string
  service: string
  time: string
  duration?: number
  status: AppointmentStatus
}

interface CalendarDayViewProps {
  appointments: DayAppointment[]
  selectedDate: string
  onAppointmentClick?: (id: string) => void
}

const STATUS_STYLES: Record<
  AppointmentStatus,
  { bg: string; border: string; text: string; label: string; accent: string }
> = {
  concluido: {
    bg: 'bg-[#EAFBEB]',
    border: 'border-l-[#3CD057]',
    text: 'text-[#3CD057]',
    label: 'Concluído',
    accent: 'bg-[#D4F3D6]',
  },
  confirmado: {
    bg: 'bg-[#EBF1FB]',
    border: 'border-l-[#3C6BD0]',
    text: 'text-[#3C6BD0]',
    label: 'Confirmado',
    accent: 'bg-[#D4E2F3]',
  },
  pendente: {
    bg: 'bg-[#FBFBEB]',
    border: 'border-l-[#D0B33C]',
    text: 'text-[#D0B33C]',
    label: 'Pendente',
    accent: 'bg-[#F3F2D4]',
  },
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 7)

function formatHour(hour: number) {
  return `${String(hour).padStart(2, '0')}:00`
}

export function CalendarDayView({
  appointments,
  selectedDate,
  onAppointmentClick,
}: CalendarDayViewProps) {
  return (
    <div className="animate-scale-in flex flex-col">
      <div className="flex items-center border-b border-[rgba(114,123,142,0.1)] dark:border-[#40485A] bg-white dark:bg-[#1A1B1D] px-6 py-3">
        <span className="text-sm font-semibold text-[#434A57] dark:text-[#f5f9fc]">
          {selectedDate}
        </span>
      </div>

      <div className="flex flex-col">
        {HOURS.map((hour) => {
          const hourStr = formatHour(hour)
          const hourAppointments = appointments.filter(
            (a) => a.time === hourStr
          )

          return (
            <div
              key={hour}
              className="flex min-h-[72px] border-b border-[rgba(114,123,142,0.1)] dark:border-[#40485A]"
            >
              <div className="flex w-20 flex-shrink-0 items-start justify-end border-r border-[rgba(114,123,142,0.1)] dark:border-[#40485A] bg-[#FAFBFC] dark:bg-[#212225] px-3 pt-2">
                <span className="text-xs font-medium text-[#727B8E] dark:text-[#8a94a6]">
                  {hourStr}
                </span>
              </div>

              <div className="flex flex-1 gap-2 p-2">
                {hourAppointments.map((appt) => {
                  const style = STATUS_STYLES[appt.status]
                  return (
                    <button
                      key={appt.id}
                      onClick={() => onAppointmentClick?.(appt.id)}
                      className={cn(
                        'flex flex-1 items-start gap-3 rounded-xl border-l-[3px] p-3 text-left transition-opacity hover:opacity-80',
                        style.border,
                        style.bg
                      )}
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[rgba(114,123,142,0.1)] bg-white">
                        <span className="text-sm font-medium text-[#434A57]">
                          {appt.initials}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col gap-0.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-[#434A57]">
                            {appt.name}
                          </span>
                          <span
                            className={cn(
                              'rounded-full px-2 py-0.5 text-[7px] font-bold uppercase tracking-wider',
                              style.accent,
                              style.text
                            )}
                          >
                            {style.label}
                          </span>
                        </div>
                        <span className="text-xs text-[#727B8E]">
                          {appt.service}
                        </span>
                        <span className="text-xs text-[#727B8E]">
                          {appt.time}
                        </span>
                      </div>
                    </button>
                  )
                })}
                {hourAppointments.length === 0 && (
                  <div className="flex flex-1 items-center justify-center">
                    <div className="h-px w-full bg-[rgba(114,123,142,0.05)]" />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
