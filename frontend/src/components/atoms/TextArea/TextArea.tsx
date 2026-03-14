import { forwardRef } from 'react'

import { cn } from '@/lib/cn'

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'flex min-h-[80px] w-full resize-none rounded-[4px] border bg-[#FAFAFA] dark:bg-[#212225] dark:border-[#40485A] px-[19px] py-[13px]',
          'font-be-vietnam-pro text-sm text-[#434A57] dark:text-[#f5f9fc] placeholder:text-[#727B8E]/50 dark:placeholder:text-[#8a94a6]/70',
          'outline-none transition-colors',
          'focus:border-[#1E62EC] focus:ring-1 focus:ring-[#1E62EC]/30',
          error ? 'border-red-500' : 'border-[#727B8E]/10 dark:border-[#40485A]',
          className
        )}
        {...props}
      />
    )
  }
)

TextArea.displayName = 'TextArea'
