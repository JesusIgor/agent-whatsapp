import { Calendar } from 'lucide-react'
import { cn } from '@/lib/cn'
import { type ChartViewMode, type ChartViewOption } from '@/hooks/useChartView'

export interface ChartViewSwitcherProps {
  view: ChartViewMode
  onViewChange: (view: ChartViewMode) => void
  options: ChartViewOption[]
  showCalendarIcon?: boolean
}

export function ChartViewSwitcher({
  view,
  onViewChange,
  options,
  showCalendarIcon = true,
}: ChartViewSwitcherProps) {
  return (
    <div className="flex items-center gap-1">
      {options.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onViewChange(key)}
          className={cn(
            'rounded-md px-4 py-2 text-xs transition-colors',
            view === key
              ? 'border border-[#ECECF2] dark:border-[#40485A] bg-white dark:bg-[#212225] font-medium text-[#1C1D21] dark:text-[#f5f9fc]'
              : 'border-transparent bg-white dark:bg-transparent text-[#1E62EC] dark:text-[#2172e5] hover:bg-[#1E62EC]/10 dark:hover:bg-[#2172e5]/20'
          )}
        >
          {label}
        </button>
      ))}
      {showCalendarIcon && (
        <div className="rounded-md bg-[#1E62EC]/10 p-1.5 text-[#1E62EC]">
          <Calendar className="h-3.5 w-3.5" />
        </div>
      )}
    </div>
  )
}
