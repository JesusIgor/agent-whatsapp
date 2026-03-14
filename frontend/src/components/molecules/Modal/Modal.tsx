import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/atoms/Button'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  onSubmit?: () => void
  submitText?: string
  cancelText?: string
  isLoading?: boolean
  className?: string
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitText = 'Cadastrar',
  cancelText = 'Cancelar',
  isLoading = false,
  className,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const overlay = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end justify-center p-0 backdrop-blur-sm sm:items-center sm:p-4 animate-backdrop"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      <div
        className={cn(
          'w-full max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white dark:bg-[#1A1B1D] shadow-xl sm:max-h-none sm:rounded-2xl animate-scale-in',
          className
        )}
      >
        <div className="flex items-center justify-between border-b border-[#727B8E]/10 dark:border-[#40485A] px-4 py-3 sm:px-6 sm:py-4">
          <h2 className="text-base font-semibold text-[#434A57] dark:text-[#f5f9fc]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#727B8E] transition-colors hover:bg-[#F4F6F9] hover:text-[#434A57] dark:text-[#8a94a6] dark:hover:bg-[#212225] dark:hover:text-[#f5f9fc]"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 py-3 sm:px-6 sm:py-4">{children}</div>

        {onSubmit && (
          <div className="flex gap-3 border-t border-[#727B8E]/10 dark:border-[#40485A] px-4 py-3 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:px-6 sm:py-4 sm:pb-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button
              onClick={onSubmit}
              className="flex-1"
              loading={isLoading}
            >
              {submitText}
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  if (typeof document !== 'undefined') {
    return createPortal(overlay, document.body)
  }
  return overlay
}
