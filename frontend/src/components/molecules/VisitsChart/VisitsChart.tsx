import { useState } from 'react'
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { useChartView, type ChartViewMode } from '@/hooks/useChartView'
import { ChartCard } from '@/components/molecules/ChartCard'
import { ChartViewSwitcher } from '@/components/molecules/ChartViewSwitcher'
import { useTheme } from '@/contexts/ThemeContext'

const gridStroke = { light: '#E5E7EB', dark: '#40485A' }
const tickFill = { light: '#727B8E', dark: '#8a94a6' }

export interface VisitsChartDataPoint {
  date: string
  visits: number
  new_clients: number
  returning_clients: number
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}

function mapApiToChartData(apiData: VisitsChartDataPoint[]): Array<{ name: string; value: number }> {
  return apiData.map(({ date, visits }) => ({
    name: formatDateLabel(date),
    value: visits,
  }))
}

const monthlyData = [
  { name: 'Jan', value: 30 },
  { name: 'Fev', value: 25 },
  { name: 'Mar', value: 45 },
  { name: 'Abr', value: 50 },
  { name: 'Mai', value: 55 },
  { name: 'Jun', value: 15 },
  { name: 'Jul', value: 10 },
  { name: 'Ago', value: 75 },
  { name: 'Set', value: 40 },
  { name: 'Out', value: 30 },
  { name: 'Nov', value: 25 },
  { name: 'Dez', value: 20 },
]

const weeklyData = [
  { name: 'Sem 1', value: 18 },
  { name: 'Sem 2', value: 32 },
  { name: 'Sem 3', value: 25 },
  { name: 'Sem 4', value: 28 },
]

const dailyData = [
  { name: 'Seg', value: 8 },
  { name: 'Ter', value: 12 },
  { name: 'Qua', value: 10 },
  { name: 'Qui', value: 15 },
  { name: 'Sex', value: 18 },
  { name: 'Sáb', value: 9 },
  { name: 'Dom', value: 5 },
]

const DATA_MAP: Record<ChartViewMode, typeof monthlyData> = {
  dia: dailyData,
  semana: weeklyData,
  mes: monthlyData,
}

interface VisitsChartProps {
  className?: string
  
  data?: VisitsChartDataPoint[] | null
}

export function VisitsChart({ className, data: apiData }: VisitsChartProps) {
  const { view, setView, data: mockData, options } = useChartView(DATA_MAP, 'mes')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const data = apiData?.length ? mapApiToChartData(apiData) : mockData

  return (
    <ChartCard
      title="Visita do site total"
      subtitle="Visitas e horários"
      className={className}
      headerRight={
        <ChartViewSwitcher view={view} onViewChange={setView} options={options} />
      }
    >
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          onMouseMove={(state) => {
            if (state?.activeTooltipIndex !== undefined) {
              setActiveIndex(Number(state.activeTooltipIndex))
            }
          }}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? gridStroke.dark : gridStroke.light}
            vertical={false}
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={(props) => {
              const { x, y, payload, index } = props as {
                x: number
                y: number
                payload: { value: string }
                index: number
              }
              const fillColor = index === activeIndex ? '#FFCC93' : (isDark ? tickFill.dark : tickFill.light)
              return (
                <text
                  x={x}
                  y={y + 12}
                  textAnchor="middle"
                  fontSize={11}
                  fill={fillColor}
                  fontWeight={index === activeIndex ? 600 : 400}
                >
                  {payload.value}
                </text>
              )
            }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: isDark ? tickFill.dark : tickFill.light, fontSize: 11 }}
          />
          <Tooltip
            cursor={false}
            contentStyle={{
              backgroundColor: isDark ? '#1A1B1D' : '#fff',
              border: isDark ? '1px solid #40485A' : '1px solid #E5E7EB',
              borderRadius: '8px',
            }}
            labelStyle={{ color: isDark ? '#8a94a6' : '#727B8E' }}
            itemStyle={{ color: isDark ? '#e8ecf1' : '#434A57' }}
          />
          <ReferenceLine
            y={80}
            stroke="#1E62EC"
            strokeDasharray="5 5"
            strokeOpacity={0.5}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === activeIndex ? '#1E62EC' : '#B8CCF5'}
                style={{ transition: 'fill 0.15s ease' }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
