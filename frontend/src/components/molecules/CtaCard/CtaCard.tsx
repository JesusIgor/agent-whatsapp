import { cn } from '@/lib/cn'

export interface CtaCardProps {
  title?: string
  buttonText?: string
  className?: string
  onClick?: () => void
}

export function CtaCard({
  title = 'Nós cuidamos da sua agenda, enquanto você cuida dos pets',
  buttonText = 'Fale com a IA',
  className,
  onClick,
}: CtaCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-6 rounded-[24px_0px_24px_24px] bg-[#1E62EC] px-4 py-[93px]',
        className
      )}
    >
      <h2 className="max-w-[449px] text-center text-[32px] font-semibold leading-[39px] tracking-[-1.92px] text-[#FAFAFA]">
        {title}
      </h2>
      <button
        onClick={onClick}
        aria-label={buttonText}
        className="flex w-full max-w-[406px] items-center justify-center gap-2 rounded-lg bg-[#202026] px-3 py-3 transition-opacity hover:opacity-90"
      >
        <span className="text-base font-normal leading-[22px] tracking-[-0.32px] text-white">
          {buttonText}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="-rotate-45"
        >
          <path
            d="M1 6H11M11 6L6 1M11 6L6 11"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}
