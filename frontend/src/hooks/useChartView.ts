import { useState } from 'react'

export type ChartViewMode = 'dia' | 'semana' | 'mes'

export interface ChartViewOption {
  key: ChartViewMode
  label: string
}

export const CHART_VIEW_OPTIONS: ChartViewOption[] = [
  { key: 'dia', label: 'Dia' },
  { key: 'semana', label: 'Semana' },
  { key: 'mes', label: 'Mês' },
]

export function useChartView<T>(
  dataMap: Record<ChartViewMode, T[]>,
  defaultView: ChartViewMode = 'mes'
) {
  const [view, setView] = useState<ChartViewMode>(defaultView)

  return {
    view,
    setView,
    data: dataMap[view],
    options: CHART_VIEW_OPTIONS,
  }
}
