import { SectionHeader } from '@/components/molecules/SectionHeader'
import { ComparisonCard } from '@/components/molecules/ComparisonCard'

const withoutItems = [
  'Demora dias para configurar',
  'Precisa de equipe de TI dedicada',
  'Respostas genéricas sem personalização',
  'Sem dados ou relatórios úteis',
  'Conversas soltas sem registro estruturado',
  'Atendem qualquer segmento, sem especialização',
]

const withItems = [
  'Implementamos em menos de 5 minutos',
  'Sem auxílio técnico especializado em TI',
  'Clientes ativos e vendas de forma automática',
  'Agendamento de serviços direto no WhatsApp',
  'CRM que organiza dados automaticamente',
  'Feito exclusivamente para o mercado pet',
]

export function PorqueSection() {
  return (
    <section className="mx-auto w-full px-6 py-20 lg:px-10">
      <div className="rounded-2xl bg-[#202026] px-6 py-10 md:px-[148px] md:py-[91px]">
        <div className="flex flex-col gap-10">
          <SectionHeader
            titleColor="white"
            label="Porque a AuZap?"
            title="Somos diferentes de tudo o que você já viu"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
          />
          <div className="grid gap-6 md:grid-cols-2">
            <ComparisonCard title="Sem AuZap" items={withoutItems} variant="without" />
            <ComparisonCard title="Com a AuZap.AI" items={withItems} variant="with" />
          </div>
        </div>
      </div>
    </section>
  )
}
