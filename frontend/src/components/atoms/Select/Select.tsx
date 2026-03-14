import { forwardRef, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  required?: boolean
  options: SelectOption[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, label, error, required, options, placeholder, id, ...props },
    ref
  ) => {
    return (
      <div className="flex w-full flex-col gap-3">
        {label && (
          <label
            htmlFor={id}
            className="font-be-vietnam-pro text-base font-semibold leading-[23px] text-[#434A57] dark:text-[#f5f9fc]"
          >
            {label}
            {required && <span className="text-[#1E62EC]">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={id}
            className={cn(
              'flex h-[47px] w-full appearance-none rounded-[4px] border bg-[#FAFAFA] dark:bg-[#212225] dark:border-[#40485A] px-[19px] py-[13px] pr-10',
              'font-be-vietnam-pro text-sm font-normal leading-5 text-[#434A57] dark:text-[#f5f9fc]',
              'outline-none transition-colors',
              'focus:border-[#1E62EC] focus:ring-1 focus:ring-[#1E62EC]/30',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error
                ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30'
                : 'border-[#727B8E]/10 dark:border-[#40485A]',
              className
            )}
            ref={ref}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-[19px] top-1/2 h-4 w-4 -translate-y-1/2 text-[#727B8E] dark:text-[#8a94a6]" />
        </div>
        {error && (
          <p className="font-be-vietnam-pro text-xs text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
