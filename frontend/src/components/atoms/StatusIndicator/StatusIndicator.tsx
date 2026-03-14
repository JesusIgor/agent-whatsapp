import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const statusIndicatorVariants = cva(
  'rounded-full flex-shrink-0',
  {
    variants: {
      status: {
        online: 'bg-[#3DCA21]',
        offline: 'bg-[#C0C7D3]',
      },
      size: {
        sm: 'h-2 w-2',
        md: 'h-3 w-3',
      },
    },
    defaultVariants: {
      status: 'offline',
      size: 'md',
    },
  }
)

export interface StatusIndicatorProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusIndicatorVariants> {}

export function StatusIndicator({
  className,
  status,
  size,
  ...props
}: StatusIndicatorProps) {
  return (
    <span
      className={cn(statusIndicatorVariants({ status, size, className }))}
      aria-label={status === 'online' ? 'Online' : 'Offline'}
      {...props}
    />
  )
}
