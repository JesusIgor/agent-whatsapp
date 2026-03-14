import { cn } from '@/lib/cn'
import { Icon } from '@/components/atoms/Icon'

export interface ComparisonCardProps {
  title: string
  items: string[]
  variant: 'without' | 'with'
}

export function ComparisonCard({ title, items, variant }: ComparisonCardProps) {
  const isWith = variant === 'with'

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-[#727B8E1A] bg-[#24242A] p-6">
      <h3
        className="text-2xl font-bold leading-[42px] text-white"
        style={{ letterSpacing: 'var(--tracking-heading)' }}
      >
        {title}
      </h3>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-2">
            {isWith ? (
              <Icon name="check_circle" width={13} height={13} />
            ) : (
              <Icon name="close_circle" width={13} height={13} />
            )}
            <span
              className={cn(
                'text-base leading-[27px] text-[#727B8E]',
              )}
            >
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
