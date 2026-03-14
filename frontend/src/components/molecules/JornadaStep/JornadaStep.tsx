import { Icon } from '@/components/atoms/Icon/Icon'

interface JornadaStepProps {
  title: string
  description: string
}

export function JornadaStep({ title, description }: JornadaStepProps) {
  return (
    <div className="w-full border-[#727B8E1A] bg-white p-6 rounded-xl border">
      <div className="overflow-hidden rounded-2xl border border-[#727B8E]/10 bg-[#E8E8E8]">
        <div className="aspect-32/9 w-full bg-[#D9D9D9]" />
      </div>
      <div className="mt-6 flex items-start gap-3">
        <Icon name="cat" />
        <div className="flex flex-col gap-3">
          <h3
            className="text-lg font-bold text-[#070707]"
            style={{ letterSpacing: '-0.5px' }}
          >
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-[#727B8E]">{description}</p>
        </div>
      </div>
    </div>
  )
}
