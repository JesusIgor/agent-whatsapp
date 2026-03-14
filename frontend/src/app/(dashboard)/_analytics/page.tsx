import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  MessageSquare,
  Clock,
  Target,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  Check,
} from 'lucide-react'
import { DashboardLayout } from '@/components/templates/DashboardLayout'
import { RevenueChart } from '@/components/molecules/RevenueChart'
import { CategoriesChart } from '@/components/molecules/CategoriesChart'
import { VisitsChart } from '@/components/molecules/VisitsChart'
import { SalesChart } from '@/components/molecules/SalesChart'
import { dashboardService } from '@/services'
import { cn } from '@/lib/cn'
import type { DashboardStats } from '@/types'

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: React.ElementType
  iconColor?: string
  iconBgColor?: string
}

function MetricCard({
  title,
  value,
  change,
  changeLabel = 'vs mês anterior',
  icon: Icon,
  iconColor = 'text-[#1E62EC]',
  iconBgColor = 'bg-[#1E62EC]/10',
}: MetricCardProps) {
  const isPositive = change && change >= 0
  const isNegative = change && change < 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-3 rounded-xl border border-[#727B8E1A] bg-white dark:border-[#40485A] dark:bg-[#1A1B1D] p-5"
    >
      <div className="flex items-center justify-between">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', iconBgColor)}>
          <Icon className={cn('h-5 w-5', iconColor)} />
        </div>
        {change !== undefined && (
          <div
            className={cn(
              'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
              isPositive && 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
              isNegative && 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-[#434A57] dark:text-[#f5f9fc]">{value}</p>
        <p className="text-xs text-[#727B8E] dark:text-[#8a94a6]">{title}</p>
      </div>
      {change !== undefined && (
        <p className="text-[10px] text-[#727B8E] dark:text-[#8a94a6]">{changeLabel}</p>
      )}
    </motion.div>
  )
}

interface AnalyticsSection {
  title: string
  icon: React.ElementType
  children: React.ReactNode
}

function Section({ title, icon: Icon, children }: AnalyticsSection) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-[#1E62EC]" />
        <h2 className="text-lg font-semibold text-[#434A57] dark:text-[#f5f9fc]">{title}</h2>
      </div>
      {children}
    </div>
  )
}

const PERIOD_OPTIONS = [
  { value: '7d', label: 'Últimos 7 dias' },
  { value: '30d', label: 'Últimos 30 dias' },
  { value: '90d', label: 'Últimos 90 dias' },
  { value: '12m', label: 'Últimos 12 meses' },
]

function PeriodSelector({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = PERIOD_OPTIONS.find((opt) => opt.value === value)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-[#727B8E]/10 bg-white dark:border-[#40485A] dark:bg-[#1A1B1D] px-3 py-2 transition-colors hover:bg-[#F4F6F9] dark:hover:bg-[#212225]"
      >
        <Calendar className="h-4 w-4 text-[#727B8E] dark:text-[#8a94a6]" />
        <span className="text-sm text-[#434A57] dark:text-[#f5f9fc]">
          {selectedOption?.label}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-[#727B8E] dark:text-[#8a94a6] transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-1 min-w-[180px] rounded-lg border border-[#727B8E]/10 bg-white dark:border-[#40485A] dark:bg-[#1A1B1D] py-1 shadow-lg"
          >
            {PERIOD_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={cn(
                  'flex w-full items-center justify-between px-3 py-2 text-sm transition-colors',
                  option.value === value
                    ? 'bg-[#1E62EC]/10 text-[#1E62EC]'
                    : 'text-[#434A57] dark:text-[#f5f9fc] hover:bg-[#F4F6F9] dark:hover:bg-[#212225]'
                )}
              >
                {option.label}
                {option.value === value && <Check className="h-4 w-4" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface TopItemProps {
  rank: number
  name: string
  value: string
  percentage: number
}

function TopItem({ rank, name, value, percentage }: TopItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[#727B8E]/10 bg-[#F4F6F9] dark:border-[#40485A] dark:bg-[#212225] p-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E62EC]/10 text-sm font-bold text-[#1E62EC]">
        {rank}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#434A57] dark:text-[#f5f9fc] truncate">{name}</p>
        <p className="text-xs text-[#727B8E] dark:text-[#8a94a6]">{value}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-[#1E62EC]">{percentage}%</p>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [revenueChartData, setRevenueChartData] = useState<
    Array<{ date: string; revenue: number; appointments: number }> | null
  >(null)
  const [categoriesChartData, setCategoriesChartData] = useState<
    Array<{ category: string; value: number; percentage: number }> | null
  >(null)
  const [visitsChartData, setVisitsChartData] = useState<
    Array<{ date: string; visits: number; new_clients: number; returning_clients: number }> | null
  >(null)
  const [salesChartData, setSalesChartData] = useState<
    Array<{ service: string; sales: number; revenue: number }> | null
  >(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('30d')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stats, revenueChart, categoriesChart, visitsChart, salesChart] = await Promise.allSettled([
          dashboardService.getStats(),
          dashboardService.getRevenueChart({ period: 'month', group_by: 'day' }),
          dashboardService.getCategoriesChart(),
          dashboardService.getVisitsChart({ period: 'month', group_by: 'day' }),
          dashboardService.getSalesChart(),
        ])
        if (stats.status === 'fulfilled') setDashboardStats(stats.value)
        if (revenueChart.status === 'fulfilled') setRevenueChartData(revenueChart.value)
        if (categoriesChart.status === 'fulfilled') setCategoriesChartData(categoriesChart.value)
        if (visitsChart.status === 'fulfilled') setVisitsChartData(visitsChart.value)
        if (salesChart.status === 'fulfilled') setSalesChartData(salesChart.value)
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const topServices = [
    { name: 'Banho e Tosa', value: 'R$ 12.450', percentage: 35 },
    { name: 'Consulta Veterinária', value: 'R$ 8.200', percentage: 23 },
    { name: 'Vacinação', value: 'R$ 5.800', percentage: 16 },
    { name: 'Hospedagem', value: 'R$ 4.500', percentage: 13 },
    { name: 'Adestramento', value: 'R$ 4.050', percentage: 13 },
  ]

  const topClients = [
    { name: 'Maria Silva', value: '15 agendamentos', percentage: 8 },
    { name: 'João Santos', value: '12 agendamentos', percentage: 6 },
    { name: 'Ana Oliveira', value: '10 agendamentos', percentage: 5 },
    { name: 'Pedro Costa', value: '9 agendamentos', percentage: 5 },
    { name: 'Lucia Ferreira', value: '8 agendamentos', percentage: 4 },
  ]

  const performanceMetrics = [
    { label: 'Taxa de Conversão', value: '68%', change: 12 },
    { label: 'Tempo Médio de Resposta', value: '2.5 min', change: -15 },
    { label: 'Satisfação do Cliente', value: '4.8/5', change: 5 },
    { label: 'Taxa de Retorno', value: '72%', change: 8 },
  ]

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 rounded-[24px_24px_0_0] bg-white dark:bg-[#272A34] sm:rounded-[40px_40px_0_0] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        {}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <PeriodSelector value={selectedPeriod} onChange={setSelectedPeriod} />
        </div>

        {}
        <Section title="Visão Geral" icon={BarChart3}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <MetricCard
              title="Faturamento Total"
              value={`R$ ${((dashboardStats?.total_appointments ?? 0) * 85).toLocaleString()}`}
              change={18}
              icon={DollarSign}
              iconColor="text-green-600"
              iconBgColor="bg-green-100 dark:bg-green-900/30"
            />
            <MetricCard
              title="Total de Agendamentos"
              value={dashboardStats?.total_appointments ?? 0}
              change={12}
              icon={Calendar}
              iconColor="text-[#1E62EC]"
              iconBgColor="bg-[#1E62EC]/10"
            />
            <MetricCard
              title="Clientes Ativos"
              value={dashboardStats?.total_clients ?? 0}
              change={8}
              icon={Users}
              iconColor="text-purple-600"
              iconBgColor="bg-purple-100 dark:bg-purple-900/30"
            />
            <MetricCard
              title="Mensagens IA"
              value={dashboardStats?.appointments_today ?? 0}
              change={25}
              icon={MessageSquare}
              iconColor="text-orange-600"
              iconBgColor="bg-orange-100 dark:bg-orange-900/30"
            />
            <MetricCard
              title="Taxa de Ocupação"
              value={`${dashboardStats?.conversion_rate ?? 0}%`}
              change={5}
              icon={Target}
              iconColor="text-cyan-600"
              iconBgColor="bg-cyan-100 dark:bg-cyan-900/30"
            />
            <MetricCard
              title="Tempo Médio"
              value="45 min"
              change={-3}
              icon={Clock}
              iconColor="text-pink-600"
              iconBgColor="bg-pink-100 dark:bg-pink-900/30"
            />
          </div>
        </Section>

        {}
        <Section title="Performance Financeira" icon={TrendingUp}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RevenueChart className="h-full" data={revenueChartData} />
            </div>
            <CategoriesChart className="h-full" data={categoriesChartData} />
          </div>
        </Section>

        {}
        <Section title="Métricas de Performance" icon={Activity}>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {performanceMetrics.map((metric) => (
              <div
                key={metric.label}
                className="flex flex-col gap-2 rounded-xl border border-[#727B8E1A] bg-white dark:border-[#40485A] dark:bg-[#1A1B1D] p-4"
              >
                <p className="text-xs text-[#727B8E] dark:text-[#8a94a6]">{metric.label}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-[#434A57] dark:text-[#f5f9fc]">
                    {metric.value}
                  </span>
                  <div
                    className={cn(
                      'flex items-center gap-0.5 text-xs font-medium',
                      metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    {metric.change >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(metric.change)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {}
        <Section title="Visitas e Vendas" icon={Zap}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <VisitsChart className="h-full" data={visitsChartData} />
            </div>
            <SalesChart className="h-full" data={salesChartData} />
          </div>
        </Section>

        {}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Section title="Top Serviços" icon={PieChart}>
            <div className="space-y-2">
              {topServices.map((item, index) => (
                <TopItem
                  key={item.name}
                  rank={index + 1}
                  name={item.name}
                  value={item.value}
                  percentage={item.percentage}
                />
              ))}
            </div>
          </Section>

          <Section title="Top Clientes" icon={Users}>
            <div className="space-y-2">
              {topClients.map((item, index) => (
                <TopItem
                  key={item.name}
                  rank={index + 1}
                  name={item.name}
                  value={item.value}
                  percentage={item.percentage}
                />
              ))}
            </div>
          </Section>
        </div>

        {}
        <Section title="Insights da IA" icon={Zap}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border-l-4 border-l-[#1E62EC] border border-[#727B8E]/10 bg-white dark:border-[#40485A] dark:bg-[#1A1B1D] p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1E62EC]/10">
                  <TrendingUp className="h-4 w-4 text-[#1E62EC]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#434A57] dark:text-[#f5f9fc]">
                    Oportunidade de Crescimento
                  </p>
                  <p className="mt-1 text-xs text-[#727B8E] dark:text-[#8a94a6]">
                    Seus horários de terça-feira têm 40% menos ocupação. Considere promoções neste dia.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border-l-4 border-l-green-500 border border-[#727B8E]/10 bg-white dark:border-[#40485A] dark:bg-[#1A1B1D] p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/10">
                  <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#434A57] dark:text-[#f5f9fc]">
                    Clientes em Risco
                  </p>
                  <p className="mt-1 text-xs text-[#727B8E] dark:text-[#8a94a6]">
                    12 clientes não retornam há mais de 60 dias. Envie uma campanha de reativação.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border-l-4 border-l-orange-500 border border-[#727B8E]/10 bg-white dark:border-[#40485A] dark:bg-[#1A1B1D] p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500/10">
                  <DollarSign className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#434A57] dark:text-[#f5f9fc]">
                    Aumento de Ticket
                  </p>
                  <p className="mt-1 text-xs text-[#727B8E] dark:text-[#8a94a6]">
                    Clientes que fazem banho + tosa gastam 35% mais. Sugira combos no agendamento.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </Section>
      </div>
    </DashboardLayout>
  )
}
