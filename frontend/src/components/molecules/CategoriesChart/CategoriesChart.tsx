import { useState, useCallback, useMemo } from 'react'
import { PieChart, Pie, Cell, Sector, ResponsiveContainer } from 'recharts'
import type { PieSectorDataItem } from 'recharts/types/polar/Pie'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface CategoriesChartDataPoint {
  category: string
  value: number
  percentage: number
}

const CATEGORY_COLORS = ['#1E4DB5', '#1E62EC', '#00B5D8', '#38B2AC', '#319795', '#2C7A7B']

const defaultData = [
  { name: 'N/A', value: 65, color: '#1E4DB5' },
  { name: 'N/A', value: 34, color: '#1E62EC' },
  { name: 'N/A', value: 45, color: '#00B5D8' },
  { name: 'N/A', value: 12, color: '#38B2AC' },
]

function mapApiToChartData(apiData: CategoriesChartDataPoint[]): Array<{ name: string; value: number; color: string }> {
  return apiData.map((item, i) => ({
    name: item.category,
    value: item.value,
    color: CATEGORY_COLORS[i % CATEGORY_COLORS.length]!,
  }))
}

const RADIAN = Math.PI / 180

function ActiveShape(
  props: PieSectorDataItem,
  total: number
) {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    value,
  } = props as {
    cx: number
    cy: number
    innerRadius: number
    outerRadius: number
    startAngle: number
    endAngle: number
    fill: string
    value: number
  }

  const midAngle = (startAngle + endAngle) / 2
  const isHorizontal = Math.abs(Math.cos(midAngle * RADIAN)) > Math.abs(Math.sin(midAngle * RADIAN))
  const expandedOuter = (outerRadius as number) + (isHorizontal ? 20 : 8)
  const tooltipRadius = expandedOuter + 20
  const tx = cx + tooltipRadius * Math.cos(-midAngle * RADIAN)
  const ty = cy + tooltipRadius * Math.sin(-midAngle * RADIAN)
  const percent = total > 0 ? ((Number(value) / total) * 100).toFixed(2) : '0'

  const labelW = 56
  const labelH = 22
  const labelR = 6

  const activeInner = innerRadius - 4
  const activeOuter = outerRadius + 10
  const cr = 10

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={activeInner}
        outerRadius={activeOuter}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="none"
        cornerRadius={cr}
        style={{ filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.15))' }}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={activeInner}
        outerRadius={activeInner + cr + 4}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="none"
      />
      <g>
        <rect
          x={tx - labelW / 2}
          y={ty - labelH / 2}
          width={labelW}
          height={labelH}
          rx={labelR}
          ry={labelR}
          fill={fill}
        />
        <text
          x={tx}
          y={ty}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#fff"
          fontSize={11}
          fontWeight={600}
        >
          {percent}%
        </text>
      </g>
    </g>
  )
}

function InactiveShape(props: PieSectorDataItem) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props as {
      cx: number
      cy: number
      innerRadius: number
      outerRadius: number
      startAngle: number
      endAngle: number
      fill: string
    }

  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      stroke="none"
    />
  )
}

interface CategoriesChartProps {
  className?: string
  
  data?: CategoriesChartDataPoint[] | null
}

export function CategoriesChart({ className, data: apiData }: CategoriesChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)
  const data = useMemo(
    () => (apiData?.length ? mapApiToChartData(apiData) : defaultData),
    [apiData]
  )
  const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data])

  const onPieEnter = useCallback((_: unknown, index: number) => {
    setActiveIndex(index)
  }, [])

  const onPieLeave = useCallback(() => {
    setActiveIndex(undefined)
  }, [])

  return (
    <div className={cn(
      "overflow-visible rounded-lg border border-[#727B8E1A] bg-white p-4 backdrop-blur-[6px]",
      "dark:border-[#40485A] dark:bg-[#1A1B1D]",
      className
    )}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-[#434A57] dark:text-[#f5f9fc]">Categorias</h3>
        <div className="rounded-md bg-[#1E62EC]/10 p-1.5 text-[#1E62EC] dark:bg-[#2172e5]/20 dark:text-[#6ba3f7]">
          <Calendar className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="flex flex-col items-center overflow-visible">
        <div className="relative h-[220px] w-[220px] [&_svg]:overflow-visible! [&_.recharts-responsive-container]:overflow-visible! [&_.recharts-wrapper]:overflow-visible!">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart style={{ overflow: 'visible' }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={0}
                dataKey="value"
                activeShape={(props) => ActiveShape(props, total)}
                inactiveShape={InactiveShape}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="none"
                    style={{
                      cursor: 'pointer',
                      opacity: activeIndex !== undefined && activeIndex !== index ? 0.6 : 1,
                      transition: 'opacity 0.3s ease',
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[#434A57] dark:text-[#f5f9fc]">{total}</span>
            <span className="text-xs text-[#727B8E] dark:text-[#8a94a6]">Total</span>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-[#727B8E] dark:text-[#8a94a6]">
          {data.map((item, i) => {
            const pct = total > 0 ? ((item.value / total) * 100).toFixed(0) : '0'
            return (
            <div
              key={i}
              className="flex cursor-pointer items-center gap-1.5 transition-opacity"
              style={{
                opacity: activeIndex !== undefined && activeIndex !== i ? 0.4 : 1,
              }}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(undefined)}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: item.color }}
              />
              {item.name} {pct}%
            </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
