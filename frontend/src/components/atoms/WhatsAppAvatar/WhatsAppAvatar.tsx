import { User } from 'lucide-react'
import { cn } from '@/lib/cn'

interface WhatsAppAvatarProps {
  src?: string
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  status?: 'online' | 'offline'
  className?: string
}

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
}

const textSizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
}

const statusSizes = {
  sm: 'w-2.5 h-2.5 border',
  md: 'w-3 h-3 border-2',
  lg: 'w-3.5 h-3.5 border-2',
  xl: 'w-4 h-4 border-2',
}

export function WhatsAppAvatar({ src, name, size = 'md', status, className = '' }: WhatsAppAvatarProps) {
  const initials = name
    ? name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '?'

  return (
    <div className={cn('relative', sizes[size], className)}>
      <div
        className={cn(
          sizes[size],
          'rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center overflow-hidden'
        )}
      >
        {src ? (
          <img src={src} alt={name || 'Avatar'} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#25D366]/10 text-[#25D366]">
            {name ? (
              <span className={cn('font-semibold', textSizes[size])}>{initials}</span>
            ) : (
              <User className={size === 'sm' ? 'w-4 h-4' : size === 'xl' ? 'w-8 h-8' : 'w-5 h-5'} />
            )}
          </div>
        )}
      </div>

      {}
      {status && (
        <div
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-white dark:border-gray-800',
            statusSizes[size],
            status === 'online' ? 'bg-[#25D366]' : 'bg-gray-400'
          )}
        />
      )}
    </div>
  )
}
