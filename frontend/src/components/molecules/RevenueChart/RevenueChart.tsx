import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useChartView, type ChartViewMode } from '@/hooks/useChartView'
import { ChartCard } from '@/components/molecules/ChartCard'
import { ChartViewSwitcher } from '@/components/molecules/ChartViewSwitcher'
import { useTheme } from '@/contexts/ThemeContext'

const gridStroke = { light: '#E5E7EB', dark: '#40485A' }
const tickFill = { light: '#727B8E', dark: '#8a94a6' }

export interface RevenueChartDataPoint {
  date: string
  revenue: number
  appointments: number
}

const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  const month = d.getMonth()
  const day = d.getDate()
  return `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}`
}

function formatMonthLabel(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return MONTH_NAMES[d.getMonth()] ?? dateStr
}

function mapApiToChartData(apiData: RevenueChartDataPoint[], byMonth = false): Array<{ name: string; value: number; value2: number }> {
  return apiData.map(({ date, revenue, appointments }) => ({
    name: byMonth ? formatMonthLabel(date) : formatDateLabel(date),
    value: revenue,
    value2: appointments,
  }))
}

const monthlyData = [
  { name: 'Jan', value: 200, value2: 180 },
  { name: 'Fev', value: 350, value2: 220 },
  { name: 'Mar', value: 300, value2: 250 },
  { name: 'Abr', value: 400, value2: 280 },
  { name: 'Mai', value: 380, value2: 300 },
  { name: 'Jun', value: 420, value2: 310 },
  { name: 'Jul', value: 350, value2: 290 },
  { name: 'Ago', value: 380, value2: 270 },
  { name: 'Set', value: 400, value2: 320 },
  { name: 'Out', value: 350, value2: 300 },
  { name: 'Nov', value: 300, value2: 260 },
  { name: 'Dez', value: 280, value2: 240 },
]

const weeklyData = [
  { name: 'Sem 1', value: 80, value2: 60 },
  { name: 'Sem 2', value: 120, value2: 90 },
  { name: 'Sem 3', value: 95, value2: 75 },
  { name: 'Sem 4', value: 110, value2: 85 },
]

const dailyData = [
  { name: 'Seg', value: 30, value2: 22 },
  { name: 'Ter', value: 45, value2: 35 },
  { name: 'Qua', value: 38, value2: 28 },
  { name: 'Qui', value: 52, value2: 40 },
  { name: 'Sex', value: 60, value2: 48 },
  { name: 'Sáb', value: 42, value2: 30 },
  { name: 'Dom', value: 20, value2: 15 },
]

const DATA_MAP: Record<ChartViewMode, typeof monthlyData> = {
  dia: dailyData,
  semana: weeklyData,
  mes: monthlyData,
}

interface RevenueChartProps {
  className?: string
  
  data?: RevenueChartDataPoint[] | null
}

export function RevenueChart({ className, data: apiData }: RevenueChartProps) {
  const { view, setView, data: mockData, options } = useChartView(DATA_MAP, 'mes')
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const data = apiData?.length ? mapApiToChartData(apiData, view === 'mes') : mockData

  return (
    <ChartCard
      title="Faturamento"
      subtitle={apiData?.length ? undefined : '(+5) more in 2021'}
      subtitleClassName="font-medium text-[#1E62EC]"
      className={className}
      headerRight={
        <ChartViewSwitcher view={view} onViewChange={setView} options={options} />
      }
    >
      <ResponsiveContainer width="100%" height={265}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1E62EC" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#1E62EC" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorRevenue2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#727B8E" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#727B8E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? gridStroke.dark : gridStroke.light}
            vertical={false}
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: isDark ? tickFill.dark : tickFill.light, fontSize: 11 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: isDark ? tickFill.dark : tickFill.light, fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1A1B1D' : '#fff',
              border: isDark ? '1px solid #40485A' : '1px solid #E5E7EB',
              borderRadius: '8px',
            }}
            labelStyle={{ color: isDark ? '#8a94a6' : '#727B8E' }}
            itemStyle={{ color: isDark ? '#e8ecf1' : '#434A57' }}
          />
          <Area
            type="monotone"
            dataKey="value2"
            stroke="#A0AEC0"
            strokeWidth={2}
            fill="url(#colorRevenue2)"
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#1E62EC"
            strokeWidth={2}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
