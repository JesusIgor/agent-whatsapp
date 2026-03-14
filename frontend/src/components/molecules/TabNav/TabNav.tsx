import { cn } from '@/lib/cn'

export interface Tab {
  id: string
  label: string
  count?: number
}

export interface TabNavProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
}

export function TabNav({ tabs, activeTab, onTabChange, className }: TabNavProps) {
  return (
    <div className={cn('flex items-center justify-center gap-1', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-white dark:bg-[#1A1B1D] text-[#434A57] dark:text-[#f5f9fc] shadow-sm dark:border dark:border-[#40485A]'
                : 'text-[#727B8E] dark:text-[#8a94a6] hover:text-[#434A57] dark:hover:text-[#f5f9fc]'
            )}
          >
            {tab.label}
            {tab.count !== undefined && ` (${tab.count})`}
          </button>
        )
      })}
    </div>
  )
}
