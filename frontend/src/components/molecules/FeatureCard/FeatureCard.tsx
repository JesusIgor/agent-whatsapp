import { Icon } from '@/components/atoms/Icon'

interface FeatureCardProps {
  title: string
  description: string
}

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-[#727B8E]/10 bg-[#FFFFFF] p-6">
      <Icon name="cat" />
      <h3
        className="text-lg font-bold text-[#070707]"
        style={{ letterSpacing: '-0.5px' }}
      >
        {title}
      </h3>
      <p className="text-sm font-normal text-justify text-[#727B8E]">{description}</p>
    </div>
  )
}