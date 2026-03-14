import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  required?: boolean
  iconLeft?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, required, iconLeft, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type

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
          {iconLeft && (
            <div className="pointer-events-none absolute left-[19px] top-1/2 -translate-y-1/2 text-[#727B8E] dark:text-[#8a94a6]">
              {iconLeft}
            </div>
          )}
          <input
            id={id}
            type={inputType}
            className={cn(
              'flex h-[47px] w-full rounded-[4px] border px-[19px] py-[13px]',
              'bg-white font-be-vietnam-pro text-sm font-normal leading-5 text-[#434A57]',
              'placeholder:text-[#727B8E]/50',
              'dark:bg-surface-elevated dark:border-(--border) dark:text-foreground dark:placeholder:text-text-muted/70',
              'outline-none transition-colors',
              'focus:border-[#1E62EC] focus:ring-1 focus:ring-[#1E62EC]/30 dark:focus:border-[#2172e5] dark:focus:ring-[#2172e5]/30',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error
                ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30'
                : 'border-[#727B8E]/10 dark:border-(--border)',
              iconLeft && 'pl-12',
              isPassword && 'pr-12',
              className
            )}
            ref={ref}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              className="absolute right-[19px] top-1/2 -translate-y-1/2 text-[#727B8E]/50 hover:text-[#434A57] dark:text-[#8a94a6]/70 dark:hover:text-[#f5f9fc] transition-colors"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? (
                <EyeOff className="h-[18px] w-[18px]" />
              ) : (
                <Eye className="h-[18px] w-[18px]" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="font-be-vietnam-pro text-xs text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
