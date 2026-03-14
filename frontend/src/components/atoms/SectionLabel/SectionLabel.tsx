import { cn } from '@/lib/cn'

interface SectionLabelProps {
  children: React.ReactNode
  className?: string
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <span
      className={cn(
        'font-manrope text-xs font-extrabold uppercase tracking-[3px] text-[#1E62EC]',
        className,
      )}
    >
      {children}
    </span>
  )
}
