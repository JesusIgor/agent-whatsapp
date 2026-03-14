import { forwardRef } from 'react'
import { Input, type InputProps } from '@/components/atoms/Input'

export interface FormFieldProps extends InputProps {
  label: string
  error?: string
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, id, ...props }, ref) => {
    return (
      <Input
        id={id}
        label={label}
        error={error}
        ref={ref}
        {...props}
      />
    )
  }
)

FormField.displayName = 'FormField'
