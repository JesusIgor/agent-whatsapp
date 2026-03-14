import { DollarSign, TrendingUp } from 'lucide-react'
import type { DashboardStats } from '@/types'

interface Stat {
  label: string
  value: string
  hasChart?: boolean
}

function statsFromDashboard(s: DashboardStats): Stat[] {
  return [
    { label: 'Agendados', value: String(s.appointments_today ?? 0) },
    { label: 'Próximos 7 dias', value: String(s.appointments_week ?? 0) },
    {
      label: 'Crescimento',
      value: `${Number(s.conversion_rate ?? 0).toFixed(0)}%`,
      hasChart: true,
    },
    { label: 'Automatizado', value: String(s.total_appointments ?? 0) },
    { label: 'Métricas', value: String(s.total_clients ?? 0) },
  ]
}

const defaultStats: Stat[] = [
  { label: 'Agendados', value: '0' },
  { label: 'Próximos 7 dias', value: '0' },
  { label: 'Crescimento', value: '0%', hasChart: true },
  { label: 'Automatizado', value: '0' },
  { label: 'Métricas', value: '0' },
]

interface StatCardsProps {
  
  dashboardStats?: DashboardStats | null
  
  stats?: Stat[]
}

export function StatCards({ dashboardStats, stats }: StatCardsProps) {
  const displayStats =
    stats ?? (dashboardStats ? statsFromDashboard(dashboardStats) : defaultStats)
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {displayStats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-3 rounded-lg border border-[#727B8E1A] bg-white dark:border-[#40485A] dark:bg-[#1A1B1D] p-4 backdrop-blur-[6px]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1E62EC]/10">
            <DollarSign className="h-5 w-5 text-[#1E62EC]" />
          </div>
          <div>
            <p className="text-xs text-[#727B8E] dark:text-[#8a94a6]">{stat.label}</p>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-semibold text-[#434A57] dark:text-[#f5f9fc]">
                {stat.value}
              </span>
              {stat.hasChart && (
                <TrendingUp className="h-5 w-5 text-[#1E62EC]" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
