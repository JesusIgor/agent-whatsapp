import { SectionHeader } from '@/components/molecules/SectionHeader'
import { FeatureCard } from '@/components/molecules/FeatureCard'

const features = [
  {
    title: 'Fale conosco!',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis.',
  },
  {
    title: 'Fale conosco!',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis.',
  },
  {
    title: 'Fale conosco!',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis.',
  },
  {
    title: 'Fale conosco!',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis.',
  },
]

export function FeaturesSection() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 py-20 lg:px-10">
      <SectionHeader
        label="Lorem Ipsum"
        titleMaxWidth='600px'
        title="Enquanto você cuida dos pets, a AuZap mantém sua agenda cheia."
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      />

      <div className="mt-12 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, i) => (
          <FeatureCard key={`feature-${i}`} {...feature} />
        ))}
      </div>
    </section>
  )
}
