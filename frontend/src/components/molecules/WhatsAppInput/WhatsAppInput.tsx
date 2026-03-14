import { useState, useRef, KeyboardEvent } from 'react'
import { Smile, Paperclip, Send, Mic } from 'lucide-react'
import { cn } from '@/lib/cn'

interface WhatsAppInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onAttach?: () => void
  onEmojiClick?: () => void
  onMicClick?: () => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function WhatsAppInput({
  value,
  onChange,
  onSend,
  onAttach,
  onEmojiClick,
  onMicClick,
  disabled = false,
  placeholder = 'Digite uma mensagem',
  className = '',
}: WhatsAppInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim()) {
        onSend()
      }
    }
  }

  const handleSendClick = () => {
    if (value.trim()) {
      onSend()
    }
  }

  return (
    <div className={cn('bg-[#F0F2F5] dark:bg-[#202C33] border-t border-gray-200 dark:border-gray-700 px-4 py-3', className)}>
      <div className="flex items-center gap-2">
        {}
        <button
          onClick={onEmojiClick}
          className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors flex-shrink-0"
          title="Emoji"
          disabled={disabled}
        >
          <Smile className="w-5 h-5" />
        </button>

        {}
        {onAttach && (
          <button
            onClick={onAttach}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors flex-shrink-0"
            title="Anexar arquivo"
            disabled={disabled}
          >
            <Paperclip className="w-5 h-5" />
          </button>
        )}

        {}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'w-full px-4 py-2.5 rounded-lg bg-white dark:bg-[#2A3942] border transition-colors',
              isFocused
                ? 'border-[#25D366] ring-1 ring-[#25D366]'
                : 'border-gray-200 dark:border-gray-600',
              'focus:outline-none disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed',
              'text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400'
            )}
          />
        </div>

        {}
        <button
          onClick={value.trim() ? handleSendClick : onMicClick}
          className={cn(
            'p-2.5 rounded-full transition-all flex-shrink-0',
            value.trim()
              ? 'bg-[#25D366] text-white hover:bg-[#128C7E]'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          )}
          title={value.trim() ? 'Enviar' : 'Áudio'}
          disabled={disabled}
        >
          {value.trim() ? <Send className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
      </div>
    </div>
  )
}
