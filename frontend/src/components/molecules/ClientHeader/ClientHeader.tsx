import { cn } from '@/lib/cn'
import { Button } from '@/components/atoms/Button'

export interface ClientHeaderProps {
  name: string
  phone?: string
  pets?: string
  onAddPet?: () => void
  className?: string
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function AuzapIcon({ className }: { className?: string }) {
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
        d="M10 2L3 6V14L10 18L17 14V6L10 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 8L7 10V14L10 16L13 14V10L10 8Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function ClientHeader({
  name,
  phone,
  pets,
  onAddPet,
  className,
}: ClientHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between border-b border-[#727B8E]/10 bg-white dark:border-[#40485A] dark:bg-[#1A1B1D] px-6 py-4',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F6F9] dark:bg-[#212225]">
          <span className="text-sm font-medium text-[#727B8E] dark:text-[#8a94a6]">
            {getInitials(name)}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-medium text-[#434A57] dark:text-[#f5f9fc]">{name}</span>
          <span className="text-xs text-[#727B8E] dark:text-[#8a94a6]">
            {[phone, pets].filter(Boolean).join(' • ')}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={onAddPet} size="sm" className="bg-[#0e1629] dark:bg-[#2172e5] text-white hover:opacity-90">
          <AuzapIcon className="h-4 w-4" />
          Novo Pet
        </Button>

        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#727B8E] transition-colors hover:bg-[#F4F6F9] hover:text-[#434A57] dark:text-[#8a94a6] dark:hover:bg-[#212225] dark:hover:text-[#f5f9fc]"
          aria-label="Ação 1"
        >
          <AuzapIcon className="h-5 w-5" />
        </button>

        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#727B8E] transition-colors hover:bg-[#F4F6F9] hover:text-[#434A57] dark:text-[#8a94a6] dark:hover:bg-[#212225] dark:hover:text-[#f5f9fc]"
          aria-label="Ação 2"
        >
          <AuzapIcon className="h-5 w-5" />
        </button>

        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#727B8E] transition-colors hover:bg-[#F4F6F9] hover:text-[#434A57] dark:text-[#8a94a6] dark:hover:bg-[#212225] dark:hover:text-[#f5f9fc]"
          aria-label="Ação 3"
        >
          <AuzapIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
