import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useTheme } from '@/contexts/ThemeContext'

export interface SalesChartDataPoint {
  service: string
  sales: number
  revenue: number
}

function mapApiToChartData(apiData: SalesChartDataPoint[]): Array<{ name: string; value: number }> {
  return apiData.map(({ service, sales }) => ({
    name: service,
    value: sales,
  }))
}

const defaultData = [
  { name: 'Jan', value: 20 },
  { name: 'Fev', value: 15 },
  { name: 'Mar', value: 10 },
  { name: 'Abr', value: 40 },
  { name: 'Mai', value: 55 },
  { name: 'Jun', value: 45 },
]

const gridStroke = { light: '#E5E7EB', dark: '#40485A' }
const tickFill = { light: '#727B8E', dark: '#8a94a6' }

interface SalesChartProps {
  className?: string
  
  data?: SalesChartDataPoint[] | null
}

export function SalesChart({ className, data: apiData }: SalesChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const data = apiData?.length ? mapApiToChartData(apiData) : defaultData

  return (
    <div className={cn(
      "rounded-lg border border-[#727B8E1A] bg-white p-4 backdrop-blur-[6px]",
      "dark:border-[#40485A] dark:bg-[#1A1B1D]",
      className
    )}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-[#434A57] dark:text-[#f5f9fc]">Vendas</h3>
        <div className="rounded-md bg-[#1E62EC]/10 p-1.5 text-[#1E62EC] dark:bg-[#2172e5]/20 dark:text-[#6ba3f7]">
          <Calendar className="h-3.5 w-3.5" />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
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
          <Line
            type="monotone"
            dataKey="value"
            stroke="#1E62EC"
            strokeWidth={2}
            dot={{ fill: '#1E62EC', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#1E62EC' }}
            strokeDasharray="6 3"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
