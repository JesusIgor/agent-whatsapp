import { SectionLabel } from '@/components/atoms/SectionLabel'
import { cn } from '@/lib/cn'

interface SectionHeaderProps {
  label: string
  className?: string
  description?: string
  titleMaxWidth?: string
  title: React.ReactNode
  align?: 'left' | 'center'
  titleColor?: 'dark' | 'white'
}

export function SectionHeader({
  label,
  title,
  className,
  description,
  titleMaxWidth,
  align = 'left',
  titleColor = 'dark',
}: SectionHeaderProps) {
  const isWhite = titleColor === 'white'

  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      <SectionLabel>
        {label}
      </SectionLabel>
      <h2
        className={cn(
          'text-[32px] font-sans font-bold leading-tight',
          isWhite ? 'text-white' : 'text-[#070707]',
        )}
        style={{ letterSpacing: 'var(--tracking-heading)', maxWidth: titleMaxWidth }}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'text-base font-sans leading-relaxed',
            isWhite ? 'text-white/50' : 'text-[#727B8E]',
            align === 'left' ? 'max-w-[720px]' : 'max-w-[600px]',
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}
