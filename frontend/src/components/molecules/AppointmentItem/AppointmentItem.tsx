import { cn } from '@/lib/cn'

export type AppointmentStatus = 'concluido' | 'confirmado' | 'pendente' | 'cancelado'

export interface AppointmentItemProps {
  petName: string
  petInitials?: string
  service: string
  date: string
  time: string
  price: string
  status: AppointmentStatus
  className?: string
}

const statusConfig: Record<AppointmentStatus, { label: string; className: string }> = {
  concluido: {
    label: 'CONCLUÍDO',
    className: 'bg-[#3DCA21]/10 text-[#3DCA21]',
  },
  confirmado: {
    label: 'CONFIRMADO',
    className: 'border border-[#3DCA21] text-[#3DCA21] bg-transparent',
  },
  pendente: {
    label: 'PENDENTE',
    className: 'bg-[#F59E0B]/10 text-[#F59E0B]',
  },
  cancelado: {
    label: 'CANCELADO',
    className: 'bg-[#EF4444]/10 text-[#EF4444]',
  },
}

function AuzapIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M10 2L3 6V14L10 18L17 14V6L10 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 8L7 10V14L10 16L13 14V10L10 8Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function AppointmentItem({
  petName,
  petInitials,
  service,
  date,
  time,
  price,
  status,
  className,
}: AppointmentItemProps) {
  const statusInfo = statusConfig[status]
  const initials = petInitials || petName.slice(0, 2).toUpperCase()

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-xl border border-[#727B8E]/10 bg-white dark:border-[#40485A] dark:bg-[#1A1B1D] p-4',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F6F9] dark:bg-[#212225]">
          <span className="text-sm font-medium text-[#727B8E] dark:text-[#8a94a6]">{initials}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-medium text-[#434A57] dark:text-[#f5f9fc]">{service}</span>
          <span className="text-xs text-[#727B8E] dark:text-[#8a94a6]">
            {petName} • {date} • {time}
          </span>
          <span className="text-xs font-medium text-[#434A57] dark:text-[#f5f9fc]">{price}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-[10px] font-semibold',
            statusInfo.className
          )}
        >
          {statusInfo.label}
        </span>

        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#727B8E] transition-colors hover:bg-[#F4F6F9] hover:text-[#434A57] dark:text-[#8a94a6] dark:hover:bg-[#212225] dark:hover:text-[#f5f9fc]"
          aria-label="Ação 1"
        >
          <AuzapIcon className="h-4 w-4" />
        </button>

        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#727B8E] transition-colors hover:bg-[#F4F6F9] hover:text-[#434A57] dark:text-[#8a94a6] dark:hover:bg-[#212225] dark:hover:text-[#f5f9fc]"
          aria-label="Ação 2"
        >
          <AuzapIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
