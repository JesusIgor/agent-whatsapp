import { useRef } from 'react'
import { MessageSquare } from 'lucide-react'
import type { PipelineCard as PipelineCardType } from '@/data/pipeline'
import { cn } from '@/lib/cn'

interface PipelineCardProps {
  card: PipelineCardType
  isDragging?: boolean
  onDragStart?: (e: React.DragEvent) => void
  onDragEnd?: (e: React.DragEvent) => void
  onCardClick?: (cardId: string) => void
  animationDelay?: number
}

export function PipelineCard({
  card,
  isDragging,
  onDragStart,
  onDragEnd,
  onCardClick,
  animationDelay = 0,
}: PipelineCardProps) {
  const didDragRef = useRef(false)

  const handleDragStart = (e: React.DragEvent) => {
    didDragRef.current = true
    onDragStart?.(e)
  }

  const handleDragEnd = (e: React.DragEvent) => {
    onDragEnd?.(e)
    setTimeout(() => {
      didDragRef.current = false
    }, 0)
  }

  const handleClick = (e: React.MouseEvent) => {
    if (didDragRef.current) return
    e.stopPropagation()
    onCardClick?.(card.id)
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      role={onCardClick ? 'button' : undefined}
      style={{ animationDelay: `${animationDelay}ms` }}
      className={cn(
        'animate-fade-in group cursor-grab rounded-xl border border-[#727B8E]/10 bg-white dark:border-[#40485A] dark:bg-[#1A1B1D] p-3 shadow-sm transition-all duration-200 ease-out hover:scale-[1.02] hover:border-[#727B8E]/20 hover:shadow-md dark:hover:border-[#212225] active:cursor-grabbing',
        onCardClick && 'cursor-pointer',
        isDragging && 'opacity-50 scale-95'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4F6F9] dark:bg-[#3A4150] text-xs font-semibold text-[#727B8E] dark:text-[#f5f9fc]">
          {card.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#434A57] dark:text-[#f5f9fc]">{card.name}</p>
          <p className="text-xs text-[#727B8E] dark:text-[#8a94a6]">{card.pets}</p>
        </div>
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-[#434A57] dark:text-[#e8ecf1]">{card.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-[#727B8E] dark:text-[#8a94a6]">{card.time}</span>
        <MessageSquare className="h-4 w-4 text-[#727B8E]/60 dark:text-[#8a94a6]/60" strokeWidth={1.5} />
      </div>
    </div>
  )
}
