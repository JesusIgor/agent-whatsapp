import { useRef, useCallback } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { FeedbackCard, type FeedbackCardProps, type FeedbackAuthor } from '@/components/molecules/FeedbackCard'

const CARD_WIDTH = 299
const CARD_GAP = 18

const AUTHOR: FeedbackAuthor = { name: 'Jonas W.', role: 'CEO, empresa.' }

const QUOTE =
  '"Com a Auzap, parei de perder vendas no WhatsApp. Agora cada cliente é atendido e minha agenda vive cheia."'

const feedbacks: (FeedbackCardProps & { id: number })[] = [
  { id: 1, variant: 'default', quote: QUOTE, author: AUTHOR },
  { id: 2, variant: 'video', author: AUTHOR },
  { id: 3, variant: 'default', quote: QUOTE, author: AUTHOR },
  { id: 4, variant: 'default', quote: QUOTE, author: AUTHOR, isPartiallyVisible: true },
]

export function FeedbacksSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const scroll = (direction: 'prev' | 'next') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({
      left: direction === 'next' ? CARD_WIDTH + CARD_GAP : -(CARD_WIDTH + CARD_GAP),
      behavior: 'smooth',
    })
  }

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return
    isDragging.current = true
    startX.current = e.pageX - scrollRef.current.offsetLeft
    scrollLeft.current = scrollRef.current.scrollLeft
    scrollRef.current.style.cursor = 'grabbing'
  }, [])

  const onMouseUp = useCallback(() => {
    isDragging.current = false
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab'
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = x - startX.current
    scrollRef.current.scrollLeft = scrollLeft.current - walk
  }, [])

  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 py-20 lg:px-10">
      <div className="flex items-start justify-between gap-8">
        <div className="flex flex-col gap-3">
          <span
            className="font-manrope text-xs font-extrabold text-[#1E62EC]"
            style={{ letterSpacing: 'var(--tracking-label)' }}
          >
            FEEDBACKS
          </span>
          <div className="flex flex-col gap-3">
            <h2
              className="max-w-[582px] text-3xl font-bold leading-[42px] text-[#070707] md:text-[32px]"
              style={{ letterSpacing: 'var(--tracking-heading)' }}
            >
              Confiado por negócios pet em todo o Brasil
            </h2>
            <p className="max-w-[708px] text-base leading-[23px] text-[#727B8E]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => scroll('prev')}
            aria-label="Anterior"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#727B8E]/10 bg-white transition-colors hover:bg-[#F5F5F5]"
          >
            <ArrowLeft className="h-[14px] w-[14px] text-[#727B8E]" strokeWidth={1.32} />
          </button>
          <button
            type="button"
            onClick={() => scroll('next')}
            aria-label="Próximo"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#727B8E]/10 bg-white transition-colors hover:bg-[#F5F5F5]"
          >
            <ArrowRight className="h-[14px] w-[14px] text-[#1A1A20]" strokeWidth={1.32} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        role="region"
        aria-label="Depoimentos de clientes"
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onMouseMove={onMouseMove}
        style={{ scrollSnapType: 'x mandatory', cursor: 'grab' }}
        className="mt-8 flex gap-[18px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden select-none"
      >
        {feedbacks.map((item) => (
          <div key={item.id} style={{ scrollSnapAlign: 'start' }}>
            <FeedbackCard {...item} />
          </div>
        ))}
      </div>
    </section>
  )
}
