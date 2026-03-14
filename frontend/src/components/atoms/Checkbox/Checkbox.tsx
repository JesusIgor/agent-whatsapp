import { forwardRef } from 'react'

import { cn } from '@/lib/cn'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            className={cn(
              'h-[18px] w-[18px] shrink-0 cursor-pointer rounded-[3px] border bg-[#FAFAFA] dark:bg-[#212225] dark:border-[#40485A] accent-[#1E62EC]',
              error ? 'border-red-500' : 'border-[#727B8E]/20',
              className
            )}
            {...props}
          />
          {label && (
            <span className="font-be-vietnam-pro text-sm leading-5 text-[#727B8E] dark:text-[#8a94a6]">{label}</span>
          )}
        </label>
        {error && (
          <p className="font-be-vietnam-pro text-xs text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'
