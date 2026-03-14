import { ArrowUpRight } from 'lucide-react'
import { SectionHeader } from '@/components/molecules/SectionHeader'
import { ProblemaCard } from '@/components/molecules/ProblemaCard'

const cards = [
  {
    title: 'Secretaria menos sobrecarregada',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    title: 'Atendimento personalizado',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    title: 'Diversos idiomas',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
]

export function ChegouSection() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 py-20 lg:px-10">
      <SectionHeader
        titleMaxWidth='480px'
        label="A Auzap Chegou"
        title="Você faz o que ama, nós cuidamos do seu atendimento"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      />

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {cards.map((card, i) => (
          <ProblemaCard key={`chegou-${i}`} {...card} />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          className="flex font-sans max-w-[214px] items-center gap-2.5 rounded-lg bg-[#1E62EC] p-3 text-base text-white transition-colors hover:bg-[#1A56D4]"
        >
          Acessar plataforma
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  )
}