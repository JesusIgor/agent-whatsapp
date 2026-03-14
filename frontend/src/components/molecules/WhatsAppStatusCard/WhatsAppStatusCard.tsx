import { Smartphone, Wifi, WifiOff, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/cn'

type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error'

interface WhatsAppStatusCardProps {
  status: ConnectionStatus
  phoneNumber?: string
  lastSync?: string
  onReconnect?: () => void
  className?: string
}

const statusConfig = {
  connected: {
    icon: CheckCircle,
    label: 'Conectado',
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
  },
  disconnected: {
    icon: WifiOff,
    label: 'Desconectado',
    color: 'text-gray-500',
    bgColor: 'bg-gray-50 dark:bg-gray-800',
    borderColor: 'border-gray-200 dark:border-gray-700',
  },
  connecting: {
    icon: RefreshCw,
    label: 'Conectando...',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  error: {
    icon: XCircle,
    label: 'Erro de conexão',
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
  },
}

export function WhatsAppStatusCard({
  status,
  phoneNumber,
  lastSync,
  onReconnect,
  className = '',
}: WhatsAppStatusCardProps) {
  const config = statusConfig[status]
  const StatusIcon = config.icon

  const formatPhoneNumber = (phone?: string) => {
    if (!phone) return 'Não configurado'
    
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 13) {
      return `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 4)}) ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`
    }
    return phone
  }

  return (
    <div className={cn('rounded-lg border p-4', config.bgColor, config.borderColor, className)}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn('p-2 rounded-lg', config.bgColor)}>
            <Smartphone className={cn('w-6 h-6', config.color)} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">WhatsApp Business</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{formatPhoneNumber(phoneNumber)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusIcon className={cn('w-5 h-5', config.color, status === 'connecting' && 'animate-spin')} />
          <span className={cn('text-sm font-medium', config.color)}>{config.label}</span>
        </div>
      </div>

      {(lastSync || status !== 'connected') && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          {lastSync && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Última sincronização: {new Date(lastSync).toLocaleString('pt-BR')}
            </p>
          )}

          {status !== 'connected' && status !== 'connecting' && onReconnect && (
            <button
              onClick={onReconnect}
              className="px-3 py-1.5 text-sm font-medium text-[#25D366] hover:bg-[#25D366]/10 rounded-lg transition-colors"
            >
              Reconectar
            </button>
          )}
        </div>
      )}

      {status === 'connected' && (
        <div className="mt-4 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
          <Wifi className="w-4 h-4" />
          <span>Pronto para enviar e receber mensagens</span>
        </div>
      )}
    </div>
  )
}
