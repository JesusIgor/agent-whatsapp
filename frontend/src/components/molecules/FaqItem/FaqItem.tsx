import { forwardRef } from 'react'

import { cn } from '@/lib/cn'

export interface FaqItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  question: string
  answer?: string
  isExpanded?: boolean
  isExpandable?: boolean
}

export const FaqItem = forwardRef<HTMLButtonElement, FaqItemProps>(
  (
    { className, question, answer, isExpandable = true, isExpanded = false, ...props },
    ref
  ) => {
    return (
      <div className="flex flex-col">
        <button
          ref={ref}
          className={cn(
            'flex w-fit flex-row items-center justify-center gap-2 rounded-[0px_14px_14px_14px] px-3.5 py-3.5 transition-colors',
            'bg-[#29292D] text-white',
            isExpanded && 'bg-[#1E61EA]',
            className
          )}
          aria-expanded={isExpandable ? isExpanded : undefined}
          {...props}
        >
          <span className="flex-1 text-left text-base font-light leading-[23px] tracking-[-0.36px]">
            {question}
          </span>
          {isExpandable && (
            <svg
              width="10"
              height="5"
              viewBox="0 0 10 5"
              fill="none"
              aria-hidden="true"
              className={cn(
                'shrink-0 transition-transform duration-300',
                isExpanded && 'rotate-180'
              )}
            >
              <path
                d="M1 1L5 4L9 1"
                stroke="currentColor"
                strokeWidth="1.32"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        {answer && (
          <div
            className={cn(
              'grid w-fit transition-all duration-300 ease-in-out',
              isExpanded
                ? 'mt-2 grid-rows-[1fr] opacity-100'
                : 'mt-0 grid-rows-[0fr] opacity-0'
            )}
          >
            <div className="overflow-hidden">
              <div className="rounded-[14px_0_14px_14px] bg-white px-3.5 py-3.5 text-[#29292D]">
                <p className="text-start text-sm font-light leading-relaxed">{answer}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
)

FaqItem.displayName = 'FaqItem'
