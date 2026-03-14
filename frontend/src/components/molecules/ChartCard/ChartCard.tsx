import { cn } from '@/lib/cn'

export interface ChartCardProps {
  title: string
  subtitle?: string
  subtitleClassName?: string
  headerRight?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function ChartCard({
  title,
  subtitle,
  subtitleClassName,
  headerRight,
  children,
  className,
}: ChartCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-[#727B8E1A] bg-white dark:border-[#40485A] dark:bg-[#1A1B1D] p-4 backdrop-blur-[6px]',
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-[#434A57] dark:text-[#f5f9fc]">{title}</h3>
          {subtitle && (
            <p className={cn('text-xs text-[#727B8E] dark:text-[#8a94a6]', subtitleClassName)}>
              {subtitle}
            </p>
          )}
        </div>
        {headerRight}
      </div>
      {children}
    </div>
  )
}
