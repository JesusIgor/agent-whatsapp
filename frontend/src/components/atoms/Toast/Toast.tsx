import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/cn'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastProps {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const STYLES = {
  success: {
    container: 'bg-[#D4F3D6] border-[#3CD057]/36 dark:bg-[#1a3a1f] dark:border-[#3CD057]/50',
    icon: 'text-[#3CD057]',
    title: 'text-[#2a8a3f] dark:text-[#4ade80]',
    message: 'text-[#2a8a3f]/80 dark:text-[#4ade80]/80',
  },
  error: {
    container: 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800/50',
    icon: 'text-red-600 dark:text-red-400',
    title: 'text-red-800 dark:text-red-300',
    message: 'text-red-700 dark:text-red-400',
  },
  warning: {
    container: 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800/50',
    icon: 'text-amber-600 dark:text-amber-400',
    title: 'text-amber-800 dark:text-amber-300',
    message: 'text-amber-700 dark:text-amber-400',
  },
  info: {
    container: 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800/50',
    icon: 'text-blue-600 dark:text-blue-400',
    title: 'text-blue-800 dark:text-blue-300',
    message: 'text-blue-700 dark:text-blue-400',
  },
}

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const Icon = ICONS[type]
  const styles = STYLES[type]

  useEffect(() => {
    if (duration <= 0) return

    const timer = setTimeout(() => {
      onClose(id)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        'flex items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm',
        'min-w-[320px] max-w-[420px] relative',
        styles.container
      )}
    >
      <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', styles.icon)} strokeWidth={2} />

      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-semibold', styles.title)}>{title}</p>
        {message && (
          <p className={cn('mt-1 text-xs', styles.message)}>{message}</p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onClose(id)}
        className={cn(
          'shrink-0 rounded p-1 transition-colors',
          'hover:bg-black/5 dark:hover:bg-white/5',
          styles.icon
        )}
        aria-label="Fechar"
      >
        <X className="h-4 w-4" strokeWidth={2} />
      </button>
    </motion.div>
  )
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        <div className="pointer-events-auto">{children}</div>
      </AnimatePresence>
    </div>
  )
}
