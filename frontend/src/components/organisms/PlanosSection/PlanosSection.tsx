import { SectionHeader } from '@/components/molecules/SectionHeader'

const plans = [
  {
    label: 'MENSAL',
    price: 'R$359,00',
    benefit: 'Renovação após 30 dias',
  },
  {
    label: 'ANUAL',
    price: 'R$290,00',
    benefit: 'Economize R$658,00 por ano!',
  },
]

export function PlanosSection() {
  return (
    <section className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
      <div className="flex flex-col items-center gap-10">
        <SectionHeader
          label="PORQUE A AUZAP?"
          title={'Nossos planos'}
          description=""
          align="center"
        />
        <div className="flex flex-col gap-6 md:flex-row md:justify-center">
          {plans.map((plan) => (
            <div
              key={plan.label}
              className="flex w-full flex-col gap-[10px] rounded-xl border border-[rgba(114,123,142,0.1)] bg-[#24242A] p-6 md:w-[454px]"
            >
              <div className="flex flex-col gap-3">
                <span className="text-xs font-manrope font-extrabold tracking-[3px] text-[#1E62EC]">
                  {plan.label}
                </span>
                <p className="font-sans text-[36px] font-bold leading-[42px] tracking-[-1.92px] text-[#FAFAFA]">
                  {plan.price}
                </p>
                <p className="text-base font-normal leading-[27px] text-[#727B8E]">
                  {plan.benefit}
                </p>
              </div>
              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1E62EC] px-3 py-3 text-base font-normal leading-[22px] tracking-[-0.32px] text-white">
                Teste grátis
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 9L11 1M11 1H3M11 1V8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
