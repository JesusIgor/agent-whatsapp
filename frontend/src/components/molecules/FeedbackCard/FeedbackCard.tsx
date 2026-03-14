import { Play } from 'lucide-react'
import { RatingStars } from '@/components/atoms/RatingStars'
import { cn } from '@/lib/cn'
import { getImage } from '@/assets/images'

const CARD_CLASS = 'flex h-[366px] w-[299px] shrink-0 flex-col items-center gap-3 rounded-xl border border-[#727B8E]/10 p-6'

export interface FeedbackAuthor {
  name: string
  role: string
}

export interface FeedbackCardDefaultProps {
  variant?: 'default'
  quote: string
  author: FeedbackAuthor
  isPartiallyVisible?: boolean
}

export interface FeedbackCardVideoProps {
  variant: 'video'
  author: FeedbackAuthor
  imageSrc?: string
}

export type FeedbackCardProps = FeedbackCardDefaultProps | FeedbackCardVideoProps

export function FeedbackCard(props: FeedbackCardProps) {
  const { author, variant = 'default' } = props

  if (variant === 'video') {
    const { imageSrc } = props as FeedbackCardVideoProps
    return (
      <div
        className={CARD_CLASS}
        style={{
          background: `linear-gradient(0deg, rgba(255,255,255,0.82), rgba(255,255,255,0.82)), url(${imageSrc ?? getImage('bg_video_feedback_card').src}) center/cover no-repeat`,
        }}
      >
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-[22px]">
          <button
            type="button"
            aria-label="Reproduzir depoimento"
            className="flex h-[47px] w-[47px] items-center justify-center rounded-[34px] border border-[#727B8E]/10 bg-[#202026] transition-opacity hover:opacity-80"
          >
            <Play className="h-3 w-3 fill-white text-white" />
          </button>
        </div>
        <FeedbackAuthorRow author={author} />
      </div>
    )
  }

  const { quote, isPartiallyVisible } = props as FeedbackCardDefaultProps

  return (
    <div className={cn(CARD_CLASS, 'bg-white')}>
      <div className="flex flex-1 flex-col gap-[22px]">
        <div className="h-[68px] w-[68px] shrink-0 rounded-full bg-[#D9D9D9]" aria-hidden="true" />
        <p
          className={cn(
            'text-base font-light leading-[23px] text-[#434A57]',
            isPartiallyVisible &&
              'bg-gradient-to-r from-[#434A57] to-white bg-clip-text text-transparent',
          )}
          style={{ letterSpacing: 'var(--tracking-feedback)' }}
        >
          {quote}
        </p>
      </div>
      <FeedbackAuthorRow author={author} />
    </div>
  )
}

function FeedbackAuthorRow({ author }: { author: FeedbackAuthor }) {
  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex flex-col gap-1">
        <span
          className="text-lg font-medium leading-[23px] text-[#12141B]"
          style={{ letterSpacing: 'var(--tracking-feedback)' }}
        >
          {author.name}
        </span>
        <span
          className="text-xs font-light leading-[23px] text-[#12141B]"
          style={{ letterSpacing: 'var(--tracking-feedback)' }}
        >
          {author.role}
        </span>
      </div>
      <RatingStars />
    </div>
  )
}
