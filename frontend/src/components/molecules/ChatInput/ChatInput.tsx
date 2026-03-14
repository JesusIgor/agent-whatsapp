import { useState, useCallback, type KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useFileUpload, type UploadedFile } from '@/hooks/useFileUpload'

export interface ChatInputProps {
  onSend?: (message: string, files?: UploadedFile[]) => void
  onAttach?: () => void
  onVoice?: () => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

function EmojiIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="7" cy="8" r="1" fill="currentColor" />
      <circle cx="13" cy="8" r="1" fill="currentColor" />
      <path
        d="M6 12C6.5 13.5 8 14.5 10 14.5C12 14.5 13.5 13.5 14 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function AttachIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M17.5 9.31L10.12 16.69C8.56 18.25 6.06 18.25 4.5 16.69C2.94 15.13 2.94 12.63 4.5 11.07L11.17 4.4C12.22 3.35 13.92 3.35 14.97 4.4C16.02 5.45 16.02 7.15 14.97 8.2L8.29 14.88C7.76 15.41 6.91 15.41 6.38 14.88C5.85 14.35 5.85 13.5 6.38 12.97L12.34 7.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="7"
        y="2"
        width="6"
        height="10"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M4 9C4 12.3137 6.68629 15 10 15C13.3137 15 16 12.3137 16 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M10 15V18M10 18H7M10 18H13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M18.3337 1.66666L9.16699 10.8333"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3337 1.66666L12.5003 18.3333L9.16699 10.8333L1.66699 7.49999L18.3337 1.66666Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function FilePreviewItem({ file, onRemove }: { file: UploadedFile; onRemove: () => void }) {
  const isImage = file.type.startsWith('image/')

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="relative group"
    >
      <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#727B8E]/20 dark:border-[#40485A] bg-[#F4F6F9] dark:bg-[#212225]">
        {isImage && file.preview ? (
          <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="w-5 h-5 text-[#727B8E] dark:text-[#8a94a6]" />
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </motion.div>
  )
}

export function ChatInput({
  onSend,
  onAttach,
  onVoice,
  placeholder = 'Digite uma mensagem...',
  className,
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState('')

  const { files, addFiles, removeFile, clearFiles, openFilePicker, inputRef, getAcceptedTypesString } = useFileUpload({
    maxFiles: 5,
    onError: () => {},
  })

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files)
      e.target.value = ''
    }
  }, [addFiles])

  const handleSend = () => {
    if (disabled) return
    const hasMessage = message.trim()
    const hasFiles = files.length > 0

    if ((hasMessage || hasFiles) && onSend) {
      onSend(message.trim(), hasFiles ? files : undefined)
      setMessage('')
      clearFiles()
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleAttachClick = () => {
    openFilePicker()
    onAttach?.()
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={getAcceptedTypesString()}
        onChange={handleFileChange}
        className="hidden"
      />

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 px-1"
          >
            {files.map((file) => (
              <FilePreviewItem
                key={file.id}
                file={file}
                onRemove={() => removeFile(file.id)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-[#727B8E]/10 bg-white dark:border-[#40485A] dark:bg-[#1A1B1D] px-4 py-3">
          <button
            type="button"
            disabled={disabled}
            className="flex-shrink-0 text-[#727B8E] dark:text-[#8a94a6] transition-colors hover:text-[#434A57] dark:hover:text-[#f5f9fc] disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Adicionar emoji"
          >
            <EmojiIcon className="h-5 w-5" />
          </button>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 bg-transparent text-sm text-[#434A57] dark:text-[#f5f9fc] placeholder:text-[#727B8E] dark:placeholder:text-[#8a94a6] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />

          <button
            type="button"
            onClick={handleAttachClick}
            disabled={disabled}
            className="flex-shrink-0 text-[#727B8E] dark:text-[#8a94a6] transition-colors hover:text-[#434A57] dark:hover:text-[#f5f9fc] disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Anexar arquivo"
          >
            <AttachIcon className="h-5 w-5" />
          </button>
        </div>

        {message.trim() || files.length > 0 ? (
          <button
            type="button"
            onClick={handleSend}
            disabled={disabled}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1E62EC] dark:bg-[#2172e5] text-white transition-colors hover:bg-[#1A56D4] dark:hover:bg-[#1a5fcc] disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Enviar mensagem"
          >
            <SendIcon className="h-5 w-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onVoice}
            disabled={disabled}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1E62EC] dark:bg-[#2172e5] text-white transition-colors hover:bg-[#1A56D4] dark:hover:bg-[#1a5fcc] disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Gravar áudio"
          >
            <MicIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  )
}
