import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-[4px] font-sans text-base font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E62EC]/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary: 'bg-[#1E62EC] text-white hover:bg-[#1A56D4] dark:bg-[#2172e5] dark:hover:bg-[#1a5fcc]',
        outline:
          'border border-[#727B8E]/10 bg-white text-[#202026] hover:bg-gray-50 dark:border-[#40485A] dark:bg-transparent dark:text-[#f5f9fc] dark:hover:bg-[#212225]',
        ghost: 'text-[#727B8E] hover:text-[#3F4655] hover:bg-gray-50 dark:text-[#8a94a6] dark:hover:text-[#f5f9fc] dark:hover:bg-[#212225]',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-[52px] px-6 text-base',
        lg: 'h-14 px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { buttonVariants }
