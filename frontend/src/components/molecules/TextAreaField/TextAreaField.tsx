import { forwardRef } from 'react'

import { TextArea, type TextAreaProps } from '@/components/atoms/TextArea'

export interface TextAreaFieldProps extends Omit<TextAreaProps, 'error'> {
  id: string
  label: string
  required?: boolean
  error?: string
}

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ id, label, required, error, ...props }, ref) => {
    return (
      <div className="flex w-full flex-col gap-3">
        <label
          htmlFor={id}
          className="font-be-vietnam-pro text-base font-semibold leading-[23px] text-[#434A57]"
        >
          {label}
          {required && <span className="text-[#1E62EC]">*</span>}
        </label>
        <TextArea ref={ref} id={id} error={!!error} {...props} />
        {error && (
          <p className="font-be-vietnam-pro text-xs text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

TextAreaField.displayName = 'TextAreaField'
