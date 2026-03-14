import { useState } from 'react'
import { StepHeader, StepFooter, ServiceCheckbox } from '../components'

const DIFFERENTIALS = [
  'Estacionamento',
  'Atendimento 24h',
  'Wi-Fi gratuito',
  'Aceita cartões',
  'Certificado/Licenciado',
  'Cuidado especial',
  'Equipe especializada',
  'Entrega/Delivery',
]

interface DifferentialsStepProps {
  currentStep: number
  totalSteps: number
  data: string[]
  onNext: (data: string[]) => void
}

export function DifferentialsStep({ currentStep, totalSteps, data, onNext }: DifferentialsStepProps) {
  const [selected, setSelected] = useState<string[]>(data)

  const toggle = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    )
  }

  return (
    <div className="flex w-full max-w-[426px] flex-col items-center gap-[41px]">
      <StepHeader
        title="Quais são seus diferenciais?"
        subtitle="Diga o que torna seu petshop especial e único para seus clientes"
      />

      <div className="flex w-full flex-col gap-3">
        <p className="font-be-vietnam-pro text-base font-semibold text-[#434A57]">
          Diferenciais do seu local<span className="text-[#1E62EC]">*</span>
        </p>
        <div className="flex flex-col gap-2">
          {DIFFERENTIALS.map((item) => (
            <ServiceCheckbox
              key={item}
              label={item}
              checked={selected.includes(item)}
              onChange={() => toggle(item)}
            />
          ))}
        </div>
      </div>

      <StepFooter
        currentStep={currentStep}
        totalSteps={totalSteps}
        nextHint="Na próxima etapa, iremos definir seus serviços de estética"
        onNext={() => onNext(selected)}
      />
    </div>
  )
}
